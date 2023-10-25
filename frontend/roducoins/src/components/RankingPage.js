import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const RankingPage = () => {
  const [iframeSrc, setIframeSrc] = useState('about:blank'); // Estado inicial
  const [ranking, setRanking] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await axios.get('https://roducoins.onrender.com/api/topUsers');
        setRanking(res.data);
      } catch (error) {
        console.error('Erro ao buscar o ranking:', error);
      }
    };

      fetchRanking();
      setIframeSrc('ad.html');

      return () => {
      };

    }, [location]);

  return (
    <div className="ranking-container">
      <div className="anuncio-ranking">
        <iframe src={iframeSrc} id="adIframe" title="Ad"></iframe>
      </div>
      <div className="ranking">
        <h2>Ranking dos Jogadores</h2>
        <table className="tabela-jogadores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Roducoins</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.coins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingPage;