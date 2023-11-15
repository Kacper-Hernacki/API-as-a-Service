import express from "express";
import { config } from "dotenv";
import apiRoutes from './routes/apiRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import { connectDatabase } from "./config/database.js";
import setupMiddlewares from "./config/middlewares.js";

config();
connectDatabase()

const app = express();
const port = process.env.PORT || 8080;

setupMiddlewares(app);

app.use('/api', apiRoutes);
app.use('/webhooks', webhookRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome in app");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`);
});
