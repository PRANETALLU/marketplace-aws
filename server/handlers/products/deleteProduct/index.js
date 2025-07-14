const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const { productId } = event.pathParameters;
  await db.delete({ TableName: "ProductsTable", Key: { productId } }).promise();
  return { statusCode: 200, body: JSON.stringify({ message: "Product deleted." }) };
};