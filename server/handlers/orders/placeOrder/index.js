const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

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

// ✅ PLACE ORDER
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const claims = event.requestContext.authorizer?.claims;
  const buyerId = claims?.sub;
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
    shippingAddress
  };

  await db.put({ TableName: "OrdersTable", Item: order }).promise();
  return response(201, { message: "Order placed", order });
};