const express = require('express');
const cors = require('cors');

// Importar dados do arquivo JSON
const aircraftData = require('./src/data/aircrafts.json');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota para todas as aeronaves
app.get('/api/aeronaves', (req, res) => {
  console.log('📦 Enviando dados de', Object.keys(aircraftData).length, 'aeronaves');
  res.json(aircraftData);
});

// Rota para aeronave específica
app.get('/api/aeronaves/:id', (req, res) => {
  const aircraftId = req.params.id;
  const aircraft = aircraftData[aircraftId];
  
  if (aircraft) {
    res.json(aircraft);
  } else {
    res.status(404).json({ error: 'Aeronave não encontrada' });
  }
});

// Rota de saúde do servidor
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando!',
    totalAeronaves: Object.keys(aircraftData).length,
    timestamp: new Date().toISOString()
  });
});

// Rota principal - ESTA É A ROTA QUE ESTÁ FALTANDO!
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API do Calendário de Aeronaves',
    version: '1.0.0',
    endpoints: {
      todasAeronaves: '/api/aeronaves',
      aeronaveEspecifica: '/api/aeronaves/:id',
      healthCheck: '/health'
    }
  });
});

// Iniciar servidor
const PORT = 3002;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SERVIDOR INICIADO COM SUCESSO!');
  console.log('='.repeat(50));
  console.log('📡 URL: http://localhost:' + PORT);
  console.log('📊 Aeronaves carregadas:', Object.keys(aircraftData).length);
  console.log('🔍 Rotas disponíveis:');
  console.log('   ✅ GET  /                 - Info da API');
  console.log('   ✅ GET  /api/aeronaves    - Todas aeronaves');
  console.log('   ✅ GET  /api/aeronaves/:id - Aeronave específica');
  console.log('   ✅ GET  /health           - Status do servidor');
  console.log('='.repeat(50));
});