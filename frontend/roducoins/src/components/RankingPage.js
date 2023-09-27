import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate();

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
  }, []);

  return (
    <div>
      <h2>Ranking dos Jogadores</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Moedas</th>
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
      <button onClick={() => navigate('/home')}>Voltar</button>
    </div>
    
  );
};

export default RankingPage;