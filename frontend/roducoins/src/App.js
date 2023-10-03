import './App.css';
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
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token'); // Adicione esta linha
      if(!token && location.pathname !== '/register'){
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('https://roducoins.onrender.com/api/checkToken', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
      const token = localStorage.getItem('token'); // Pega o token do localStorage
      try {
        const res = await axios.get('https://roducoins.onrender.com/api/userInfo', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  const handleLogout = async () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    setIsAuthenticated(false);
    navigate('/login');
  };

  const viewAdAndEarnCoins = async () => {
    const token = localStorage.getItem('token'); // Pega o token do localStorage
    try {
      const response = await axios.post('https://roducoins.onrender.com/api/game/addCoinsForAd', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Atualize o estado com o novo saldo de moedas
      setCoins(response.data.newCoinBalance);
    } catch (error) {
      console.error('Houve um erro ao tentar ver o anúncio:', error);
    }
  };
  

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} isAuthenticated={isAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bet" element={<BetPage setCoins={setCoins} coins={coins} isAuthenticated={isAuthenticated} />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/home" element={
          isAuthenticated ? (
            <main class="App-main">
              <div class="player-name">
                <p>Usuário</p>
              </div>
              <div class="dados">
                <div class="saldo-moedas">
                  <p>Saldo de moedas: {coins}</p>
                </div>
                <div>
                  <button onClick={viewAdAndEarnCoins}>Ver Anúncio e Ganhar Moedas</button>
                </div>
                <div>
                  <button onClick={() => navigate('/ranking')}>Ranking</button>
                </div>
                <div>
                  <button onClick={handleLogout}>Deslogar</button>
                </div>
                
              </div>
              <div class="jogos">
                <button onClick={() => navigate('/bet')}>Cara ou Coroa</button>
              </div>
              <div class="jogo-atual">
                            {/* Aqui vai o jogo selecionado */}
                            {/* O conteúdo aqui vai depender do jogo que o usuário selecionou */}
              </div>
          </main>
          ) : null
        } />
      </Routes>
    </div>
  );
  
}

export default App;
