require('dotenv').config();
const db = require('./db');

async function seed() {
  console.log('Initializing PostgreSQL Database...');

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      );
    `);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit(0);
  }
}

seed();
