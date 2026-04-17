const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const bensController = require('../controllers/bens.controller');

router.get('/', authMiddleware, bensController.listarBens);

module.exports = router;