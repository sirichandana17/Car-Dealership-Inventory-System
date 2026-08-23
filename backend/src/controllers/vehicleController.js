const svc = require('../services/vehicleService');

function handle(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err.status) return res.status(err.status).json({ error: err.message });
      next(err);
    }
  };
}

const createVehicle = handle(async (req, res) => {
  const vehicle = await svc.createVehicle(req.body);
  res.status(201).json({ vehicle });
});

const getAllVehicles = handle(async (req, res) => {
  const vehicles = await svc.getAllVehicles();
  res.json({ vehicles });
});

const searchVehicles = handle(async (req, res) => {
  const vehicles = await svc.searchVehicles(req.query);
  res.json({ vehicles });
});

const updateVehicle = handle(async (req, res) => {
  const vehicle = await svc.updateVehicle(req.params.id, req.body);
  res.json({ vehicle });
});

const deleteVehicle = handle(async (req, res) => {
  await svc.deleteVehicle(req.params.id);
  res.json({ message: 'Vehicle deleted successfully' });
});

const purchaseVehicle = handle(async (req, res) => {
  const vehicle = await svc.purchaseVehicle(req.params.id);
  res.json({ message: 'Vehicle purchased successfully', vehicle });
});

const restockVehicle = handle(async (req, res) => {
  const vehicle = await svc.restockVehicle(req.params.id, req.body.amount);
  res.json({ vehicle });
});

module.exports = { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle, purchaseVehicle, restockVehicle };
