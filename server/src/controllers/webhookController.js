import { generateAPIKey } from "../utils/apiKeys.js";
import Stripe from "stripe";
import { addApiKey, createUserApiKey } from "../services/userService.js";
import { config } from "dotenv";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function processWebhook(req, res) {
  try {
    let data;
    let eventType;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret) {
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req["rawBody"],
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(err, `⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
    } else {
      data = req.body.data;
      eventType = req.body.type;
    }

    switch (eventType) {
      case "checkout.session.completed":
        const customerId = data.object.customer;
        const subscriptionId = data.object.subscription;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const itemId = subscription.items.data[0].id;

        const { hashedAPIKey, apiKey } = await generateAPIKey();
        console.log("apiKey", apiKey);
        await createUserApiKey("Kacper", itemId, true, customerId, subscriptionId, hashedAPIKey);
        await addApiKey(customerId, hashedAPIKey);

        break;
      case "invoice.paid":
        // Continue to provision the subscription as payments continue to be made.
        break;
      case "invoice.payment_failed":
        // The payment failed or the customer does not have a valid payment method.
        break;
      default:
      // Unhandled event type
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error in receiving webhook:", err);
    res.status(500).send("Internal Server Error");
  }
}
