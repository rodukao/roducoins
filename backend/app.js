const express = require('express');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const app = express();
const PORT = 3000;

app.use(express.json()); // Para entender JSON no corpo das requisições
app.use('/api', authRoutes);
app.use('/api/game', gameRoutes);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/roducoinApp', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Olá, mundo!');
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});