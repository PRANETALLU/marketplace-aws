const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const { productId } = event.pathParameters;
  const updates = JSON.parse(event.body);
  const updateExpression = `set ${Object.keys(updates).map((k, i) => `#${k} = :v${i}`).join(", ")}`;
  const expressionAttrNames = Object.keys(updates).reduce((acc, k) => ({ ...acc, [`#${k}`]: k }), {});
  const expressionAttrValues = Object.values(updates).reduce((acc, v, i) => ({ ...acc, [`:v${i}`]: v }), {});

  await db.update({
    TableName: "ProductsTable",
    Key: { productId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttrNames,
    ExpressionAttributeValues: expressionAttrValues
  }).promise();

  return { statusCode: 200, body: JSON.stringify({ message: "Product updated." }) };
};