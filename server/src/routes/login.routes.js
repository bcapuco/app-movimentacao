const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

// Rota de login NÃO usa authMiddleware (é pública)
router.post('/', loginController.login);

module.exports = router;