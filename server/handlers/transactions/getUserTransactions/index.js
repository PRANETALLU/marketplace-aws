const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const res = (code, body) => ({
  statusCode: code,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const buyerId = event.requestContext?.authorizer?.claims?.sub;
    if (!buyerId) return res(401, { message: "Unauthorized" });

    const data = await db.scan({
      TableName: "TransactionsTable",
      FilterExpression: "buyerId = :id",
      ExpressionAttributeValues: {
        ":id": buyerId
      }
    }).promise();

    return res(200, data.Items || []);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res(500, { message: "Internal server error" });
  }
};
