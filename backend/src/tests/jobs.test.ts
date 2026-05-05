import request from "supertest";
import app from "../app.ts";
import { afterEach, describe, it } from "node:test";
import assert from "node:assert";
import { prisma } from "../prisma/client.ts";

async function signupAndGetToken() {
  const email = "test-job@example.com";
  const password = "password123";
  const res = await request(app).post("/auth/signup").send({ email, password });
  return { token: res.body.token as string, email };
}

describe("Job Endpoints", () => {
  afterEach(async () => {
    const user = await prisma.user.findUnique({
      where: { email: "test-job@example.com" }
    });
    if (user) {
      await prisma.job.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  });

  it("creates a job", async () => {
    const { token } = await signupAndGetToken();

    const payload = {
      company: "TestCo",
      role: "Engineer",
      status: "APPLIED",
      notes: "First application",
      appliedDate: new Date().toISOString()
    };

    const res = await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.company, payload.company);
    assert.strictEqual(res.body.role, payload.role);
    assert.strictEqual(res.body.status, payload.status);
  });

  it("lists jobs for the user", async () => {
    const { token } = await signupAndGetToken();

    const payload = {
      company: "TestCo",
      role: "Engineer",
      status: "APPLIED",
      appliedDate: new Date().toISOString()
    };

    await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    const res = await request(app)
      .get("/jobs")
      .set("Authorization", `Bearer ${token}`);
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 1);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/jobs");
    assert.strictEqual(res.status, 401);
  });

  it("gets, updates and deletes a job", async () => {
    const { token } = await signupAndGetToken();

    const payload = {
      company: "TestCo",
      role: "Engineer",
      status: "APPLIED",
      appliedDate: new Date().toISOString()
    };

    const createRes = await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    assert.strictEqual(createRes.status, 201);
    const id = createRes.body.id as string;

    const getRes = await request(app)
      .get(`/jobs/${id}`)
      .set("Authorization", `Bearer ${token}`);
    assert.strictEqual(getRes.status, 200);
    assert.strictEqual(getRes.body.id, id);

    const updateRes = await request(app)
      .put(`/jobs/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "Senior Engineer", status: "INTERVIEW" });
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.role, "Senior Engineer");
    assert.strictEqual(updateRes.body.status, "INTERVIEW");

    const delRes = await request(app)
      .delete(`/jobs/${id}`)
      .set("Authorization", `Bearer ${token}`);
    assert.strictEqual(delRes.status, 204);

    const getAfterDel = await request(app)
      .get(`/jobs/${id}`)
      .set("Authorization", `Bearer ${token}`);
    assert.strictEqual(getAfterDel.status, 404);
  });
});
