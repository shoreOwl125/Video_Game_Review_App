"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app")); // Adjust this path based on your app.ts location
const userDB_1 = require("../src/connections/userDB"); // Use getPool to retrieve the connection pool
describe("User Registration, Login, Logout, and Profile API Tests", () => {
    let uniqueEmail = ""; // Store unique email for testing
    let jwtCookie = ""; // Store the JWT cookie after login
    const pool = (0, userDB_1.getPool)(); // Retrieve the pool using getPool()
    // Close the database pool after the test is completed
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.end();
    }));
    // Clean up users table before each test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.query("DELETE FROM users");
    }));
    /** Test case: Register a new user */
    it("should register a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        uniqueEmail = `testuser_${Date.now()}@example.com`; // Generate a unique email
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/register")
            .send({
            name: "John Doe",
            email: uniqueEmail, // Use unique email
            password: "password123",
        });
        expect(res.statusCode).toEqual(201); // Expect status 201 Created
        expect(res.body).toHaveProperty("id"); // Ensure that the response contains an ID
        expect(res.body).toHaveProperty("email", uniqueEmail); // Expect correct email in the response
    }));
    /** Test case: Login with the registered user */
    it("should log in the user with correct credentials and return a token in cookies", () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register the user
        yield (0, supertest_1.default)(app_1.default)
            .post("/register")
            .send({
            name: "John Doe",
            email: uniqueEmail, // Use the email registered in the previous test
            password: "password123",
        });
        // Now, login the user
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({
            email: uniqueEmail, // Use the same email used in registration
            password: "password123",
        });
        expect(res.statusCode).toEqual(200); // Expect status 200 OK
        expect(res.body).toHaveProperty("id"); // Ensure the response contains the user ID
        expect(res.body).toHaveProperty("email", uniqueEmail); // Ensure the correct email is returned
        // Check if JWT token is set in cookies
        const cookies = res.headers["set-cookie"]; // Get cookies from the response
        expect(cookies).toBeDefined(); // Check that cookies are set
        expect(cookies[0]).toMatch(/jwt=/); // Ensure the cookie contains the JWT token
        // Store the cookie for future tests
        jwtCookie = cookies[0];
    }));
    /** Test case: Logout the user */
    it("should log out the user and clear the JWT token from cookies", () => __awaiter(void 0, void 0, void 0, function* () {
        // Log in the user first to have a valid JWT token
        yield (0, supertest_1.default)(app_1.default)
            .post("/login")
            .send({
            email: uniqueEmail,
            password: "password123",
        });
        // Now, log out the user
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/logout")
            .set("Cookie", jwtCookie); // Use the JWT token stored in the cookie
        expect(res.statusCode).toEqual(200); // Expect status 200 OK
        expect(res.body).toHaveProperty("message", "User logged out"); // Ensure the response confirms logout
        // Check if the JWT token is cleared from cookies
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toMatch(/jwt=;/); // Ensure the JWT token is cleared
    }));
});
