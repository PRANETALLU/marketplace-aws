const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const db = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

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
  const userId = claims?.sub;

  if (!userId) {
    return response(401, { message: "Unauthorized. Login required." });
  }

  const body = JSON.parse(event.body);
  const productId = uuidv4();
  const timestamp = new Date().toISOString();

  const item = {
    productId,
    sellerId: userId,
    productName: body.productName,
    description: body.description,
    price: body.price,
    category: body.category,
    quantity: body.quantity,
    status: "available",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await db.put({
    TableName: PRODUCTS_TABLE,
    Item: item
  }).promise();

  return response(201, item);
};
