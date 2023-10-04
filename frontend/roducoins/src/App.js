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
  const [userName, setUserName] = useState('');

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
        setUserName(res.data.name);
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
                <p>{userName}</p>
              </div>
              <div class="dados">
                <div class="saldo-moedas">
                  <img src="img/coin-icon.png" /><span> {coins}</span>
                </div>
                <div class="mais-roducoins">
                  <button onClick={viewAdAndEarnCoins}>+ roducoins</button>
                </div>
                <div class="tela-ranking">
                  <button onClick={() => navigate('/ranking')}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"/></svg>
                  </button>
                </div>
                <div class="botao-logout">
                  <button onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                  </button>
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
