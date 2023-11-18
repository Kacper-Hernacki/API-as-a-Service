import { config } from "dotenv";
import Stripe from "stripe";
import { User as UserModel } from "../schemas/index.js";

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
    console.error("Error in estimating user usage:", err);
    res.status(500).send("Internal Server Error");
  }
}

export async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    const userExists =  await UserModel.findOne({email})

    if(userExists) return res.status(200).json(userExists)

    const newUser = await UserModel.create({
    name,
    email
    })

    res.status(200).json(newUser)
  } catch (err) {
    console.error("Error in createCheckoutSession:", err);
    res.status(500).send("Internal Server Error");
  }
}
