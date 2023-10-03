import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);  // Novo estado para controle do loading
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://roducoins.onrender.com/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setLoginError(null);  // Limpa qualquer erro anterior
      onLoginSuccess();
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('E-mail ou senha incorretos');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="img/logo.png" alt="Logo" className="login-logo" />
        <input
          type="email"
          placeholder="E-mail"
          onChange={e => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={e => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} disabled={isLoading || isButtonDisabled} className="login-button">
          {isLoading ? 'CONECTANDO' : 'ENTRAR'}
        </button>
        <p className="login-register">
          Ainda não possui uma conta? <a href="#" onClick={() => navigate('/register')}>REGISTRE-SE</a>
        </p>
        {loginError && <p className="error-message">{loginError}</p>}
      </div>
    </div>
  );
};

export default LoginPage;