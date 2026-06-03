const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const CARTS_TABLE = process.env.CARTS_TABLE || "CartsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const getClaims = (event) => {
  const c = event.requestContext?.authorizer?.claims;
  if (c) return c;
  const auth = event.headers?.Authorization || event.headers?.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    return JSON.parse(Buffer.from(auth.split(".")[1], "base64url").toString("utf8"));
  } catch { return null; }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const userId = getClaims(event)?.sub;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const { productId, quantity } = JSON.parse(event.body);
  if (!productId || !quantity || quantity < 1) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "productId and quantity (>=1) are required" }) };
  }

  try {
    const result = await db.get({ TableName: CARTS_TABLE, Key: { userId } }).promise();
    let cart = result.Item;

    if (!cart) {
      cart = {
        userId,
        cartId: `cart_${Date.now()}`,
        items: [{ productId, quantity }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      const idx = cart.items.findIndex(item => item.productId === productId);
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      cart.updatedAt = new Date().toISOString();
    }

    await db.put({ TableName: CARTS_TABLE, Item: cart }).promise();
    return {
      statusCode: cart.createdAt === cart.updatedAt ? 201 : 200,
      headers: corsHeaders,
      body: JSON.stringify(cart),
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
