const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const buyerId = claims?.sub;
  if (!buyerId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const result = await db.scan({
    TableName: "OrdersTable",
    FilterExpression: "buyerId = :buyerId",
    ExpressionAttributeValues: { ":buyerId": buyerId }
  }).promise();

  return { statusCode: 200, body: JSON.stringify(result.Items) };
};