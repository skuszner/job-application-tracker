import request from "supertest";
import app from "../app.ts";
import { afterEach, describe, it } from "node:test";
import assert from "node:assert";
import { prisma } from "../prisma/client.ts";

describe("Auth Endpoints", () => {
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: "test@example.com" }
    });
  });

  it("should sign up a new user", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "test@example.com",
      password: "password123"
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.token);
    assert.strictEqual(typeof res.body.token, "string");
  });

  it("should log in an existing user", async () => {
    await request(app).post("/auth/signup").send({
      email: "test@example.com",
      password: "password123"
    });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    assert.strictEqual(typeof res.body.token, "string");
  });

  it("should not allow sign up with an existing email", async () => {
    await request(app).post("/auth/signup").send({
      email: "test@example.com",
      password: "password123"
    });

    const res = await request(app).post("/auth/signup").send({
      email: "test@example.com",
      password: "password123"
    });

    assert.strictEqual(res.status, 409);
  });
});
