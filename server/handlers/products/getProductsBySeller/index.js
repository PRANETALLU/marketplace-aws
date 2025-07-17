const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Unauthorized" })
    };
  }

  try {
    const result = await db.scan({
      TableName: "ProductsTable",
      FilterExpression: "sellerId = :sellerId",
      ExpressionAttributeValues: { ":sellerId": userId }
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
