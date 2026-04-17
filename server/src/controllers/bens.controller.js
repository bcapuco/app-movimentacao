const bensService = require('../services/bens.services');

exports.listarBens = async (req, res) => {
  try {
    const { search } = req.query;
    const { username } = req.user;

    const dados = await bensService.listarBens(username, search);

    res.json(dados);
  } catch (error) {
    console.error('❌ Erro em bens.controller:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      response: error.response?.data 
    });
  }
};