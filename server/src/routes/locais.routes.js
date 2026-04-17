const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const locaisController = require('../controllers/locais.controller'); // ← Nome descritivo

// Faltava o authMiddleware!
router.get('/', authMiddleware, locaisController.listarLocais); // ← listarLocais (padronizado)

module.exports = router;