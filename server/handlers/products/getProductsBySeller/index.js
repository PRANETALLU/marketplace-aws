const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const result = await db.scan({
    TableName: "ProductsTable",
    FilterExpression: "sellerId = :sellerId",
    ExpressionAttributeValues: { ":sellerId": userId }
  }).promise();

  return { statusCode: 200, body: JSON.stringify(result.Items) };
};