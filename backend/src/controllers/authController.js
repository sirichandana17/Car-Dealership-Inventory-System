const { register, login } = require('../services/authService');
const { pool } = require('../config/db');

async function registerHandler(req, res, next) {
  try {
    const user = await register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

async function loginHandler(req, res, next) {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

async function meHandler(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerHandler, loginHandler, meHandler };
