import request from "supertest";
import app from "../app";
import { getPool } from "../connections/database";

describe("User Registration, Login, Logout, and Profile API Tests", () => {
  let uniqueEmail: string = "";
  let jwtCookie: string = "";
  const pool = getPool();

  // Close the database pool after all tests
  afterAll(async () => {
    await pool.end();
  });

  // Clean up users table before each test
  beforeEach(async () => {
    uniqueEmail = `testuser@gmail.com`;
    await pool.query("DELETE FROM users");
  });

  /** Test case: Register a new user */
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: uniqueEmail, // Use unique email
        password: "password123",
      });

    expect(res.statusCode).toEqual(201); // Expect status 201 Created
    expect(res.body).toHaveProperty("id"); // Ensure that the response contains an ID
    expect(res.body).toHaveProperty("email", uniqueEmail); // Expect correct email in the response
  });

  /** Test case: Login with the registered user */
  it("should log in the user with correct credentials and return a token in cookies", async () => {
    // Register the user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: uniqueEmail,
        password: "password123",
      });

    // Login the user
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    expect(res.statusCode).toEqual(200); // Expect status 200 OK
    expect(res.body).toHaveProperty("id"); // Ensure the response contains the user ID
    expect(res.body).toHaveProperty("email", uniqueEmail); // Ensure the correct email is returned

    // Check if JWT token is set in cookies
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined(); // Check that cookies are set
    expect(cookies[0]).toMatch(/jwt=/); // Ensure the cookie contains the JWT token

    // Store the JWT cookie for future tests
    jwtCookie = cookies[0];
  });

  /** Test case: Logout the user */
  it("should log out the user and clear the JWT token from cookies", async () => {
    // Register and log in the user to obtain a JWT token
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: uniqueEmail,
        password: "password123",
      });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "password123",
      });

    // Store the JWT cookie from login
    jwtCookie = loginRes.headers["set-cookie"][0];

    // Logout the user
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", jwtCookie); // Use the JWT token stored in the cookie

    expect(res.statusCode).toEqual(200); // Expect status 200 OK
    expect(res.body).toHaveProperty("message", "User logged out"); // Ensure the response confirms logout

    // Check if the JWT token is cleared from cookies
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/jwt=;/); // Ensure the JWT token is cleared
  });
});
