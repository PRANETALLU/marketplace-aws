const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const res = (code, body) => ({
  statusCode: code,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

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
