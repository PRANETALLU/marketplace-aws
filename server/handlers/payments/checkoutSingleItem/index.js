const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const rawClientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const CLIENT_URL = /^https?:\/\//i.test(rawClientUrl) ? rawClientUrl : `https://${rawClientUrl}`;
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

    let parsedBody = {};
    try {
      parsedBody = JSON.parse(event.body || "{}");
    } catch {
      return response(400, { error: "Invalid request body" });
    }
    const { productId, quantity } = parsedBody;

    const productResult = await db.get({
      TableName: PRODUCTS_TABLE,
      Key: { productId },
    }).promise();

    const product = productResult.Item;

    if (!product) {
      return response(404, { error: "Product not found" });
    }

    const unit_amount = Math.round((product.price || 0) * 100);
    if (unit_amount < 50) {
      return response(400, { error: "Product price must be at least $0.50 to check out" });
    }

    const productName = product.productName || product.title || "Item";
    const sellerEmail = await getSellerEmail(product.sellerId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount,
            product_data: {
              name: productName,
              description: product.description,
            },
          },
          quantity,
        },
      ],
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cart`,
      metadata: {
        buyerId: claims?.sub || "",
        buyerEmail: buyerEmail || "",
        sellerEmails: sellerEmail ? JSON.stringify([sellerEmail]) : "[]",
        description: `${productName} x${quantity}`,
      },
    });

    return response(200, { url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return response(500, { error: "Failed to create Stripe session", detail: err.message });
  }
};
