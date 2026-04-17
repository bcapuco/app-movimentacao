const jwt = require('jsonwebtoken');
const sessionService = require('./session.services');

async function authenticate(username, senha) {

  const autenticado = await sessionService.loginAthenas(username, senha);

  if (!autenticado) {
    throw new Error('Credenciais inválidas no Athenas.');
  }

  // 🔑 JWT DA SUA API
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    username,
    token
  };
}

module.exports = { authenticate };