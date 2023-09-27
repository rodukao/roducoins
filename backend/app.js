const express = require('express');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Use o CORS middleware
app.use(cors({
  origin: 'https://651426f78d9e3b1b3f583f81--roducoins.netlify.app',  // substitua pelo seu domínio
  credentials: true
}));

app.use(cookieParser());

app.use(express.json()); // Para entender JSON no corpo das requisições
app.use('/api', authRoutes);
app.use('/api/game', gameRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Teste bem-sucedido!' });
});

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});