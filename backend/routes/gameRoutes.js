const express = require('express');
const { check } = require('express-validator');
const gameController = require('../controllers/gameController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/bet', [
    check('amount').isNumeric().withMessage('O valor da aposta deve ser numérico'),
    check('betOn').isIn(['cara', 'coroa']).withMessage('Você só pode apostar em "cara" ou "coroa"')
], authenticate, gameController.placeBet);

module.exports = router;