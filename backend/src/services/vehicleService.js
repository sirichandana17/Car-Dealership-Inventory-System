const Vehicle = require('../models/vehicleModel');

function validateVehicleFields({ make, model, category, price, quantity }) {
  if (!make || !make.toString().trim())     { const e = new Error('make is required');     e.status = 400; throw e; }
  if (!model || !model.toString().trim())   { const e = new Error('model is required');    e.status = 400; throw e; }
  if (!category || !category.toString().trim()) { const e = new Error('category is required'); e.status = 400; throw e; }
  if (price === undefined || price === null || Number(price) < 0) { const e = new Error('price must be >= 0'); e.status = 400; throw e; }
  if (quantity === undefined || quantity === null || Number(quantity) < 0) { const e = new Error('quantity must be >= 0'); e.status = 400; throw e; }
}

async function createVehicle(data) {
  validateVehicleFields(data);
  return Vehicle.create(data);
}

async function getAllVehicles() {
  return Vehicle.findAll();
}

async function searchVehicles(filters) {
  return Vehicle.search(filters);
}

async function updateVehicle(id, fields) {
  if (fields.price !== undefined && Number(fields.price) < 0) {
    const e = new Error('price must be >= 0'); e.status = 400; throw e;
  }
  if (fields.quantity !== undefined && Number(fields.quantity) < 0) {
    const e = new Error('quantity must be >= 0'); e.status = 400; throw e;
  }
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) { const e = new Error('Vehicle not found'); e.status = 404; throw e; }
  return Vehicle.update(id, fields);
}

async function deleteVehicle(id) {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) { const e = new Error('Vehicle not found'); e.status = 404; throw e; }
  await Vehicle.remove(id);
}

async function purchaseVehicle(id) {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) { const e = new Error('Vehicle not found'); e.status = 404; throw e; }
  if (vehicle.quantity === 0) { const e = new Error('Out of stock'); e.status = 400; throw e; }
  return Vehicle.decrementQuantity(id);
}

async function restockVehicle(id, amount) {
  if (!amount || Number(amount) <= 0) {
    const e = new Error('Amount must be positive'); e.status = 400; throw e;
  }
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) { const e = new Error('Vehicle not found'); e.status = 404; throw e; }
  return Vehicle.incrementQuantity(id, Number(amount));
}

module.exports = { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle, purchaseVehicle, restockVehicle };
