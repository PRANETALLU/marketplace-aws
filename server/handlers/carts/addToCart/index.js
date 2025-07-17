const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const claims = event.requestContext.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  const { productId, quantity } = JSON.parse(event.body);

  if (!productId || !quantity || quantity < 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "productId and quantity (>=1) are required" }),
    };
  }

  try {
    // Fetch the existing cart by userId (primary key)
    const result = await db.get({
      TableName: "CartsTable",
      Key: { userId },
    }).promise();

    let cart = result.Item;

    if (!cart) {
      // Create new cart if not exists
      cart = {
        userId,
        cartId: `cart_${Date.now()}`,
        items: [{ productId, quantity }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Update cart items
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        // Increase quantity if product already in cart
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.items.push({ productId, quantity });
      }

      cart.updatedAt = new Date().toISOString();
    }

    // Save the updated/new cart
    await db.put({
      TableName: "CartsTable",
      Item: cart,
    }).promise();

    return {
      statusCode: cart.createdAt === cart.updatedAt ? 201 : 200, // 201 if new cart, else 200
      body: JSON.stringify(cart),
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
