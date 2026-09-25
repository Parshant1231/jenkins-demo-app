const request = require("supertest");
const app = require("../src/app");

describe("Application API", () => {
  test("GET / should return application information", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Hello from Jenkins CI/CD!");
  });

  test("GET /health should return healthy", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });
});

