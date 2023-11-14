import express from "express";
import { config } from "dotenv";
import Stripe from "stripe";
import { createHash, randomBytes } from "crypto";
import mongoose from "mongoose";
import User from "./schemas/user.schema.js";
import ApiKey from "./schemas/apiKey.schema.js";

config();


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected 🍻"))
  .catch(err => console.log(err));

async function createUserApiKey(name, itemId, active, customerId, subscriptionId, apiKey) {
  const user = new User({ name, itemId, active, customerId, subscriptionId, apiKey });
  await user.save().then(() => console.log("User Saved"));
  console.log("user", user);
}

async function addApiKey(customerId, apiKey) {
  const usersApiKey = new ApiKey({ customerId, apiKey });
  await usersApiKey.save().then(() => console.log("ApiKey Saved"));
  console.log("user", usersApiKey);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 8080;

const customers = {};
const apiKeys = {};

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer)
  })
);

async function generateAPIKey() {
  try {
    let apiKey;
    let hashedAPIKey;
    let keyExists = false;

    do {
      apiKey = randomBytes(16).toString("hex");
      hashedAPIKey = hashAPIKey(apiKey);
      console.log('in..... ',hashedAPIKey, apiKey)

      const existingKey = await ApiKey.findOne({ apiKey: hashedAPIKey });
      keyExists = !!existingKey;

    } while (keyExists);
console.log('🚀 ',hashedAPIKey, apiKey)
    return { hashedAPIKey, apiKey };
  } catch (error) {
    console.error("Error in generateAPIKey:", error);
    throw error; // Rethrow the error to handle it outside
  }
}


function hashAPIKey(apiKey) {
  return createHash("sha256").update(apiKey).digest("hex");
}

app.get("/", async (req, res) => {
  res.send("Welcome in app");
});

app.get("/api", async (req, res) => {
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
});

app.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.PRICE_ID
      }
    ],
    success_url:
      "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5000/error"
  });

  res.send(session);
});

app.post("/webhook", async (req, res) => {
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

      const { apiKey, hashedAPIKey } = await generateAPIKey();
      console.log(`User's API Key: ${apiKey}`);
      console.log(`Hashed API Key: ${hashedAPIKey}`);

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
});

app.get("/usage/:customer", async (req, res) => {
  const customerId = req.params.customer;
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId
  });

  res.send(invoice);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error occurred: " + err.message);
});

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`);
});
