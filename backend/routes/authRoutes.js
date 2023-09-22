const express = require('express');
const authController = require('../controllers/authControllers');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();
const { check } = require('express-validator');

router.post('/register', [
    check('email').isEmail().withMessage('Digite um e-mail válido'),
    check('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
  ], authController.register);
  
router.post('/login', authController.login);

router.get('/checkToken', authenticate, authController.checkToken);

router.post('/logout', authController.logout);

router.get('/userInfo', authenticate, authController.getUserInfo);

module.exports = router;