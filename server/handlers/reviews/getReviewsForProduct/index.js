const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Full Event", event);

  try {
    const productId = event.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({ message: "`productId` path parameter is required." }),
      };
    }

    const result = await db
      .scan({
        TableName: "ReviewsTable",
        FilterExpression: "productId = :pid",
        ExpressionAttributeValues: {
          ":pid": productId,
        },
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error fetching product reviews:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
