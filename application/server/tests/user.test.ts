import request from "supertest";
import app from "../src/app";

describe("User Routes", () => {
  let token: string;

  beforeAll(async () => {
    // Log in the user and store the token
    const res = await request(app)
      .post("/login")
      .send({
        email: "john@example.com",
        password: "password123",
      });
    token = res.body.token;
  });

  it("should get the user by ID", async () => {
    const res = await request(app)
      .get("/users/1") // Assuming user ID is 1
      .set("Authorization", `Bearer ${token}`); // Send JWT token

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "john@example.com");
  });
});
