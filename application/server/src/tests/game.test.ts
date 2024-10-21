import request from "supertest";
import app from "../app"; // Adjust this path based on your app.ts location
import { getPool } from "../connections/database"; // Use getPool to retrieve the connection pool

describe("Games Search API Tests", () => {
  const pool = getPool(); // Retrieve the pool using getPool()

  // Close the database pool after the test is completed
  afterAll(async () => {
    await pool.end();
  });

  // Clean up games table before each test
  beforeEach(async () => {
    await pool.query("DELETE FROM games");

    // Insert some sample games
    await pool.query(`
      INSERT INTO games (title, description, genre, release_date, cover_image)
      VALUES
        ('Fortnite', 'Battle royale shooter where the last player standing wins!', 'Shooter', '2018-03-12', '/assets/images/fortnite.jpg'),
        ('FIFA 21', 'Soccer simulation game with the latest player rosters.', 'Sports', '2020-10-06', '/assets/images/fifa21.jpg'),
        ('Minecraft', 'Create and explore worlds, and build anything your imagination can create.', 'Sandbox', '2011-11-18', '/assets/images/minecraft.jpg');
    `);
  });

  /** Test case: Search games by partial title */
  it("should return games that partially match the query", async () => {
    const res = await request(app)
      .get("/api/games/search?query=Fort") // Searching with partial match 'Fort'
      .send();

    expect(res.statusCode).toEqual(200); // Expect status 200 OK
    expect(res.body.length).toBeGreaterThan(0); // Expect at least one game to be returned
    expect(res.body[0]).toHaveProperty("title", "Fortnite"); // Ensure Fortnite is returned
  });

  /** Test case: Search with no matching games */
  it("should return 404 if no games match the query", async () => {
    const res = await request(app)
      .get("/api/games/search?query=UnknownGame") // Searching with a non-existent game
      .send();

    expect(res.statusCode).toEqual(404); // Expect 404 Not Found
    expect(res.body).toHaveProperty("message", "No games found"); // Ensure appropriate error message
  });
});
