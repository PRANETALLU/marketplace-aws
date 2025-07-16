const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

  const { id } = event.pathParameters;
  const { status } = JSON.parse(event.body);

  await db.update({
    TableName: "OrdersTable",
    Key: { orderId: id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": status }
  }).promise();

  return { statusCode: 200, body: JSON.stringify({ message: "Order status updated." }) };
};
