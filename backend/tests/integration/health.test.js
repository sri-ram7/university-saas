const request = require("supertest");
const app = require("../../server");
const useMongoMemoryServer = require("../support/mongo");

describe("health endpoints", () => {
  useMongoMemoryServer();

  it("serves liveness without opening an HTTP listener or external services", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
    expect(response.headers["x-request-id"]).toBeDefined();
  });

  it("reports MongoDB readiness and unavailable Redis without leaking connection details", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: "unavailable",
      checks: {
        mongodb: "ok",
        redis: "unavailable",
      },
    });
    expect(response.text).not.toContain("mongodb://");
  });
});
