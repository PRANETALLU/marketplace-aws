const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const buyerId = claims?.sub;
  if (!buyerId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const order = JSON.parse(event.body);
  order.orderId = `order_${Date.now()}`;
  order.buyerId = buyerId;
  order.orderDate = new Date().toISOString();
  order.status = "pending";

  await db.put({ TableName: "OrdersTable", Item: order }).promise();
  return { statusCode: 201, body: JSON.stringify(order) };
};