const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const ORDERS_TABLE = process.env.ORDERS_TABLE || "OrdersTable";
const REVIEWS_TABLE = process.env.REVIEWS_TABLE || "ReviewsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const response = (status, body) => ({
  statusCode: status,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

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

  try {
    const buyerId = getClaims(event)?.sub;
    if (!buyerId) return response(401, { message: "Unauthorized" });

    const productId = event.pathParameters?.productId;
    if (!productId) return response(400, { message: "`productId` path parameter is required." });

    const { rating, comment = "" } = JSON.parse(event.body || "{}");
    if (rating === undefined) return response(400, { message: "`rating` is required in the request body." });

    const orderScan = await db.scan({
      TableName: ORDERS_TABLE,
      FilterExpression: "buyerId = :buyerId AND productId = :productId",
      ExpressionAttributeValues: { ":buyerId": buyerId, ":productId": productId },
      ProjectionExpression: "orderId",
    }).promise();

    if (!orderScan.Items || orderScan.Items.length === 0) {
      return response(403, { message: "You can only review products you have purchased." });
    }

    const review = {
      reviewId: `review_${Date.now()}`,
      productId,
      buyerId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    await db.put({ TableName: REVIEWS_TABLE, Item: review }).promise();
    return response(201, review);
  } catch (err) {
    console.error("Error creating review:", err);
    return response(500, { message: "Internal server error." });
  }
};
