const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const REVIEWS_TABLE = process.env.REVIEWS_TABLE || "ReviewsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const productId = event.pathParameters?.productId;
    if (!productId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "`productId` path parameter is required." }),
      };
    }

    const result = await db.scan({
      TableName: REVIEWS_TABLE,
      FilterExpression: "productId = :pid",
      ExpressionAttributeValues: { ":pid": productId },
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error fetching product reviews:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
