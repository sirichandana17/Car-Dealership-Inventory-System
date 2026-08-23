const request = require('supertest');
const app = require('../app');
const { pool } = require('../config/db');

// ─── helpers ────────────────────────────────────────────────────────────────

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password1!',
};

async function registerUser(data = validUser) {
  return request(app).post('/api/auth/register').send(data);
}

async function loginUser(email = validUser.email, password = validUser.password) {
  return request(app).post('/api/auth/login').send({ email, password });
}

// ─── lifecycle ───────────────────────────────────────────────────────────────

beforeEach(async () => {
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.query('DELETE FROM users');
  await pool.end();
});

// ─── REGISTRATION ────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  test('successful registration returns 201 with user data (no password)', async () => {
    const res = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ name: validUser.name, email: validUser.email, role: 'USER' });
    expect(res.body.user.password_hash).toBeUndefined();
    expect(res.body.user.password).toBeUndefined();
  });

  test('password is hashed in the database — never stored as plain text', async () => {
    await registerUser();
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE email = ?', [validUser.email]);
    expect(rows[0].password_hash).not.toBe(validUser.password);
    expect(rows[0].password_hash).toMatch(/^\$2[ab]\$/);
  });

  test('default role is USER', async () => {
    await registerUser();
    const [rows] = await pool.query('SELECT role FROM users WHERE email = ?', [validUser.email]);
    expect(rows[0].role).toBe('USER');
  });

  test('duplicate email returns 409', async () => {
    await registerUser();
    const res = await registerUser();
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/email already registered/i);
  });

  test('missing name returns 400', async () => {
    const res = await registerUser({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(400);
  });

  test('missing email returns 400', async () => {
    const res = await registerUser({ name: validUser.name, password: validUser.password });
    expect(res.status).toBe(400);
  });

  test('missing password returns 400', async () => {
    const res = await registerUser({ name: validUser.name, email: validUser.email });
    expect(res.status).toBe(400);
  });

  test('invalid email format returns 400', async () => {
    const res = await registerUser({ ...validUser, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid email/i);
  });
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await registerUser();
  });

  test('successful login returns 200 with JWT token', async () => {
    const res = await loginUser();
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
  });

  test('JWT payload contains user id and role', async () => {
    const res = await loginUser();
    const payload = JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64').toString());
    expect(payload.id).toBeDefined();
    expect(payload.role).toBe('USER');
  });

  test('wrong password returns 401', async () => {
    const res = await loginUser(validUser.email, 'WrongPassword!');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  test('unknown email returns 401', async () => {
    const res = await loginUser('nobody@example.com', validUser.password);
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  test('missing email returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: validUser.password });
    expect(res.status).toBe(400);
  });

  test('missing password returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: validUser.email });
    expect(res.status).toBe(400);
  });
});

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────────────────────

describe('authenticate middleware', () => {
  let token;

  beforeEach(async () => {
    await registerUser();
    const res = await loginUser();
    token = res.body.token;
  });

  test('valid JWT grants access to protected route', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(validUser.email);
  });

  test('missing Authorization header returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no token/i);
  });

  test('invalid token returns 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid token/i);
  });
});

// ─── ADMIN MIDDLEWARE ─────────────────────────────────────────────────────────

describe('requireAdmin middleware', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    // regular user
    await registerUser();
    const userRes = await loginUser();
    userToken = userRes.body.token;

    // admin user — insert directly so we can set role
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('AdminPass1!', 10);
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@example.com', hash, 'ADMIN']
    );
    const adminRes = await loginUser('admin@example.com', 'AdminPass1!');
    adminToken = adminRes.body.token;
  });

  test('ADMIN role can access admin-only route', async () => {
    const res = await request(app)
      .get('/api/auth/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  test('USER role is forbidden from admin-only route', async () => {
    const res = await request(app)
      .get('/api/auth/admin-only')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/forbidden/i);
  });

  test('no token on admin-only route returns 401', async () => {
    const res = await request(app).get('/api/auth/admin-only');
    expect(res.status).toBe(401);
  });
});
