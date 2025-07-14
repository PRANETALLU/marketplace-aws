const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const response = (status, body) => ({
  statusCode: status,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    // 1. Authenticate user
    const claims = event.requestContext?.authorizer?.claims;
    const buyerId = claims?.sub;
    if (!buyerId) {
      return response(401, { message: "Unauthorized" });
    }

    // 2. Extract productId from path parameter
    const productId = event.pathParameters?.productId;
    if (!productId) {
      return response(400, { message: "`productId` path parameter is required." });
    }

    // 3. Parse input body
    const { rating, comment = "" } = JSON.parse(event.body || "{}");
    if (rating === undefined) {
      return response(400, { message: "`rating` is required in the request body." });
    }

    // 4. Verify user has purchased the product
    const orderScan = await db.scan({
      TableName: "OrdersTable",
      FilterExpression: "buyerId = :buyerId AND productId = :productId",
      ExpressionAttributeValues: {
        ":buyerId": buyerId,
        ":productId": productId,
      },
      ProjectionExpression: "orderId",
    }).promise();

    if (!orderScan.Items || orderScan.Items.length === 0) {
      return response(403, { message: "You can only review products you have purchased." });
    }

    // 5. Create and save the review
    const review = {
      reviewId: `review_${Date.now()}`,
      productId,
      buyerId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    await db.put({
      TableName: "ReviewsTable",
      Item: review,
    }).promise();

    return response(201, review);

  } catch (err) {
    console.error("Error creating review:", err);
    return response(500, { message: "Internal server error." });
  }
};
