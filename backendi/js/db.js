const mysql = require('mysql2/promise');

async function conectar() {
    const conexao = await mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '',
        database: 'gaby',
    });

    return conexao;
}

async function desconectar(conexao) {
    if (conexao) {
        await conexao.end();
    }
}

module.exports = { conectar, desconectar };
