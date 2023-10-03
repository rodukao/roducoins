import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);  // Novo estado para controle do loading
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    if (email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res  = await axios.post('https://roducoins.onrender.com/api/register', {
        email,
        password
      });
      setRegisterError(null);  // Limpa qualquer erro anterior
      console.log('Registrado com sucesso:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setRegisterError('Este e-mail já está cadastrado');
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
        <button onClick={handleRegister} disabled={isLoading || isButtonDisabled} className="login-button">
          {isLoading ? 'REGISTRANDO' : 'CRIAR CONTA'}
        </button>
        <p className="login-register">
          Já possui uma conta? <a href="#" onClick={() => navigate('/login')}>ENTRAR</a>
        </p>
        {registerError && <p className="error-message">{registerError}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
