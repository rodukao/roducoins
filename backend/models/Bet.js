const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    betOn: String,  // 'cara' ou 'coroa'
    result: String, // 'ganhou' ou 'perdeu'
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model('Bet', BetSchema);