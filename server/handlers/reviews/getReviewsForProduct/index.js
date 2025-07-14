const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const response = (status, body) => ({
  statusCode: status,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const productId = event.pathParameters?.productId;
    if (!productId) {
      return response(400, { message: "`productId` path parameter is required." });
    }

    // Scan Reviews table for reviews matching productId
    const result = await db.scan({
      TableName: "ReviewsTable",
      FilterExpression: "productId = :pid",
      ExpressionAttributeValues: {
        ":pid": productId,
      },
    }).promise();

    return response(200, result.Items || []);

  } catch (err) {
    console.error("Error fetching product reviews:", err);
    return response(500, { message: "Internal server error." });
  }
};
