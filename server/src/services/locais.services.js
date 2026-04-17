const athenasClient = require('./athenas.client');

function mapLocais(raw) {
  return {
    id: raw.pk,
    local: raw.titulo
  };
}

// Padronizado: recebe username e search
async function listarLocais(username, search = '') {
  const response = await athenasClient.listarLocalizacoes(username, search);
  return response.collection?.map(mapLocais) || [];
}

module.exports = {
  listarLocais  // ← apenas uma função
};
