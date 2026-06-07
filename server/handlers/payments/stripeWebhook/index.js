const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: process.env.AWS_REGION || "us-east-1" });
const db = new AWS.DynamoDB.DocumentClient();
const CARTS_TABLE = process.env.CARTS_TABLE || "CartsTable";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || "";

const sendEmail = async ({ to, subject, body }) => {
  if (!SES_FROM_EMAIL || !to) return;
  await ses.sendEmail({
    Source: SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  }).promise();
};

const formatAmount = (cents) => `$${(cents / 100).toFixed(2)}`;

exports.handler = async (event) => {
  const sig = event.headers?.["Stripe-Signature"] || event.headers?.["stripe-signature"];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Ignored" };
  }

  const session = stripeEvent.data.object;
  const { buyerId, buyerEmail, sellerEmails: sellerEmailsJson, description } = session.metadata || {};
  const total = formatAmount(session.amount_total || 0);
  const sellerEmails = sellerEmailsJson ? JSON.parse(sellerEmailsJson) : [];

  console.log("Payment completed:", { buyerId, buyerEmail, sellerEmails, description, total });

  // Clear the buyer's cart
  if (buyerId) {
    try {
      await db.update({
        TableName: CARTS_TABLE,
        Key: { userId: buyerId },
        UpdateExpression: "SET #items = :empty, updatedAt = :now",
        ExpressionAttributeNames: { "#items": "items" },
        ExpressionAttributeValues: { ":empty": [], ":now": new Date().toISOString() },
      }).promise();
      console.log("Cart cleared for user:", buyerId);
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
    }
  }

  const emailJobs = [];

  if (buyerEmail) {
    emailJobs.push(
      sendEmail({
        to: buyerEmail,
        subject: "Your payment was successful!",
        body: [
          `Hi there,`,
          ``,
          `Your payment of ${total} was successful.`,
          ``,
          `Order summary: ${description || "See your order history for details."}`,
          ``,
          `Thank you for your purchase!`,
        ].join("\n"),
      })
    );
  }

  for (const sellerEmail of sellerEmails) {
    emailJobs.push(
      sendEmail({
        to: sellerEmail,
        subject: "You have a new sale!",
        body: [
          `Hi,`,
          ``,
          `Great news — you just made a sale!`,
          ``,
          `Items sold: ${description || "See your order history for details."}`,
          `Total received: ${total}`,
          ``,
          `Log in to your marketplace dashboard to view the order.`,
        ].join("\n"),
      })
    );
  }

  try {
    await Promise.all(emailJobs);
    console.log("Emails sent successfully");
  } catch (err) {
    console.error("SES email error:", err.message);
    // Don't fail the webhook — Stripe will retry if we return non-2xx
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
