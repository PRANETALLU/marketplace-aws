const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const ORDERS_TABLE = process.env.ORDERS_TABLE || "OrdersTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const getClaims = (event) => {
  const authorizerClaims = event.requestContext?.authorizer?.claims;
  if (authorizerClaims) return authorizerClaims;

  const authorization = event.headers?.Authorization || event.headers?.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch (error) {
    console.error("Invalid authorization token:", error);
    return null;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const claims = getClaims(event);
  const buyerId = claims?.sub;

  if (!buyerId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Unauthorized" })
    };
  }

  try {
    const result = await db.scan({
      TableName: ORDERS_TABLE,
      FilterExpression: "buyerId = :buyerId",
      ExpressionAttributeValues: {
        ":buyerId": buyerId
      }
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error("Error querying orders:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
