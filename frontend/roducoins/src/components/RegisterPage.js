import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ isAuthenticated }) => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');  // Pega o token do localStorage

  if (token) {
    navigate('/home');
    return null;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res  = await axios.post('https://roducoins.onrender.com/api/register', {
        email,
        password
      });
      console.log('Registrado com sucesso:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrar</button>
      <button onClick={() => navigate('/login')}>Ir para Login</button>
    </div>
  );
};

export default RegisterPage;
