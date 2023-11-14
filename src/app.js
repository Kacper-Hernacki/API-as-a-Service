import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import apiRoutes from './routes/apiRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';


config();


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected 🍻"))
  .catch(err => console.log(err));


const app = express();
const port = process.env.PORT || 8080;


app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer)
  })
);
app.use('/api', apiRoutes);
app.use('/webhooks', webhookRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome in app");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error occurred: " + err.message);
});

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`);
});
