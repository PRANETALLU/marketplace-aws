const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TRANSACTIONS_TABLE = process.env.TRANSACTIONS_TABLE || "TransactionsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const res = (code, body) => ({ statusCode: code, headers: corsHeaders, body: JSON.stringify(body) });

const getClaims = (event) => {
  const c = event.requestContext?.authorizer?.claims;
  if (c) return c;
  const auth = event.headers?.Authorization || event.headers?.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    return JSON.parse(Buffer.from(auth.split(".")[1], "base64url").toString("utf8"));
  } catch { return null; }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const buyerId = getClaims(event)?.sub;
    if (!buyerId) return res(401, { message: "Unauthorized" });

    const data = await db.scan({
      TableName: TRANSACTIONS_TABLE,
      FilterExpression: "buyerId = :id",
      ExpressionAttributeValues: { ":id": buyerId },
    }).promise();

    return res(200, data.Items || []);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res(500, { message: "Internal server error" });
  }
};
