import db from '../db/setupDB';

export interface UserSchema {
  id?: number;
  username: string;
  password?: string;
}

export class User {
  // Find a user by username for Login
  static findByUsername(username: string): UserSchema | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as UserSchema | undefined;
  }

  // Create a new user for Registration
  static create(username: string, passwordHash: string): number | bigint {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(username, passwordHash);
    return result.lastInsertRowid;
  }

  // Get a user by ID (useful for middleware/sessions)
  static findById(id: number): UserSchema | undefined {
    const stmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
    return stmt.get(id) as UserSchema | undefined;
  }
}