const express = require('express');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const app = express();
const PORT = 3001;
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Use o CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',  // substitua pelo seu domínio
  credentials: true
}));

app.use(cookieParser());

app.use(express.json()); // Para entender JSON no corpo das requisições
app.use('/api', authRoutes);
app.use('/api/game', gameRoutes);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/roducoinApp', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});