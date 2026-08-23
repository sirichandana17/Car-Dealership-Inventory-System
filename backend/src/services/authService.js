const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail } = require('../models/userModel');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    const err = new Error('name, email and password are required');
    err.status = 400;
    throw err;
  }
  if (!EMAIL_RE.test(email)) {
    const err = new Error('Invalid email format');
    err.status = 400;
    throw err;
  }

  const existing = await findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return createUser({ name, email, passwordHash });
}

async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('email and password are required');
    err.status = 400;
    throw err;
  }

  const user = await findByEmail(email);
  const valid = user && (await bcrypt.compare(password, user.password_hash));
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  return { token };
}

module.exports = { register, login };
