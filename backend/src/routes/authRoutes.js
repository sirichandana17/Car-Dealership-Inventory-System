const router = require('express').Router();
const { registerHandler, loginHandler, meHandler } = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/me', authenticate, meHandler);
router.get('/admin-only', authenticate, requireAdmin, (req, res) => res.json({ ok: true }));

module.exports = router;
