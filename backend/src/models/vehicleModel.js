const { pool } = require('../config/db');

async function create({ make, model, category, year, price, quantity, fuel_type, transmission, mileage, description, image_url }) {
  const [result] = await pool.query(
    `INSERT INTO vehicles (make, model, category, year, price, quantity, fuel_type, transmission, mileage, description, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [make, model, category, year || 2024, price, quantity,
     fuel_type || 'Petrol', transmission || 'Automatic',
     mileage || null, description || null, image_url || null]
  );
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
  return rows;
}

async function search({ make, model, category, minPrice, maxPrice }) {
  let sql = 'SELECT * FROM vehicles WHERE 1=1';
  const params = [];
  if (make)     { sql += ' AND make LIKE ?';     params.push(`%${make}%`); }
  if (model)    { sql += ' AND model LIKE ?';    params.push(`%${model}%`); }
  if (category) { sql += ' AND category LIKE ?'; params.push(`%${category}%`); }
  if (minPrice) { sql += ' AND price >= ?';      params.push(Number(minPrice)); }
  if (maxPrice) { sql += ' AND price <= ?';      params.push(Number(maxPrice)); }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findByMake(make, excludeId) {
  const [rows] = await pool.query(
    'SELECT * FROM vehicles WHERE make = ? AND id != ? LIMIT 4',
    [make, excludeId]
  );
  return rows;
}

async function update(id, fields) {
  const allowed = ['make', 'model', 'category', 'year', 'price', 'quantity', 'fuel_type', 'transmission', 'mileage', 'description', 'image_url'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k));
  if (updates.length === 0) return findById(id);
  const sql = `UPDATE vehicles SET ${updates.map(k => `${k} = ?`).join(', ')} WHERE id = ?`;
  await pool.query(sql, [...updates.map(k => fields[k]), id]);
  return findById(id);
}

async function remove(id) {
  await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
}

async function decrementQuantity(id) {
  const [result] = await pool.query('UPDATE vehicles SET quantity = quantity - 1 WHERE id = ? AND quantity > 0', [id]);
  if (result.affectedRows === 0) return null;
  return findById(id);
}

async function incrementQuantity(id, amount) {
  await pool.query('UPDATE vehicles SET quantity = quantity + ? WHERE id = ?', [amount, id]);
  return findById(id);
}

module.exports = { create, findAll, search, findById, findByMake, update, remove, decrementQuantity, incrementQuantity };
