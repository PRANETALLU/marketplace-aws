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

  const { id } = event.pathParameters;
  const { status } = JSON.parse(event.body);

  await db.update({
    TableName: "OrdersTable",
    Key: { orderId: id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": status }
  }).promise();

  return response(200, { message: "Order status updated." });
};
