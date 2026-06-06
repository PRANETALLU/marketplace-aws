const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || "ProductsTable";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const { cartItems } = JSON.parse(event.body);
    // cartItems = [{ productId: "abc123", quantity: 2 }, ...]

    const line_items = [];

    for (const item of cartItems) {
      const productResult = await db.get({
        TableName: PRODUCTS_TABLE,
        Key: { productId: item.productId },
      }).promise();

      const product = productResult.Item;
      if (!product) continue;

      line_items.push({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.productName || product.title,
            description: product.description,
          },
        },
        quantity: item.quantity,
      });
    }

    if (line_items.length === 0) {
      return response(400, { error: "No valid products found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cart`,
    });

    return response(200, { url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return response(500, { error: "Stripe session creation failed", detail: err.message });
  }
};
