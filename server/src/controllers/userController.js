import { config } from "dotenv";
import Stripe from "stripe";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function getUserUsage(req, res) {
  try {
    const customerId = req.params.customer;
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: customerId
    });

    res.send(invoice);
  } catch (err) {
    console.error('Error in estimating user usage:', err);
    res.status(500).send('Internal Server Error');
  }
}

export async function createUser(req, res) {
  try {
  // create logic
  } catch (err) {
    console.error('Error in createCheckoutSession:', err);
    res.status(500).send('Internal Server Error');
  }
}
