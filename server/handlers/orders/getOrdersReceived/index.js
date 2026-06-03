const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";
const ORDERS_TABLE = process.env.ORDERS_TABLE || "OrdersTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const sellerId = getClaims(event)?.sub;
  if (!sellerId) return response(401, { message: "Unauthorized" });

  try {
    // Scan products by this seller (ProductsTable has no sellerId GSI, so scan with filter)
    const productRes = await db.scan({
      TableName: PRODUCTS_TABLE,
      FilterExpression: "sellerId = :sellerId",
      ExpressionAttributeValues: { ":sellerId": sellerId },
      ProjectionExpression: "productId",
    }).promise();

    const productIds = (productRes.Items || []).map(p => p.productId);
    if (productIds.length === 0) return response(200, []);

    // Scan all orders and filter for this seller's products
    const orderRes = await db.scan({ TableName: ORDERS_TABLE }).promise();
    const sellerOrders = (orderRes.Items || []).filter(order => productIds.includes(order.productId));

    return response(200, sellerOrders);
  } catch (err) {
    console.error("getOrdersReceived error:", err);
    return response(500, { message: "Internal server error." });
  }
};
