const Bet = require('../models/Bet');
const User = require('../models/User');

exports.placeBet = async (req, res) => {
    const userId = req.user.id; // Supondo que você já tenha um middleware de autenticação
    const { amount, betOn } = req.body;
  
    const user = await User.findById(userId);
    
    // Verificar se o usuário tem moedas suficientes
    if (user.coins < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }
  
    // Gerar resultado
    const options = ['cara', 'coroa'];
    const result = options[Math.floor(Math.random() * options.length)];

    console.log('Usuário', userId, 'está fazendo uma aposta de', amount, 'em', betOn);
  
    // Atualizar saldo do usuário
    const outcome = betOn === result ? 'ganhou' : 'perdeu';
    user.coins += outcome === 'ganhou' ? amount : -amount;
    await user.save();
  
    // Salvar aposta
    const bet = new Bet({ userId, amount, betOn, result: outcome });
    await bet.save();
  
    res.status(200).json({ message: `Você ${outcome}!`, coins: user.coins });
  };