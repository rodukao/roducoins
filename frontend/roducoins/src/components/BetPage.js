import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BetPage = ({ setCoins, coins, isAuthenticated }) => {

  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('about:blank'); // Estado inicial
  const [result, setResult] = useState(null); // 'ganhou' ou 'perdeu'
  const [finalFace, setFinalFace] = useState(null); // 'cara' ou 'coroa'

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
      setIframeSrc('ad.html');
    }, []); // Adicione isso apenas se você quer que isso aconteça uma vez após o primeiro render
    
  const [betOn, setBetOn] = useState('cara');
  const [amount, setAmount] = useState(0);

  const handleBet = async () => {
    setIsSpinning(true)
    setBetOn(selectedOption);
    console.log(betOn)
    console.log(selectedOption)

    if(amount => coins){
      setResult('Você não tem moedas suficientes para fazer essa aposta');
      return;
    }

    try {
    setTimeout(async () => {
      const token = localStorage.getItem('token'); // Pega o token do localStorage
      
        const response = await axios.post('https://roducoins.onrender.com/api/game/bet', {
          amount,
          betOn: selectedOption,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        const {message, coins} = response.data
        console.log(message)
        setCoins(coins);

        setIsSpinning(false);

        if (message) {
          setResult(message); // 'ganhou' ou 'perdeu'
            if (message === 'Você ganhou!') {
              setFinalFace(selectedOption);  // Mesma face que o usuário apostou
            } else if (message === 'Você perdeu!') {
              setFinalFace(selectedOption === 'cara' ? 'coroa' : 'cara');  // Face oposta
            }
        }

      }, 3000);
    }
    catch (error) {
      console.error('Erro ao fazer a aposta:', error);
      setIsSpinning(false); // Para de girar a moeda em caso de erro
    }
  };

  const [selectedOption, setSelectedOption] = useState('cara'); // ou 'coroa'

  const selectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="ranking-container">
      <div className="anuncio-ranking">
        <iframe src={iframeSrc} id="adIframe" title="Ad"></iframe>
      </div>
      <div className="ranking cara-coroa">
        <h2>Cara ou Coroa</h2>
        <div className="cara-coroa-container">
          <div className="dados-cara-coroa">
            <p>Sua aposta</p>
            <div className="coin-options">
              <div 
                className={`coin-option ${selectedOption === 'cara' ? 'selected' : ''}`} 
                onClick={() => selectOption('cara')}
              >
                <div className="coin-selection cara"></div>
                {selectedOption === 'cara' && <div className="checkmark"></div>}
              </div>
              <div 
                className={`coin-option ${selectedOption === 'coroa' ? 'selected' : ''}`} 
                onClick={() => selectOption('coroa')}
              >
                <div className="coin-selection coroa"></div>
                {selectedOption === 'coroa' && <div className="checkmark"></div>}
              </div>
            </div>
            <div>
              <label>
                <input className="valor-aposta" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </label>
            </div>
            <button className="jogar-button" disabled={isSpinning} onClick={handleBet}>JOGAR</button>
          </div>
          <div className="resultado-cara-coroa">
            <div className="coin-container">
              <div className={`coin ${finalFace} ${isSpinning ? 'spinning' : ''}`}>
                <div className="side cara"></div>
                <div className="side coroa"></div>
              </div>
              {result && <p className="resultado-mensagem">
                {isSpinning ? 'Carregando...': result === 'Você ganhou!' ? 'ACERTOU!!' : 'Não foi dessa vez! :('}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetPage;