import request from "supertest";
import app from "../app";
import { getPool } from "../connections/database";
import { RowDataPacket } from "mysql2";

let pool = getPool();

describe("Games API Tests", () => {
  // Ensure pool is available and reset data before tests
  beforeAll(async () => {
    if (pool === null) {
      pool = getPool();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM games");

    await pool.query(`
      INSERT INTO games (title, description, genre, release_date, cover_image, review_rating)
      VALUES
        ('Fortnite', 'Battle royale shooter where the last player standing wins!', 'Shooter', '2018-03-12', '/assets/images/fortnite.jpg', 8),
        ('FIFA 21', 'Soccer simulation game with the latest player rosters.', 'Sports', '2020-10-06', '/assets/images/fifa21.jpg', 7),
        ('Minecraft', 'Create and explore worlds, and build anything your imagination can create.', 'Sandbox', '2011-11-18', '/assets/images/minecraft.jpg', 9);
    `);
  });

  /** Test case: Add a new game */
  it("should add a new game successfully", async () => {
    const newGame = {
      title: "New Game",
      description: "A fun new game to play.",
      genre: "Adventure",
      release_date: "2021-11-25",
      cover_image: "/assets/images/newgame.jpg",
      review_rating: 8,
    };
    const res = await request(app)
      .post("/api/games")
      .send(newGame);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Game created successfully");

    const [games] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM games WHERE title = ?",
      [newGame.title]
    );
    expect(games.length).toEqual(1);
  });

  /** Test case: Search games by partial title */
  it("should return games that partially match the query", async () => {
    const res = await request(app)
      .get("/api/games/search?query=Fort")
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("title", "Fortnite");
  });

  /** Test case: Search with no matching games */
  it("should return 404 if no games match the query", async () => {
    const res = await request(app)
      .get("/api/games/search?query=UnknownGame")
      .send();

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "No games found");
  });

  /** Test case: Get a game by ID */
  it("should retrieve a game by ID", async () => {
    const [game] = await pool.query<RowDataPacket[]>(
      "SELECT game_id FROM games WHERE title = 'Minecraft'"
    );
    const gameId = game[0].game_id;

    const res = await request(app)
      .get(`/api/games/${gameId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Minecraft");
  });

  /** Test case: Delete a game by ID */
  it("should delete a game by ID", async () => {
    const [game] = await pool.query<RowDataPacket[]>(
      "SELECT game_id FROM games WHERE title = 'Fortnite'"
    );
    const gameId = game[0].game_id;

    const res = await request(app)
      .delete(`/api/games/${gameId}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Game deleted successfully");

    const [deletedGame] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM games WHERE game_id = ?",
      [gameId]
    );
    expect(deletedGame.length).toEqual(0);
  });

  /** Test case: Update a game */
  it("should update a game successfully", async () => {
    const [game] = await pool.query<RowDataPacket[]>(
      "SELECT game_id FROM games WHERE title = 'FIFA 21'"
    );
    const gameId = game[0].game_id;

    const updates = { title: "FIFA 22", review_rating: 9 };
    const res = await request(app)
      .put(`/api/games/${gameId}`)
      .send(updates);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Game updated successfully");

    const [updatedGame] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM games WHERE game_id = ?",
      [gameId]
    );
    expect(updatedGame[0].title).toEqual("FIFA 22");
    expect(updatedGame[0].review_rating).toEqual(9);
  });
});
