const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const sellerId = claims?.sub;
  if (!sellerId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

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

  return { statusCode: 200, body: JSON.stringify(sellerOrders) };
};