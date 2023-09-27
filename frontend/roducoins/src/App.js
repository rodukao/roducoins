import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import RankingPage from './components/RankingPage';
import BetPage from './components/BetPage';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coins, setCoins] = useState(0); // Inicialmente, o jogador tem 0 moedas

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get('https://roducoins.onrender.com/api/checkToken', {
          withCredentials: true
        });
  
        if (res.data.valid) {
          setIsAuthenticated(true); // Autentica o usuário se o token for válido
        }
      } catch (err) {
        console.error('Erro ao verificar o token:', err.response.data.message);
        if (location.pathname !== '/register') { // Evita redirecionamento se estiver na página de registro
          navigate('/login');
        }
      }
    };
  
    checkToken();
  }, [navigate]); // Adicionado 'navigate' às dependências, pois é usado no useEffect

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('https://roducoins.onrender.com/api/userInfo', {
          withCredentials: true
        });
        setCoins(res.data.coins);
      } catch (err) {
        console.error('Erro ao buscar informações do usuário:', err);
      }
    };
  
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const makeBet = async () => {
    try {
      const response = await axios.post('https://roducoins.onrender.com/api/game/bet', {
        "amount": 20,
        "betOn": "coroa"
      }, {
        withCredentials: true // Envio de cookies
      });
      setCoins(response.data.newCoinBalance);
    } catch (error) {
      console.error('Houve um erro ao fazer a aposta:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://roducoins.onrender.com/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const viewAdAndEarnCoins = async () => {
    try {
      const response = await axios.post('https://roducoins.onrender.com/api/game/addCoinsForAd', {}, {
        withCredentials: true // Envio de cookies
      });
      // Atualize o estado com o novo saldo de moedas
      setCoins(response.data.newCoinBalance);
    } catch (error) {
      console.error('Houve um erro ao tentar ver o anúncio:', error);
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bem-vindo ao Jogo de Apostas!</h1>
      </header>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} isAuthenticated={isAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bet" element={<BetPage setCoins={setCoins} coins={coins} isAuthenticated={isAuthenticated} />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/home" element={
          isAuthenticated ? (
            <main className="App-main">
              <p>Saldo de moedas: {coins}</p>
              <button onClick={() => navigate('/bet')}>Apostar</button>
              <button onClick={viewAdAndEarnCoins}>Ver Anúncio e Ganhar Moedas</button>
              <button onClick={() => navigate('/ranking')}>Ranking</button>
              <button onClick={handleLogout}>Deslogar</button>
            </main>
          ) : null
        } />
      </Routes>
    </div>
  );
  
}

export default App;
