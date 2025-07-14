const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  /*const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;

  console.log("Authorizer:", JSON.stringify(event.requestContext.authorizer));
  console.log("Claims:", claims);

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized." })
    };
  }*/

  console.log("Full event:", JSON.stringify(event));

  try {
    const result = await db.scan({
      TableName: "ProductsTable",
      FilterExpression: "#status = :available",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":available": "available"
      }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching products", error: error.message })
    };
  }
};
