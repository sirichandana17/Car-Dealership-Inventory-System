const request = require('supertest');
const app = require('../app');
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// ─── helpers ─────────────────────────────────────────────────────────────────

async function getToken(email, password) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

const validVehicle = {
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
};

async function createVehicle(token, data = validVehicle) {
  return request(app).post('/api/vehicles').set('Authorization', `Bearer ${token}`).send(data);
}

// ─── lifecycle ────────────────────────────────────────────────────────────────

let adminToken;
let userToken;

beforeEach(async () => {
  await pool.query('DELETE FROM vehicles');
  await pool.query('DELETE FROM users');

  const hash = await bcrypt.hash('AdminPass1!', 10);
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Admin', 'admin@example.com', hash, 'ADMIN']
  );
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['User', 'user@example.com', hash, 'USER']
  );

  adminToken = await getToken('admin@example.com', 'AdminPass1!');
  userToken = await getToken('user@example.com', 'AdminPass1!');
});

afterAll(async () => {
  await pool.query('DELETE FROM vehicles');
  await pool.query('DELETE FROM users');
  await pool.end();
});

// ─── POST /api/vehicles ───────────────────────────────────────────────────────

describe('POST /api/vehicles', () => {
  test('admin can create a vehicle — returns 201 with vehicle data', async () => {
    const res = await createVehicle(adminToken);
    expect(res.status).toBe(201);
    expect(res.body.vehicle).toMatchObject({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      quantity: 5,
    });
    expect(Number(res.body.vehicle.price)).toBe(25000);
    expect(res.body.vehicle.id).toBeDefined();
  });

  test('regular user cannot create a vehicle — returns 403', async () => {
    const res = await createVehicle(userToken);
    expect(res.status).toBe(403);
  });

  test('unauthenticated request returns 401', async () => {
    const res = await request(app).post('/api/vehicles').send(validVehicle);
    expect(res.status).toBe(401);
  });

  test('missing make returns 400', async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, make: '' });
    expect(res.status).toBe(400);
  });

  test('missing model returns 400', async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, model: '' });
    expect(res.status).toBe(400);
  });

  test('missing category returns 400', async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, category: '' });
    expect(res.status).toBe(400);
  });

  test('negative price returns 400', async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, price: -1 });
    expect(res.status).toBe(400);
  });

  test('negative quantity returns 400', async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, quantity: -1 });
    expect(res.status).toBe(400);
  });
});

// ─── GET /api/vehicles ────────────────────────────────────────────────────────

describe('GET /api/vehicles', () => {
  test('returns all vehicles as an array', async () => {
    await createVehicle(adminToken);
    await createVehicle(adminToken, { ...validVehicle, make: 'Honda', model: 'Civic' });
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.vehicles)).toBe(true);
    expect(res.body.vehicles.length).toBe(2);
  });

  test('returns empty array when no vehicles exist', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });
});

// ─── GET /api/vehicles/search ─────────────────────────────────────────────────

describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await createVehicle(adminToken, { make: 'Toyota', model: 'Camry',   category: 'Sedan',  price: 25000, quantity: 5 });
    await createVehicle(adminToken, { make: 'Toyota', model: 'RAV4',    category: 'SUV',    price: 35000, quantity: 3 });
    await createVehicle(adminToken, { make: 'Honda',  model: 'Civic',   category: 'Sedan',  price: 22000, quantity: 7 });
    await createVehicle(adminToken, { make: 'Ford',   model: 'Mustang', category: 'Coupe',  price: 55000, quantity: 2 });
  });

  test('search by make returns matching vehicles', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Toyota');
    expect(res.status).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    res.body.vehicles.forEach(v => expect(v.make).toBe('Toyota'));
  });

  test('search by model returns matching vehicles', async () => {
    const res = await request(app).get('/api/vehicles/search?model=Civic');
    expect(res.status).toBe(200);
    expect(res.body.vehicles.length).toBe(1);
    expect(res.body.vehicles[0].model).toBe('Civic');
  });

  test('search by category returns matching vehicles', async () => {
    const res = await request(app).get('/api/vehicles/search?category=Sedan');
    expect(res.status).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    res.body.vehicles.forEach(v => expect(v.category).toBe('Sedan'));
  });

  test('search by price range returns matching vehicles', async () => {
    const res = await request(app).get('/api/vehicles/search?minPrice=20000&maxPrice=30000');
    expect(res.status).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    res.body.vehicles.forEach(v => {
      expect(Number(v.price)).toBeGreaterThanOrEqual(20000);
      expect(Number(v.price)).toBeLessThanOrEqual(30000);
    });
  });

  test('combined filters narrow results correctly', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Toyota&category=SUV');
    expect(res.status).toBe(200);
    expect(res.body.vehicles.length).toBe(1);
    expect(res.body.vehicles[0].model).toBe('RAV4');
  });

  test('no matches returns empty array', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Ferrari');
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });
});

// ─── PUT /api/vehicles/:id ────────────────────────────────────────────────────

describe('PUT /api/vehicles/:id', () => {
  let vehicleId;

  beforeEach(async () => {
    const res = await createVehicle(adminToken);
    vehicleId = res.body.vehicle.id;
  });

  test('admin can update a vehicle — returns updated data', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 27000 });
    expect(res.status).toBe(200);
    expect(Number(res.body.vehicle.price)).toBe(27000);
  });

  test('regular user cannot update — returns 403', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 27000 });
    expect(res.status).toBe(403);
  });

  test('updating non-existent vehicle returns 404', async () => {
    const res = await request(app)
      .put('/api/vehicles/999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 27000 });
    expect(res.status).toBe(404);
  });

  test('invalid price on update returns 400', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -500 });
    expect(res.status).toBe(400);
  });
});

// ─── DELETE /api/vehicles/:id ─────────────────────────────────────────────────

describe('DELETE /api/vehicles/:id', () => {
  let vehicleId;

  beforeEach(async () => {
    const res = await createVehicle(adminToken);
    vehicleId = res.body.vehicle.id;
  });

  test('admin can delete a vehicle — returns 200', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('regular user cannot delete — returns 403', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  test('deleting non-existent vehicle returns 404', async () => {
    const res = await request(app)
      .delete('/api/vehicles/999999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});

// ─── POST /api/vehicles/:id/purchase ─────────────────────────────────────────

describe('POST /api/vehicles/:id/purchase', () => {
  let vehicleId;

  beforeEach(async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, quantity: 2 });
    vehicleId = res.body.vehicle.id;
  });

  test('authenticated user can purchase — returns 200', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/purchased/i);
  });

  test('purchase decreases quantity by 1 in the database', async () => {
    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    const [rows] = await pool.query('SELECT quantity FROM vehicles WHERE id = ?', [vehicleId]);
    expect(rows[0].quantity).toBe(1);
  });

  test('purchase when quantity is 0 returns 400', async () => {
    await request(app).post(`/api/vehicles/${vehicleId}/purchase`).set('Authorization', `Bearer ${userToken}`);
    await request(app).post(`/api/vehicles/${vehicleId}/purchase`).set('Authorization', `Bearer ${userToken}`);
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/out of stock/i);
  });

  test('unauthenticated purchase returns 401', async () => {
    const res = await request(app).post(`/api/vehicles/${vehicleId}/purchase`);
    expect(res.status).toBe(401);
  });

  test('purchase non-existent vehicle returns 404', async () => {
    const res = await request(app)
      .post('/api/vehicles/999999/purchase')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });
});

// ─── POST /api/vehicles/:id/restock ──────────────────────────────────────────

describe('POST /api/vehicles/:id/restock', () => {
  let vehicleId;

  beforeEach(async () => {
    const res = await createVehicle(adminToken, { ...validVehicle, quantity: 2 });
    vehicleId = res.body.vehicle.id;
  });

  test('admin can restock — returns updated quantity', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 10 });
    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(12);
  });

  test('restock increases quantity correctly in the database', async () => {
    await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });
    const [rows] = await pool.query('SELECT quantity FROM vehicles WHERE id = ?', [vehicleId]);
    expect(rows[0].quantity).toBe(7);
  });

  test('regular user cannot restock — returns 403', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 10 });
    expect(res.status).toBe(403);
  });

  test('restock amount of 0 or negative returns 400', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/amount must be positive/i);
  });

  test('restock non-existent vehicle returns 404', async () => {
    const res = await request(app)
      .post('/api/vehicles/999999/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });
    expect(res.status).toBe(404);
  });
});
