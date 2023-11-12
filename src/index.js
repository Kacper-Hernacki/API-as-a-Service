import express from 'express';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "Hello from docker 🐳" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('🛑 Something broke!');
});

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`);
});
