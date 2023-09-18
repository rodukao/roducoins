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

    const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1d' });

    res.status(201).json({ token });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1d' });

    res.status(200).json({ token });
};