const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized. Login required." })
    };
  }

  const body = JSON.parse(event.body);
  const productId = uuidv4();
  const timestamp = new Date().toISOString();

  const item = {
    productId,
    sellerId: userId,
    productName: body.productName,
    description: body.description,
    price: body.price,
    category: body.category,
    quantity: body.quantity,
    status: "available",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await db.put({
    TableName: "ProductsTable",
    Item: item
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(item)
  };
};
