import Database from 'better-sqlite3';
const db = new Database('todo.db');

// Enable Foreign Keys
db.pragma('foreign_keys = ON');

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    position INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

export default db;