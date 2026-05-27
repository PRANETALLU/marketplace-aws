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

  console.log('Full Event', event);
  const claims = event.requestContext.authorizer?.claims;
  console.log('claims', claims);
  const userId = claims?.sub;
  console.log('UserID', event);

  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { productId } = event.pathParameters;
  const result = await db.get({ TableName: "ProductsTable", Key: { productId } }).promise();

  console.log('Fetched item:', result);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.Item),
  };
};
