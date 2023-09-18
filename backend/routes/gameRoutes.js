const express = require('express');
const gameController = require('../controllers/gameController');
const authenticate = require('./authMiddleware');
const router = express.Router();

router.post('/bet', authenticate, gameController.placeBet);

module.exports = router;