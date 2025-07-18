const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const res = (code, body) => ({
  statusCode: code,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  try {
    const userId = event.requestContext?.authorizer?.claims?.sub;
    if (!userId) return res(401, { message: "Unauthorized" });

    const productId = event.pathParameters?.productId;
    if (!productId) return res(400, { message: "`productId` path parameter is required." });

    const { quantity } = JSON.parse(event.body || "{}");
    if (quantity === undefined || quantity < 1) {
      return res(400, { message: "`quantity` (>=1) is required in body." });
    }

    // Fetch the cart
    const cartResult = await db.get({
      TableName: "CartsTable",
      Key: { userId }
    }).promise();

    const cart = cartResult.Item;
    if (!cart) return res(404, { message: "Cart not found" });

    // Find item and update quantity
    const updatedItems = (cart.items || []).map(item => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    // Update the cart in DB
    await db.update({
      TableName: "CartsTable",
      Key: { userId },
      UpdateExpression: "SET items = :items, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":items": updatedItems,
        ":updatedAt": new Date().toISOString(),
      }
    }).promise();

    return res(200, { userId, items: updatedItems });
  } catch (err) {
    console.error("updateCartItem error:", err);
    return res(500, { message: "Internal server error." });
  }
};
