import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BetPage = ({ setCoins, coins, isAuthenticated }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);
    
  const [betOn, setBetOn] = useState('cara');
  const [amount, setAmount] = useState(0);

  const handleBet = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/game/bet', {
        amount,
        betOn,
      }, {
        withCredentials: true,
      });
      console.log(response.data)
      setCoins(response.data.coins);
    } catch (error) {
      console.error('Erro ao fazer a aposta:', error);
    }
  };

  return (
    <div>
      <h2>Faça sua aposta</h2>
      <p>Você tem {coins} moedas.</p>
      <div>
        <label>
          Apostar em: 
          <select value={betOn} onChange={(e) => setBetOn(e.target.value)}>
            <option value="cara">Cara</option>
            <option value="coroa">Coroa</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Quantidade:
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </label>
      </div>
      <button onClick={handleBet}>Apostar</button>
      <button onClick={() => navigate('/home')}>Voltar</button>
    </div>
  );
};

export default BetPage;