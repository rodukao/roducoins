const { validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token });
};

exports.login = async (req, res) => {

    const { email, password } = req.body;
    console.log('Iniciando processo de login para o e-mail:', email);
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'E-mail ou senha inválidos', errorCode: 'INVALID_CREDENTIALS' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });    
    res.status(200).json({ token, coins: user.coins });
};

exports.checkToken = (req, res) => {
    // Se o middleware de autenticação passar, o token é válido
    res.status(200).json({ valid: true });
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'Deslogado com sucesso' });
  };

exports.getUserInfo = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
  
    res.status(200).json({ coins: user.coins });
  };

  exports.getTopUsers = async (req, res) => {
    const topUsers = await User.find({}, 'email coins')
        .sort({ coins: -1 })
        .limit(10)
        .lean();  // Retorna objetos JavaScript simples
    const topUsersWithNames = topUsers.map(user => {
        const name = user.email.split('@')[0];
        return {
            name,
            coins: user.coins
        };
    });   
    res.status(200).json(topUsersWithNames);
  };