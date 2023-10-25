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
    let result;
    const randomNum = Math.random();

    if (randomNum < 0.6) {
      // 60% de chance de ser a escolha do usuário
      result = betOn;
    } else {
      // 40% de chance de ser a opção contrária
      result = betOn === 'cara' ? 'coroa' : 'cara';
    }

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

exports.addCoinsForAd = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
      
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
  
    // Adicionar 15 moedas ao saldo do usuário
    user.coins += 15;
    await user.save();
  
    res.status(200).json({ newCoinBalance: user.coins });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar moedas', error });
  }
};