const locaisService = require('../services/locais.services');

exports.listarLocais = async (req, res) => {
  try {
    const { search } = req.query;
    const { username } = req.user;  // ← Padronizado: req.user.username

    const dados = await locaisService.listarLocais(username, search);

    res.json(dados);
  } catch (error) {
    console.error('❌ Erro em locais.controller:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      response: error.response?.data 
    });
  }
};