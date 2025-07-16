const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('Full Event', event);
  const claims = event.requestContext.authorizer?.claims;
  console.log('claims', claims);
  const userId = claims?.sub;
  console.log('UserID', event);

  if (!userId) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { productId } = event.pathParameters;
  const result = await db.get({ TableName: "ProductsTable", Key: { productId } }).promise();

  console.log('Fetched item:', result);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true"
    },
    body: JSON.stringify(result.Item),
  };
};
