import { Product } from "../schemas/index.js";
import Stripe from "stripe";
import { config } from "dotenv";
config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  try {
    const { productId } = req.params;
    const productsTest = await Product.find()
    const stripePriceId = await Product.findById(productId)
      .then(product => {
        if (product) {
          console.log('Product found:', product);
          return product.stripePriceId;
        } else {
          console.log('No product found with this _id');
        }
      })
      .catch(err => {
        console.error('Error finding product:', err);
      });

    if (!stripePriceId) {
      return res.status(404).send('Product not found');
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId
        }
      ],
      success_url:
        "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5000/error"
    });


    res.send(session);
  } catch (err) {
    console.error('Error in createCheckoutSession:', err);
    res.status(500).send('Internal Server Error');
  }
}
