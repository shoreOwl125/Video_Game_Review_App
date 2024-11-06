import request from "supertest";
import app from "../app";
import { getPool } from "../connections/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

let pool = getPool();

describe("User Data API Tests", () => {
  beforeAll(async () => {
    if (pool === null) {
      pool = getPool();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM user_data");
    await pool.query("COMMIT");
  });

  /** Test case: Add a new user data record */
  it("should add a new user data record successfully", async () => {
    const newUserData = {
      search_history: ["game5", "game6"],
      interests: ["strategy", "puzzle"],
      view_history: ["game5"],
      review_history: ["1", "3"],
      genres: ["Action", "Puzzle"],
    };

    const res = await request(app)
      .post("/api/userdata")
      .send(newUserData);
    console.log("Create response:", res.statusCode, res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "User data created successfully"
    );

    const [userData] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user_data WHERE id = ?",
      [res.body.userDataId]
    );

    console.log("Queried userData:", userData);

    expect(userData.length).toEqual(1);
    expect(userData[0].search_history).toEqual(newUserData.search_history);
    expect(userData[0].interests).toEqual(newUserData.interests);
    expect(userData[0].view_history).toEqual(newUserData.view_history);
    expect(userData[0].review_history).toEqual(newUserData.review_history);
    expect(userData[0].genres).toEqual(newUserData.genres);
  });

  /** Test case: Retrieve user data by ID */
  it("should retrieve user data by ID", async () => {
    const sampleUserData = {
      search_history: ["game1", "game2"],
      interests: ["sports", "action"],
      view_history: ["game1"],
      review_history: ["1", "2"],
      genres: ["RPG", "Adventure"],
    };

    const [result]: [ResultSetHeader, any] = await pool.query(
      `
      INSERT INTO user_data (search_history, interests, view_history, review_history, genres)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        JSON.stringify(sampleUserData.search_history),
        JSON.stringify(sampleUserData.interests),
        JSON.stringify(sampleUserData.view_history),
        JSON.stringify(sampleUserData.review_history),
        JSON.stringify(sampleUserData.genres),
      ]
    );
    const insertedId = result.insertId;

    const res = await request(app)
      .get(`/api/userdata/${insertedId}`)
      .send();
    console.log("Retrieve response:", res.statusCode, res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.search_history).toEqual(sampleUserData.search_history);
    expect(res.body.interests).toEqual(sampleUserData.interests);
    expect(res.body.view_history).toEqual(sampleUserData.view_history);
    expect(res.body.review_history).toEqual(sampleUserData.review_history);
    expect(res.body.genres).toEqual(sampleUserData.genres);
  });

  /** Test case: Update user data by ID */
  it("should update user data successfully", async () => {
    const sampleUserData = {
      search_history: ["game1", "game2"],
      interests: ["sports", "action"],
      view_history: ["game1"],
      review_history: ["1", "2"],
      genres: ["RPG", "Adventure"],
    };

    const [result]: [ResultSetHeader, any] = await pool.query(
      `
      INSERT INTO user_data (search_history, interests, view_history, review_history, genres)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        JSON.stringify(sampleUserData.search_history),
        JSON.stringify(sampleUserData.interests),
        JSON.stringify(sampleUserData.view_history),
        JSON.stringify(sampleUserData.review_history),
        JSON.stringify(sampleUserData.genres),
      ]
    );
    const insertedId = result.insertId;

    const updates = {
      interests: ["sports", "adventure"],
      genres: ["RPG", "Sports"],
    };

    const res = await request(app)
      .put(`/api/userdata/${insertedId}`)
      .send(updates);
    console.log("Update response:", res.statusCode, res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "User data updated successfully"
    );

    const [updatedUserData] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user_data WHERE id = ?",
      [insertedId]
    );
    expect(updatedUserData[0].interests).toEqual(updates.interests);
    expect(updatedUserData[0].genres).toEqual(updates.genres);
  });

  /** Test case: Delete user data by ID */
  it("should delete user data by ID", async () => {
    const sampleUserData = {
      search_history: ["game1", "game2"],
      interests: ["sports", "action"],
      view_history: ["game1"],
      review_history: ["1", "2"],
      genres: ["RPG", "Adventure"],
    };

    const [result]: [ResultSetHeader, any] = await pool.query(
      `
      INSERT INTO user_data (search_history, interests, view_history, review_history, genres)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        JSON.stringify(sampleUserData.search_history),
        JSON.stringify(sampleUserData.interests),
        JSON.stringify(sampleUserData.view_history),
        JSON.stringify(sampleUserData.review_history),
        JSON.stringify(sampleUserData.genres),
      ]
    );
    const insertedId = result.insertId;

    const res = await request(app)
      .delete(`/api/userdata/${insertedId}`)
      .send();
    console.log("Delete response:", res.statusCode, res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "message",
      "User data deleted successfully"
    );

    const [deletedUserData] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user_data WHERE id = ?",
      [insertedId]
    );
    expect(deletedUserData.length).toEqual(0);
  });
});
