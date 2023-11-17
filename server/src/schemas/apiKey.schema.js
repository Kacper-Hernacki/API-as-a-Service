import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  apiKey: {
    type: String,
    unique: true
  },
  customerId: String,
  active: Boolean,
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
});

export default mongoose.model("ApiKey", apiKeySchema);