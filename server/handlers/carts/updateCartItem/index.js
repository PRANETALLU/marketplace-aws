// updateCartItem.js
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

    /* 3. Body */
    const { productId, qty } = JSON.parse(event.body || "{}");
    if (productId === undefined && qty === undefined) {
      return res(400, { message: "Provide `productId`, `qty`, or both to update." });
    }

    /* 4. Build update expression */
    const updates = [];
    const names   = {};
    const values  = {};

    if (productId !== undefined) {
      updates.push("#p = :p");
      names["#p"]   = "productId";
      values[":p"]  = productId;
    }
    if (qty !== undefined) {
      updates.push("#q = :q");
      names["#q"]   = "quantity";
      values[":q"]  = Number(qty);
    }
    updates.push("#u = :u");               // updatedAt timestamp
    names["#u"]  = "updatedAt";
    values[":u"] = new Date().toISOString();

    /* 5. Update with conditional check on userId */
    const result = await db.update({
      TableName: "CartsTable",
      Key: { cartId },
      UpdateExpression: "SET " + updates.join(", "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ...values, ":uid": buyerId },
      ReturnValues: "ALL_NEW"
    }).promise();

    return res(200, result.Attributes);
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      return res(403, { message: "Forbidden: cart item not owned by user." });
    }
    console.error("updateCartItem error:", err);
    return res(500, { message: "Internal server error." });
  }
};
