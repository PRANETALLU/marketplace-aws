const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

// ✅ PLACE ORDER
exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const buyerId = claims?.sub;
  if (!buyerId) return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };

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
  return { statusCode: 201, body: JSON.stringify({ message: "Order placed", order }) };
};