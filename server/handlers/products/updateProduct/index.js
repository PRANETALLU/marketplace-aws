const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "PUT,OPTIONS",
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
  const userId = claims?.sub;
  if (!userId) return response(401, { message: "Unauthorized" });

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

  return response(200, { message: "Product updated." });
};