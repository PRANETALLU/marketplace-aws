const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const REVIEWS_TABLE = process.env.REVIEWS_TABLE || "ReviewsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const response = (status, body) => ({
  statusCode: status,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

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
    if (!buyerId) return response(401, { message: "Unauthorized" });

    const result = await db.scan({
      TableName: REVIEWS_TABLE,
      FilterExpression: "buyerId = :bid",
      ExpressionAttributeValues: { ":bid": buyerId },
    }).promise();

    return response(200, result.Items || []);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    return response(500, { message: "Internal server error." });
  }
};
