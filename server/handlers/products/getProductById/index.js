const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";

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

  const { productId } = event.pathParameters;
  const result = await db.get({ TableName: PRODUCTS_TABLE, Key: { productId } }).promise();

  console.log('Fetched item:', result);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.Item),
  };
};
