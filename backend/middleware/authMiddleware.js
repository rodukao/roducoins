const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;  // Pegando o token do cookie

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto');  // substitua 'secreto' pela sua chave secreta
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authenticate;
