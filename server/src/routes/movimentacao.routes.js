const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const movimentacaoController = require('../controllers/movimentacao.controller'); // ← Nome descritivo

// Todas as rotas protegidas
router.get('/', authMiddleware, movimentacaoController.listarMovimentacoes);
router.post('/', authMiddleware, movimentacaoController.criarMovimentacao);
router.post('/item', authMiddleware, movimentacaoController.adicionarItem);

module.exports = router;