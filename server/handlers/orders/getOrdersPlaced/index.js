const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const buyerId = claims?.sub;

  if (!buyerId) {
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
      TableName: "OrdersTable",
      FilterExpression: "buyerId = :buyerId",
      ExpressionAttributeValues: {
        ":buyerId": buyerId
      }
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
    console.error("Error querying orders:", error);
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
