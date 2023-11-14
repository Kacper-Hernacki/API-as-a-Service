import { ApiKey, User } from "../schemas/index.js";

async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

async function getUserById(userId) {
  return User.findById(userId);
}

async function createUserApiKey(name, itemId, active, customerId, subscriptionId, apiKey) {
  const user = new User({ name, itemId, active, customerId, subscriptionId, apiKey });
  await user.save().then(() => console.log("User Saved"));
  return user;
}

async function addApiKey(customerId, apiKey) {
  const usersApiKey = new ApiKey({ customerId, apiKey });
  await usersApiKey.save().then(() => console.log("ApiKey Saved"));
  return usersApiKey;
}

export { createUser, getUserById, createUserApiKey, addApiKey };
