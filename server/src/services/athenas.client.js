require('dotenv').config();
const qs = require('qs');
const sessionService = require('./session.services');

/* =========================
   MOVIMENTAÇÕES
========================= */
async function listarMovimentacoes(username, search = '') {
  const client = await sessionService.getClient(username);
  
  const response = await client.get('/PATMovimento/v1/', {
    params: { keyword: search }
  });
  
  return response.data;
}

const { URLSearchParams } = require('url'); // Garante que você está usando o nativo

async function criarMovimento(username, payload) {
  const client = await sessionService.getClient(username);

  // Transforma seu objeto {origem: 1, destino: 2, ...} em "origem=1&destino=2"
  const params = new URLSearchParams();
  for (const key in payload) {
    params.append(key, payload[key]);
  }

  try {
    const response = await client.post(
      '/PATMovimento/v1/',
      params.toString(), // AQUI: string pura sem formatação extra
      { 
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        } 
      }
    );
    return response.data;
  } catch (error) {
    // Se ainda der 500, vamos ver o log do servidor
    console.error('❌ ERRO DETALHADO:', error.response?.data);
    throw error;
  }
}

async function adicionarItemMovimento(username, movimentoId, patrimonioId) {
  const client = await sessionService.getClient(username);

  const response = await client.post(
    '/PATMovimentoItem/v1/',
    qs.stringify({
      movimento: movimentoId,
      patrimonio: patrimonioId
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return response.data;
}

/* =========================
   USUÁRIOS
========================= */
async function listarUsuarios(username, search = '') {
  const client = await sessionService.getClient(username);

  const response = await client.post(
    '/RHServidor/query/',
    qs.stringify({ search }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return response.data;
}

/* =========================
   LOCALIZAÇÕES
========================= */
async function listarLocalizacoes(username, search = '') {
  const client = await sessionService.getClient(username);

  const response = await client.get('/PATLocalizacao/v1/', {
    params: { search }
  });

  return response.data;
}

/* =========================
   PATRIMÔNIOS (BENS)
========================= */
/* =========================
   PATRIMÔNIOS (BENS)
========================= */
async function listarBens(username, search = '') {
  console.log('\n📋 listarBens chamado para:', username, 'search:', search);
  
  try {
    const client = await sessionService.getClient(username);
    
    // FILTER OBRIGATÓRIO (pode ser vazio)
    const filter = JSON.stringify([]);
    
    console.log('📦 Parâmetros da requisição:');
    console.log('   URL:', '/PATPatrimonio/v1/');
    console.log('   keyword:', search);
    console.log('   filter:', filter);

    const response = await client.get('/PATPatrimonio/v1/', {
      params: {
        keyword: search,
        filter: filter  // ← ISSO É OBRIGATÓRIO!
      }
    });
    
    console.log('✅ Resposta recebida. Status:', response.status);
    console.log('📦 Quantidade de itens:', response.data?.collection?.length || 0);
    
    return response.data;
    
  } catch (error) {
    console.error('\n❌ Erro na requisição listarBens:');
    console.error('Mensagem:', error.message);
    throw error;
  }
}

/* =========================
   EXPORTS PADRONIZADOS
========================= */
module.exports = {
  // Movimentações
  listarMovimentacoes,
  criarMovimento,
  adicionarItemMovimento,
  
  // Usuários
  listarUsuarios,
  
  // Localizações
  listarLocalizacoes,
  
  // Bens
  listarBens
};