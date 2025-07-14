const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const response = (status, body) => ({
  statusCode: status,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  try {
    const claims = event.requestContext?.authorizer?.claims;
    const buyerId = claims?.sub;

    if (!buyerId) {
      return response(401, { message: "Unauthorized" });
    }

    // Scan Reviews table for reviews by this user
    const result = await db.scan({
      TableName: "ReviewsTable",
      FilterExpression: "buyerId = :bid",
      ExpressionAttributeValues: {
        ":bid": buyerId,
      },
    }).promise();

    return response(200, result.Items || []);

  } catch (err) {
    console.error("Error fetching user reviews:", err);
    return response(500, { message: "Internal server error." });
  }
};
