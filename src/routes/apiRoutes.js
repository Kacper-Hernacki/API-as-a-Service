import express from "express";
import { createUser, getUserUsage } from "../controllers/userController.js";
import { processWebhook } from "../controllers/webhookController.js";
import { createCheckoutSession } from "../controllers/checkoutController.js";
import { healthCheck } from "../controllers/healthCheck.js";

const router = express.Router();

router.get("/", healthCheck);
router.get("/customer/:customer/usage", getUserUsage);
router.post("/user", createUser);
router.post("/webhook", processWebhook);
router.post("/checkout/:productId", createCheckoutSession);
export default router;
