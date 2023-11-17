import { ApiKey, User } from "../schemas/index.js";
import { hashAPIKey } from "../utils/index.js";
import { config } from "dotenv";
import Stripe from "stripe";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function healthCheck(req, res) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      res.sendStatus(400);
    }

    const hashedAPIKey = hashAPIKey(apiKey);

    const customerId = await ApiKey.findOne({ apiKey: hashedAPIKey }).select("customerId").then((record)=>{
      if(record){
        return record.customerId
      }
    })

    const customer = await User.findOne({ apiKey: hashedAPIKey})

    if (!customer || !customer.active) {
      res.sendStatus(403);
    } else {

      const record = await stripe.subscriptionItems.createUsageRecord(
        customer.itemId,
        {
          quantity: 1,
          timestamp: "now",
          action: "increment"
        }
      );
      res.send({ data: { customerId }, usage: record });
    }
  } catch (err) {
    console.error('Error in createCheckoutSession:', err);
    res.status(500).send('Internal Server Error');
  }
}
