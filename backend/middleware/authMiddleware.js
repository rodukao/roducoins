const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];  // Pegando o token do cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // substitua 'secreto' pela sua chave secreta
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authenticate;
