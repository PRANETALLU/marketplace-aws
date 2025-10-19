const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { cartItems } = JSON.parse(event.body);
    // cartItems = [{ productId: "abc123", quantity: 2 }, ...]

    const line_items = [];

    for (const item of cartItems) {
      const productResult = await db.get({
        TableName: "ProductsTable",
        Key: { id: item.productId },
      }).promise();

      const product = productResult.Item;
      if (!product) continue;

      line_items.push({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.title,
            description: product.description,
          },
        },
        quantity: item.quantity,
      });
    }

    if (line_items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No valid products found" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://yourdomain.com/success",
      cancel_url: "https://yourdomain.com/cancel",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Stripe session creation failed" }),
    };
  }
};
