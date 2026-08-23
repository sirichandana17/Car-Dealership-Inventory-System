const router = require('express').Router();
const ctrl = require('../controllers/vehicleController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/search',           ctrl.searchVehicles);
router.get('/',                 ctrl.getAllVehicles);
router.post('/',                authenticate, requireAdmin, ctrl.createVehicle);
router.put('/:id',              authenticate, requireAdmin, ctrl.updateVehicle);
router.delete('/:id',           authenticate, requireAdmin, ctrl.deleteVehicle);
router.post('/:id/purchase',    authenticate, ctrl.purchaseVehicle);
router.post('/:id/restock',     authenticate, requireAdmin, ctrl.restockVehicle);

module.exports = router;
