import mongoose from "mongoose";

export const connectDatabase = () => {
  const dbUri = process.env.DATABASE_URL;
  if (!dbUri) {
    console.error("Database URL not provided");
    process.exit(1);
  }

  mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected 🍻"))
    .catch(err => console.log(err));
};
