const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const item = JSON.parse(event.body);
  item.cartId = `cart_${Date.now()}`;
  item.userId = userId;
  item.createdAt = new Date().toISOString();
  item.updatedAt = item.createdAt;

  await db.put({ TableName: "CartsTable", Item: item }).promise();
  return { statusCode: 201, body: JSON.stringify(item) };
};