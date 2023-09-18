const express = require('express');
const gameController = require('../controllers/gameController');
const router = express.Router();

router.post('/bet', gameController.placeBet);

module.exports = router;