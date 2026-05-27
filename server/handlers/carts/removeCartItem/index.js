const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "DELETE,OPTIONS",
};

const res = (code, body, isEmpty = false) => ({
  statusCode: code,
  headers: corsHeaders,
  body: isEmpty ? "" : JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const userId = event.requestContext?.authorizer?.claims?.sub;
    if (!userId) return res(401, { message: "Unauthorized" });

    const productId = event.pathParameters?.productId;
    if (!productId) return res(400, { message: "`productId` path parameter is required." });

    // Fetch the cart
    const cartResult = await db.get({
      TableName: "CartsTable",
      Key: { userId }
    }).promise();

    const cart = cartResult.Item;
    if (!cart) return res(404, { message: "Cart not found" });

    // Filter out the product to remove
    const updatedItems = (cart.items || []).filter(item => item.productId !== productId);

    // Update the cart
    await db.update({
      TableName: "CartsTable",
      Key: { userId },
      UpdateExpression: "SET #items = :items, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#items": "items"
      },
      ExpressionAttributeValues: {
        ":items": updatedItems,
        ":updatedAt": new Date().toISOString(),
      }
    }).promise();


    return res(204, "", true); // No Content
  } catch (err) {
    console.error("removeCartItem error:", err);
    return res(500, { message: "Internal server error." });
  }
};
