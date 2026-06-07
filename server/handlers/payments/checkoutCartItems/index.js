const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

const getClaims = (event) => {
  const c = event.requestContext?.authorizer?.claims;
  if (c) return c;
  const auth = event.headers?.Authorization || event.headers?.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    return JSON.parse(Buffer.from(auth.split(".")[1], "base64url").toString("utf8"));
  } catch { return null; }
};

const getSellerEmail = async (sellerId) => {
  if (!COGNITO_USER_POOL_ID || !sellerId) return null;
  try {
    const result = await cognito.listUsers({
      UserPoolId: COGNITO_USER_POOL_ID,
      Filter: `sub = "${sellerId}"`,
      Limit: 1,
    }).promise();
    return result.Users[0]?.Attributes?.find((a) => a.Name === "email")?.Value || null;
  } catch (err) {
    console.warn("Could not fetch seller email:", err.message);
    return null;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const claims = getClaims(event);
    const buyerEmail = claims?.email || null;

    const { cartItems } = JSON.parse(event.body);

    const line_items = [];
    const sellerIdSet = new Set();
    const itemNames = [];

    for (const item of cartItems) {
      const productResult = await db.get({
        TableName: PRODUCTS_TABLE,
        Key: { productId: item.productId },
      }).promise();

      const product = productResult.Item;
      if (!product) continue;

      const unit_amount = Math.round((product.price || 0) * 100);
      if (unit_amount < 50) continue;

      if (product.sellerId) sellerIdSet.add(product.sellerId);

      const productName = product.productName || product.title || "Item";
      itemNames.push(`${productName} x${item.quantity}`);

      line_items.push({
        price_data: {
          currency: "usd",
          unit_amount,
          product_data: {
            name: productName,
            description: product.description,
          },
        },
        quantity: item.quantity,
      });
    }

    if (line_items.length === 0) {
      return response(400, { error: "No valid products found" });
    }

    // Fetch unique seller emails in parallel
    const sellerEmails = (
      await Promise.all([...sellerIdSet].map(getSellerEmail))
    ).filter(Boolean);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cart`,
      metadata: {
        buyerId: claims?.sub || "",
        buyerEmail: buyerEmail || "",
        sellerEmails: JSON.stringify(sellerEmails),
        description: itemNames.join(", ").slice(0, 490), // Stripe metadata value limit: 500 chars
      },
    });

    return response(200, { url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return response(500, { error: "Stripe session creation failed", detail: err.message });
  }
};
