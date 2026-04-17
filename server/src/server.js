require('dotenv').config(); 
const express = require('express');
const app = express();


// 1. MIDDLEWARES GLOBAIS
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 2. ROTAS
const bensRoutes = require('./routes/bens.routes');
const locaisRoutes = require('./routes/locais.routes');
const loginRoutes = require('./routes/login.routes');
const movimentacaoRoutes = require('./routes/movimentacao.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

// 3. USO DAS ROTAS
app.use('/bens', bensRoutes);
app.use('/locais', locaisRoutes);
app.use('/login', loginRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
app.use('/usuarios', usuariosRoutes);

// 4. ROTA DE TESTE/HEALTH CHECK (opcional)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 5. TRATAMENTO DE ERRO 404 (CORRIGIDO - sem o '*')
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// 6. TRATAMENTO DE ERROS GLOBAL
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err.message);
  res.status(500).json({ 
    error: 'Erro interno no servidor',
    message: err.message 
  });
});

// 7. INICIALIZAÇÃO
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log('🚀 Servidor iniciado com sucesso!');
  console.log('=================================');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Rede: http://192.168.1.105:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/health`);
  console.log('=================================');
  console.log('📌 Rotas disponíveis:');
  console.log(`   POST  /login         → Autenticação`);
  console.log(`   GET   /bens          → Listar bens`);
  console.log(`   GET   /locais        → Listar locais`);
  console.log(`   GET   /movimentacoes → Listar movimentações`);
  console.log(`   POST  /movimentacoes → Criar movimentação`);
  console.log(`   GET   /usuarios      → Listar usuários`);
  console.log('=================================');
});