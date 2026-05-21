const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if first user
    const countRes = await db.query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(countRes.rows[0].count, 10);
    const role = userCount === 0 ? 'admin' : 'user';

    const hash = await bcrypt.hash(password, 10);
    
    try {
      const insertRes = await db.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
        [username, hash, role]
      );
      res.json({ id: insertRes.rows[0].id, username, role });
    } catch (err) {
      if (err.code === '23505') { // Postgres unique violation
        return res.status(400).json({ error: 'Username already exists' });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const userRes = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userRes.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecret123',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
