const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

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

  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Unauthorized" })
    };
  }

  try {
    const result = await db.scan({
      TableName: "ProductsTable",
      FilterExpression: "sellerId = :sellerId",
      ExpressionAttributeValues: { ":sellerId": userId }
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
