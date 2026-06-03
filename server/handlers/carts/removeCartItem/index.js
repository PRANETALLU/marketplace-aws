const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const CARTS_TABLE = process.env.CARTS_TABLE || "CartsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "DELETE,OPTIONS",
};

const res = (code, body, isEmpty = false) => ({
  statusCode: code,
  headers: corsHeaders,
  body: isEmpty ? "" : JSON.stringify(body),
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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const userId = getClaims(event)?.sub;
    if (!userId) return res(401, { message: "Unauthorized" });

    const productId = event.pathParameters?.productId;
    if (!productId) return res(400, { message: "`productId` path parameter is required." });

    const cartResult = await db.get({ TableName: CARTS_TABLE, Key: { userId } }).promise();
    const cart = cartResult.Item;
    if (!cart) return res(404, { message: "Cart not found" });

    const updatedItems = (cart.items || []).filter(item => item.productId !== productId);

    await db.update({
      TableName: CARTS_TABLE,
      Key: { userId },
      UpdateExpression: "SET #items = :items, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#items": "items" },
      ExpressionAttributeValues: { ":items": updatedItems, ":updatedAt": new Date().toISOString() },
    }).promise();

    return res(204, "", true);
  } catch (err) {
    console.error("removeCartItem error:", err);
    return res(500, { message: "Internal server error." });
  }
};
