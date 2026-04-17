const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const usuariosController = require('../controllers/usuarios.controller'); // ← Nome descritivo

// Rota protegida
router.get('/', authMiddleware, usuariosController.listarUsuarios); // ← listarUsuarios (padronizado)

module.exports = router;