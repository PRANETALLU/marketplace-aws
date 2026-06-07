const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const ses = new AWS.SES({ region: process.env.AWS_REGION || "us-east-1" });
const db = new AWS.DynamoDB.DocumentClient();
const CARTS_TABLE = process.env.CARTS_TABLE || "CartsTable";
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";
const ORDERS_TABLE = process.env.ORDERS_TABLE || "OrdersTable";
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE || "TransactionsTable";

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
  const { buyerId, buyerEmail, sellerEmails: sellerEmailsJson, description, items: itemsJson } = session.metadata || {};
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

  // Parse purchased items once — used for both stock decrement and order record
  let purchasedItems = [];
  if (itemsJson) {
    try {
      purchasedItems = JSON.parse(itemsJson);
    } catch (err) {
      console.error("Failed to parse items metadata:", err.message);
    }
  }

  // Decrement product quantities
  if (purchasedItems.length > 0) {
    await Promise.all(
      purchasedItems.map(({ p: productId, q: qty }) =>
        db.update({
          TableName: PRODUCTS_TABLE,
          Key: { productId },
          UpdateExpression: "SET quantity = if_not_exists(quantity, :zero) - :qty, updatedAt = :now",
          ConditionExpression: "quantity >= :qty",
          ExpressionAttributeValues: {
            ":qty": qty,
            ":zero": 0,
            ":now": new Date().toISOString(),
          },
        }).promise().catch((err) => {
          console.error(`Failed to decrement quantity for product ${productId}:`, err.message);
        })
      )
    );
    console.log("Product quantities decremented for items:", purchasedItems);
  }

  // Create order record
  const orderId = `order_${uuidv4()}`;
  const now = new Date().toISOString();
  const orderItems = purchasedItems.map(({ p, q }) => ({ productId: p, quantity: q }));

  try {
    await db.put({
      TableName: ORDERS_TABLE,
      Item: {
        orderId,
        buyerId: buyerId || "",
        buyerEmail: buyerEmail || "",
        items: orderItems,
        totalAmount: (session.amount_total || 0) / 100,
        currency: session.currency || "usd",
        status: "paid",
        stripeSessionId: session.id,
        description: description || "",
        createdAt: now,
        updatedAt: now,
      },
    }).promise();
    console.log("Order created:", orderId);
  } catch (err) {
    console.error("Failed to create order:", err.message);
  }

  // Create transaction record
  try {
    await db.put({
      TableName: TRANSACTIONS_TABLE,
      Item: {
        transactionId: `txn_${session.id}`,
        buyerId: buyerId || "",
        buyerEmail: buyerEmail || "",
        orderId,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || "usd",
        stripeSessionId: session.id,
        description: description || "",
        status: "completed",
        createdAt: now,
      },
    }).promise();
    console.log("Transaction created for session:", session.id);
  } catch (err) {
    console.error("Failed to create transaction:", err.message);
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
