import request from "supertest";
import app from "../src/app";

describe("Auth Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        name: "John",
        email: "john@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "john@example.com");
  });

  it("should log in an existing user", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "john@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token"); // Check for JWT token
  });
});
