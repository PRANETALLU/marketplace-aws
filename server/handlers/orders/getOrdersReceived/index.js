const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const claims = event.requestContext.authorizer?.claims;
  const sellerId = claims?.sub;
  if (!sellerId) return response(401, { message: "Unauthorized" });

  // Get all products by this seller
  const productRes = await db.query({
    TableName: "ProductsTable",
    KeyConditionExpression: "sellerId = :sellerId",
    ExpressionAttributeValues: { ":sellerId": sellerId }
  }).promise();
  const productIds = productRes.Items.map(p => p.productId);

  // Scan all orders where productId is in the seller's products
  const orderRes = await db.scan({ TableName: "OrdersTable" }).promise();
  const sellerOrders = orderRes.Items.filter(order => productIds.includes(order.productId));

  return response(200, sellerOrders);
};