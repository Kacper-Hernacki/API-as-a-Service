import express from 'express';
import { processWebhook } from '../controllers/webhookController.js';

const router = express.Router();

router.post('/', processWebhook);
export default router;
