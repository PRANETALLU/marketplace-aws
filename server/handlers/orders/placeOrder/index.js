const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const ORDERS_TABLE = process.env.ORDERS_TABLE || "OrdersTable";

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

  const buyerId = getClaims(event)?.sub;
  if (!buyerId) return response(401, { message: "Unauthorized" });

  const { productId, quantity, totalPrice, shippingAddress } = JSON.parse(event.body);

  const order = {
    orderId: `order_${Date.now()}`,
    buyerId,
    productId,
    quantity,
    totalPrice,
    orderDate: new Date().toISOString(),
    status: "pending",
    shippingAddress,
  };

  await db.put({ TableName: ORDERS_TABLE, Item: order }).promise();
  return response(201, { message: "Order placed", order });
};
