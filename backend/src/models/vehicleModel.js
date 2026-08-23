const { pool } = require('../config/db');

async function create({ make, model, category, price, quantity }) {
  const [result] = await pool.query(
    'INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
    [make, model, category, price, quantity]
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
  if (make)     { sql += ' AND make = ?';           params.push(make); }
  if (model)    { sql += ' AND model = ?';          params.push(model); }
  if (category) { sql += ' AND category = ?';       params.push(category); }
  if (minPrice) { sql += ' AND price >= ?';         params.push(Number(minPrice)); }
  if (maxPrice) { sql += ' AND price <= ?';         params.push(Number(maxPrice)); }
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
  return rows[0] || null;
}

async function update(id, fields) {
  const allowed = ['make', 'model', 'category', 'price', 'quantity'];
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
  await pool.query('UPDATE vehicles SET quantity = quantity - 1 WHERE id = ? AND quantity > 0', [id]);
  return findById(id);
}

async function incrementQuantity(id, amount) {
  await pool.query('UPDATE vehicles SET quantity = quantity + ? WHERE id = ?', [amount, id]);
  return findById(id);
}

module.exports = { create, findAll, search, findById, update, remove, decrementQuantity, incrementQuantity };
