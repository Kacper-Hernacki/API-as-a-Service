import express from "express";
import { config } from "dotenv";
import Stripe from "stripe";
import { randomBytes, createHash } from 'crypto';

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 8080;

const customers = {};
const apiKeys = {};

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

// Recursive function to generate a unique random string as API key
function generateAPIKey() {
  const apiKey = randomBytes(16).toString('hex');
  const hashedAPIKey = hashAPIKey(apiKey);

  // Ensure API key is unique
  // This assumes you have a structure to store API keys, like an object or database
  if (apiKeys[hashedAPIKey]) {
    return generateAPIKey();
  } else {
    return { hashedAPIKey, apiKey };
  }
}
// Hash the API key
function hashAPIKey(apiKey) {
  return createHash('sha256').update(apiKey).digest('hex');
}

app.get('/api', async (req, res) => {
  //const { apiKey } = req.query;
   const apiKey = req.headers['x-api-key'] // better option for storing API keys
  if (!apiKey) {
    res.sendStatus(400); // bad request
  }

  const hashedAPIKey = hashAPIKey(apiKey);

  const customerId = apiKeys[hashedAPIKey];
  const customer = customers[customerId];

  if (!customer || !customer.active) {
    res.sendStatus(403); // not authorized
  } else {

    // Record usage with Stripe Billing
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
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
        price: "PRICE_ID"
      }
    ],
    success_url:
      "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5000/error"
  });

  res.send(session);
});

// Listen to webhooks from Stripe when important events happen
app.post('/webhook', async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = 'WEBHOOK_SECRET';

  if (webhookSecret) {
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(err,`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case 'checkout.session.completed':
      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;

      const { apiKey, hashedAPIKey } = generateAPIKey();
      console.log(`User's API Key: ${apiKey}`);
      console.log(`Hashed API Key: ${hashedAPIKey}`);

      customers[customerId] = {
        apikey: hashedAPIKey,
        itemId,
        active: true,
      };
      apiKeys[hashedAPIKey] = customerId;

      break;
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      break;
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
});

app.get('/usage/:customer', async (req, res) => {
  const customerId = req.params.customer;
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
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
