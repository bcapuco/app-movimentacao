const usuariosService = require('../services/usuarios.services');

exports.listarUsuarios = async (req, res) => {
  try {
    const { search } = req.query;
    const { username } = req.user;

    const dados = await usuariosService.listarUsuarios(username, search);

    res.json(dados);
  } catch (error) {
    console.error('❌ Erro em usuarios.controller:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      response: error.response?.data 
    });
  }
};