const athenasClient = require('./athenas.client');

function mapUsuarios(raw) {
  return {
    id: raw.pk,
    matricula: raw.matricula,
    nome: raw.pessoa_fisica,
    tipo: raw.tipo,
    ativo: raw.ativo === 'Sim'
  };
}

async function listarUsuarios(username, search = '') {
  const response = await athenasClient.listarUsuarios(username, search);
  return response.result?.map(mapUsuarios) || [];
}

module.exports = {
  listarUsuarios  // ← apenas uma função
};