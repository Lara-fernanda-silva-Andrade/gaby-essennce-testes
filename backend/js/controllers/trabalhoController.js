const { conectar, desconectar } = require('../db');

async function listarTrabalhos() {
    const conexao = await conectar();
    const query = 'SELECT * FROM trabalhos ORDER BY id DESC';
    const [resultado] = await conexao.execute(query);
    await desconectar(conexao);
    return resultado;
}

async function buscarTrabalho(id) {
    const conexao = await conectar();
    const query = 'SELECT * FROM trabalhos WHERE id = ?';
    const [resultado] = await conexao.execute(query, [id]);
    await desconectar(conexao);
    return resultado[0] || null;
}

async function inserirTrabalho({ titulo, descricao, link, image }) {
    const conexao = await conectar();
    const query = 'INSERT INTO trabalhos (titulo, descricao, link, image) VALUES (?, ?, ?, ?)';
    const [resultado] = await conexao.execute(query, [titulo, descricao, link, image]);
    await desconectar(conexao);
    return { id: resultado.insertId, titulo, descricao, link, image };
}

async function atualizarTrabalho(id, trabalho) {
    const conexao = await conectar();
    const query = `
    UPDATE trabalhos
    SET
      titulo = ?,
      descricao = ?,
      link = ?,
      image = ?
    WHERE id = ?
  `;
    const parametros = [
        trabalho.titulo || null,
        trabalho.descricao || null,
        trabalho.link || null,
        trabalho.image || null,
        id
    ];

    try {
        const [resultado] = await conexao.execute(query, parametros);
        return resultado.affectedRows > 0; // true se atualizou
    } finally {
        await desconectar(conexao);
    }
}

module.exports = {
    listarTrabalhos,
    buscarTrabalho,
    inserirTrabalho,
    atualizarTrabalho,
    
};
