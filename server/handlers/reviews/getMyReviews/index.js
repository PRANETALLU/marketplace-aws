const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const claims = event.requestContext?.authorizer?.claims;
    const buyerId = claims?.sub;

    if (!buyerId) {
      return response(401, { message: "Unauthorized" });
    }

    // Scan Reviews table for reviews by this user
    const result = await db.scan({
      TableName: "ReviewsTable",
      FilterExpression: "buyerId = :bid",
      ExpressionAttributeValues: {
        ":bid": buyerId,
      },
    }).promise();

    return response(200, result.Items || []);

  } catch (err) {
    console.error("Error fetching user reviews:", err);
    return response(500, { message: "Internal server error." });
  }
};
