import { getPool } from '../connections/database';
import { UserData as UserDataInterface } from '../interfaces/UserData';
import { RowDataPacket } from 'mysql2';

class UserData {
  // Helper to stringify array fields before inserting or updating
  private stringifyFields(data: UserDataInterface): any {
    return {
      ...data,
      search_history: JSON.stringify(data.search_history || []),
      interests: JSON.stringify(data.interests || []),
      view_history: JSON.stringify(data.view_history || []),
      review_history: JSON.stringify(data.review_history || []),
      genres: JSON.stringify(data.genres || []),
    };
  }

  private parseFields(row: any): UserDataInterface {
    return {
      ...row,
      search_history:
        typeof row.search_history === 'string'
          ? JSON.parse(row.search_history)
          : row.search_history,
      interests:
        typeof row.interests === 'string'
          ? JSON.parse(row.interests)
          : row.interests,
      view_history:
        typeof row.view_history === 'string'
          ? JSON.parse(row.view_history)
          : row.view_history,
      review_history:
        typeof row.review_history === 'string'
          ? JSON.parse(row.review_history)
          : row.review_history,
      genres:
        typeof row.genres === 'string' ? JSON.parse(row.genres) : row.genres,
    };
  }

  async createUserData(
    data: Omit<UserDataInterface, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number> {
    const pool = getPool();
    const stringifiedData = this.stringifyFields(data);
    const sql = `
      INSERT INTO user_data (search_history, interests, view_history, review_history, genres)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      stringifiedData.search_history,
      stringifiedData.interests,
      stringifiedData.view_history,
      stringifiedData.review_history,
      stringifiedData.genres,
    ]);

    return (result as RowDataPacket).insertId;
  }

  async getUserDataById(id: number): Promise<UserDataInterface | null> {
    const pool = getPool();
    const sql = 'SELECT * FROM user_data WHERE id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows.length ? this.parseFields(rows[0]) : null;
  }

  async updateUserData(
    id: number,
    updates: Partial<UserDataInterface>
  ): Promise<void> {
    const pool = getPool();
    const stringifiedUpdates = this.stringifyFields(updates);
    const fields = [];
    const values: (string | number)[] = [];

    for (const [key, value] of Object.entries(stringifiedUpdates)) {
      fields.push(`${key} = ?`);
      values.push(value as string | number);
    }

    values.push(id);
    const sql = `UPDATE user_data SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, values);
  }

  async deleteUserData(id: number): Promise<void> {
    const pool = getPool();
    const sql = 'DELETE FROM user_data WHERE id = ?';
    await pool.query(sql, [id]);
  }
}

export default UserData;
