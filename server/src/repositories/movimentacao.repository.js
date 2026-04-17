// src/repositories/movimentacao.repository.js
const dados = [];

exports.salvar = (mov) => {
  dados.push(mov);
  return mov;
};

exports.listar = () => {
  return dados;
};

