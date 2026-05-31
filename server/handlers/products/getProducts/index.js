const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  /*const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;

  console.log("Authorizer:", JSON.stringify(event.requestContext.authorizer));
  console.log("Claims:", claims);

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized." })
    };
  }*/

  console.log("Full event:", JSON.stringify(event));

  try {
    const result = await db.scan({
      TableName: PRODUCTS_TABLE,
      FilterExpression: "#status = :available",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":available": "available"
      }
    }).promise();

    return response(200, result.Items);
  } catch (error) {
    return response(500, { message: "Error fetching products", error: error.message });
  }
};
