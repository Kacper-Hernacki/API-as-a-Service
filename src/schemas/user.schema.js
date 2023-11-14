import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true
  },
  name: String,
  apiKey: {
    type: String,
    unique: true
  },
  customerId: String,
  subscriptionId: String,
  itemId: String,
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

export default mongoose.model("User", userSchema);