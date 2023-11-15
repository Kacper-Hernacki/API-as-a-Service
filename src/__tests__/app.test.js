import request from "supertest";
import express from "express";
import apiRoutes from "../routes/apiRoutes.js";
import webhookRoutes from "../routes/webhookRoutes.js";
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/webhooks", webhookRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome in app");
});

app.get("/error", (req, res, next) => {
  throw new Error("Test Error");
});


describe("Database Operations", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db();
  });

  test("should insert a doc into collection", async () => {
    const users = db.collection("users");
    const mockUser = { _id: "some-user-id", name: "John" };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: "some-user-id" });
    expect(insertedUser).toEqual(mockUser);
  });

  afterAll(async () => {
    await connection.close();
  });
});

describe("Application Routes", () => {
  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Welcome in app");
  });

  test("GET /error should return 500 status", async () => {
    const response = await request(app).get("/error");
    expect(response.statusCode).toBe(500);
  });

  test("GET /nonexistent should return 404 status", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.statusCode).toBe(404);
  });

  test("GET / should set correct Content-Type header", async () => {
    const response = await request(app).get("/");
    expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
  });
});
