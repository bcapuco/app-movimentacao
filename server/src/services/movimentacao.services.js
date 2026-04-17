const athenasClient = require('./athenas.client');

function mapMovimentacoes(raw) {
  return {
    id: raw.pk,
    identificacao: raw.indentificacao,
    origem: raw.origem_unicode,
    destino: raw.destino_unicode,
    movimentado_por: raw.movimentado_por_unicode,
    responsavel_destino: raw.responsavel_destino_unicode,
    data: raw.data,
    observacao: raw.observacao
  };
}

async function listarMovimentacoes(username, search = '') {
  try {
    const response = await athenasClient.listarMovimentacoes(username, search);
    return response.collection?.map(mapMovimentacoes) || [];
  } catch (error) {
    throw new Error("Erro ao listar movimentações: " + error.message);
  }
}

async function criarMovimentacao(username, dados) {
  try {
    if (!dados.itens || dados.itens.length === 0) {
      throw new Error("Selecione ao menos um bem");
    }

    // AQUI: Vamos logar o que estamos enviando
    console.log("📤 Criando movimento no Athenas com dados:", {
        origem: dados.origem,
        destino: dados.destino,
        responsavel_destino: dados.responsavel_destino
    });

    const movimento = await athenasClient.criarMovimento(username, {
      origem: dados.origem,
      destino: dados.destino,
      responsavel_destino: dados.responsavel_destino
    });

    // AQUI: Captura erro vindo do Athenas
    if (movimento && movimento.success === false) {
      throw new Error(movimento.message || 'Erro ao criar movimentação no Athenas');
    }
    
    // Se o movimento for undefined ou não tiver pk, algo deu muito errado
    if (!movimento || !movimento.instance || !movimento.instance.pk) {
        throw new Error('Resposta inválida do Athenas: ' + JSON.stringify(movimento));
    }

    const movimentoId = movimento.instance.pk;
    // ... restante igual

    for (const item of dados.itens) {
      const resItem = await athenasClient.adicionarItemMovimento(
        username, 
        movimentoId, 
        item
      );
      if (!resItem.success) {
        throw new Error('Erro ao adicionar item ' + item);
      }
    }

    return movimento;
  } catch (error) {
    throw new Error("Erro ao criar movimentação: " + error.message);
  }
}

function mapBens(raw) {
  return {
    id: raw.pk,
    numero_patrimonio: raw.identificacao, // Mapeia para o que a Screen usa
    descricao: raw.descricao,
    situacao: raw.situacao_unicode
  };
}

async function listarBens(username, search = '') {
  try {
    const response = await athenasClient.listarBens(username, search);
    // O Athenas retorna os dados dentro de 'collection'
    return (response.collection || []).map(mapBens);
  } catch (error) {
    throw new Error("Erro ao listar bens: " + error.message);
  }
}

module.exports = {
  listarMovimentacoes,
  criarMovimentacao,
  listarBens
  // adicionarItem será chamado internamente pelo criarMovimentacao
};