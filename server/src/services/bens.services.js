const athenasClient = require('./athenas.client');

function mapBens(raw) {
  return {
    id: raw.pk,
    numero_patrimonio: raw.plaqueta, 
    qrcode: raw.plaqueta_qrcode,
    especie: raw.especie_unicode
  };
}

// Padronizar: usar apenas listarBens (com search opcional)
async function listarBens(username, search = '') {
  const response = await athenasClient.listarBens(username, search);
  return response.collection.map(mapBens);
}

module.exports = {
  listarBens  // ← apenas uma função (remover buscarBens duplicada)
};


