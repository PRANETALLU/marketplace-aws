const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const CARTS_TABLE = process.env.CARTS_TABLE || "CartsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

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

  const userId = getClaims(event)?.sub;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const result = await db.get({ TableName: CARTS_TABLE, Key: { userId } }).promise();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item || { userId, items: [] }),
    };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ message: "Failed to fetch cart" }) };
  }
};
