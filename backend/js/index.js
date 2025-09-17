const { conectar, desconectar } = require("../db");

async function cadastrarUsuario(nome, email, senha) {

    const conexao = await conectar();
    let query = 'INSERT INTO jornais (nome, email, senha) VALUES (?,?,?)';
    let parametros = [nome, email, senha];
    await conexao.execute (query, parametros);
    await desconectar (conexao)
}

cadastrarUsuario('Jornal mais caro do Brasil em BH', 'Essa semana fomos graciados com a presença do famoso jornal impresso avaliado em 60 Milhões', "M. D'Castro", '9999-9999', '2025-08-05')
