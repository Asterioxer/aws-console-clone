const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'data', 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );
`);

module.exports = db;
