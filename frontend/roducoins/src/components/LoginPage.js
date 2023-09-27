import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess, isAuthenticated }) => {

  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/home');
    return null;
  }
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://roducoins.onrender.com/api/login', {
        email,
        password
      }, {
        withCredentials: true
      });
      onLoginSuccess();  // Isso atualizaria o estado isAuthenticated para true em App.js
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };
  

  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate('/register')}>Ir para Registro</button>

    </div>
  );
};

export default LoginPage;
