const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE || "TransactionsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const res = (code, body) => ({ statusCode: code, headers: corsHeaders, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const transactionId = event.pathParameters?.transactionId;
    if (!transactionId) return res(400, { message: "transactionId path parameter is required" });

    const result = await db.get({ TableName: TRANSACTIONS_TABLE, Key: { transactionId } }).promise();
    if (!result.Item) return res(404, { message: "Transaction not found" });

    return res(200, result.Item);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    return res(500, { message: "Internal server error" });
  }
};
