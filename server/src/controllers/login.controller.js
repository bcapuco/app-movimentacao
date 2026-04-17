const loginService = require('../services/login.services');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Usuário e senha são obrigatórios."
      });
    }

    const token = await loginService.authenticate(username, password);

    return res.status(200).json({ token });

  } catch (error) {
    console.error('❌ Erro em login.controller:', error.message);
    return res.status(401).json({
      error: error.message
    });
  }
}

module.exports = { login };