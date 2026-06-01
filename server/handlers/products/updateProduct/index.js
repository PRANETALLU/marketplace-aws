const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";
const PRODUCT_IMAGES_BUCKET = process.env.PRODUCT_IMAGES_BUCKET;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "PUT,OPTIONS",
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
  if (!userId) return response(401, { message: "Unauthorized" });

  const { productId } = event.pathParameters;
  let updates;
  try {
    updates = JSON.parse(event.body || "{}");
  } catch (error) {
    return response(400, { message: "Invalid request body." });
  }

  const blockedFields = new Set(["productId", "sellerId", "createdAt"]);
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key, value]) => !blockedFields.has(key) && value !== undefined)
  );

  if (filteredUpdates.imageKey) {
    if (!filteredUpdates.imageKey.startsWith(`product-images/${userId}/`)) {
      return response(400, { message: "Invalid product image key." });
    }

    filteredUpdates.imageUrl =
      filteredUpdates.imageUrl ||
      `https://${PRODUCT_IMAGES_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filteredUpdates.imageKey}`;
  }

  filteredUpdates.updatedAt = new Date().toISOString();

  const entries = Object.entries(filteredUpdates);
  if (entries.length === 0) {
    return response(400, { message: "No valid product updates provided." });
  }

  const updateExpression = `set ${entries.map(([key], i) => `#${key} = :v${i}`).join(", ")}`;
  const expressionAttrNames = entries.reduce((acc, [key]) => ({ ...acc, [`#${key}`]: key }), {
    "#sellerId": "sellerId",
  });
  const expressionAttrValues = entries.reduce((acc, [, value], i) => ({ ...acc, [`:v${i}`]: value }), {
    ":sellerId": userId,
  });

  await db.update({
    TableName: PRODUCTS_TABLE,
    Key: { productId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttrNames,
    ExpressionAttributeValues: expressionAttrValues,
    ConditionExpression: "#sellerId = :sellerId"
  }).promise();

  return response(200, { message: "Product updated." });
};