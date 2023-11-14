import { createHash, randomBytes } from "crypto";
import { ApiKey } from "../schemas/index.js";

export function hashAPIKey(apiKey) {
  return createHash("sha256").update(apiKey).digest("hex");
}

export async function generateAPIKey() {
  let apiKey;
  let hashedAPIKey;
  let keyExists = false;

  do {
    apiKey = randomBytes(16).toString("hex");
    hashedAPIKey = hashAPIKey(apiKey);
    const existingKey = await ApiKey.findOne({ apiKey: hashedAPIKey });
    keyExists = !!existingKey;
  } while (keyExists);

  return { hashedAPIKey, apiKey };
}
