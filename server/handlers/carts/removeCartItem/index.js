// removeCartItem.js
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const res = (code, body) => ({ statusCode: code, body: JSON.stringify(body) });

exports.handler = async (event) => {
  try {
    /* 1. Auth */
    const buyerId = event.requestContext?.authorizer?.claims?.sub;
    if (!buyerId) return res(401, { message: "Unauthorized" });

    /* 2. Path param */
    const cartId = event.pathParameters?.cartId;
    if (!cartId) return res(400, { message: "`cartId` path parameter is required." });

    /* 3. Delete conditioned on userId */
    await db.delete({
      TableName: "CartsTable",
      Key: { cartId },
      ConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": buyerId }
    }).promise();

    return res(204, "");   // No Content
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      return res(403, { message: "Forbidden: cart item not owned by user." });
    }
    console.error("removeCartItem error:", err);
    return res(500, { message: "Internal server error." });
  }
};
