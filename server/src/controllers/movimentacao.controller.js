const movimentacaoService = require('../services/movimentacao.services');

exports.listarMovimentacoes = async (req, res) => {
  try {
    const { username } = req.user;
    
    const dados = await movimentacaoService.listarMovimentacoes(username);
    
    res.json(dados);
  } catch (error) {
    console.error('❌ Erro em movimentacao.controller:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      response: error.response?.data,
      requerLogin: error.response?.status === 401 
    });
  }
};

exports.criarMovimentacao = async (req, res) => {
  console.log("📥 DADOS RECEBIDOS NO BODY:", req.body);
  try {
    const { username } = req.user;
    
    const resultado = await movimentacaoService.criarMovimentacao(username, req.body);
    
    res.status(201).json(resultado);
  } catch (error) {
    console.error('❌ Erro em movimentacao.controller:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      response: error.response?.data 
    });
  }
};

exports.adicionarItem = async (req, res) => {
  try {
    const { username } = req.user;
    const { movimentoId, patrimonioId } = req.body;
    
    const resultado = await movimentacaoService.adicionarItemMovimento(
      username, 
      movimentoId, 
      patrimonioId
    );
    
    res.json(resultado);
  } catch (error) {
    console.error('❌ Erro em movimentacao.controller:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      response: error.response?.data 
    });
  }
};