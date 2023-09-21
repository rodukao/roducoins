import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import { useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coins, setCoins] = useState(0); // Inicialmente, o jogador tem 0 moedas

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/checkToken', {
          withCredentials: true
        });
  
        if (res.data.valid) {
          setIsAuthenticated(true); // Autentica o usuário se o token for válido
        }
      } catch (err) {
        console.error('Erro ao verificar o token:', err.response.data.message);
        navigate('/login');
      }
    };
  
    checkToken();
  }, [navigate]); // Adicionado 'navigate' às dependências, pois é usado no useEffect

  const makeBet = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/game/bet', {
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
      await axios.post('http://localhost:3001/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bem-vindo ao Jogo de Apostas!</h1>
      </header>
      {isAuthenticated ? (
        <main className="App-main">
          <p>Saldo de moedas: {coins}</p>
          <button onClick={makeBet}>Apostar</button>
          <button onClick={handleLogout}>Deslogar</button>
        </main>
      ) : (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
