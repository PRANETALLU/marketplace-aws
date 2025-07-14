const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const res = (code, body) => ({
  statusCode: code,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const transactionId = event.pathParameters?.transactionId;
    if (!transactionId) {
      return res(400, { message: "transactionId path parameter is required" });
    }

    const result = await db.get({
      TableName: "TransactionsTable",
      Key: { transactionId }
    }).promise();

    if (!result.Item) {
      return res(404, { message: "Transaction not found" });
    }

    return res(200, result.Item);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    return res(500, { message: "Internal server error" });
  }
};
