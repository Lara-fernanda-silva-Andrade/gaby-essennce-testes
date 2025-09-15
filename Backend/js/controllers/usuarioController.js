const { conectar, desconectar } = require('../db');

// Função para cadastrar usuário
async function cadastrarUsuario({ nome, email, senha, tipo }) {
    const conexao = await conectar();

    try {
        // Verifica se o email já existe
        const [rows] = await conexao.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            throw new Error('Email já cadastrado.');
        }

        // Insere usuário (senha em texto puro), tipo padrão 0 se não enviado
        const sql = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
        const [resultado] = await conexao.execute(sql, [nome, email, senha, tipo ?? 0]);

        return { id: resultado.insertId, nome, email, tipo: tipo ?? 0 };
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err.message);
        throw err;
    } finally {
        await desconectar(conexao);
    }
}

// Função para logar usuário
async function loginUsuario({ email, senha }) {
    const conexao = await conectar();

    try {
        // Busca usuário pelo email
        const [rows] = await conexao.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            throw new Error('Email ou senha incorretos.');
        }

        const usuario = rows[0];

        // Compara senha em texto puro
        if (usuario.senha !== senha) {
            throw new Error('Email ou senha incorretos.');
        }

        // Retorna dados sem a senha, incluindo tipo
        return { 
            id: usuario.id, 
            nome: usuario.nome, 
            email: usuario.email,
            tipo: usuario.tipo 
        };
    } catch (err) {
        console.error('Erro no login do usuário:', err.message);
        throw err;
    } finally {
        await desconectar(conexao);
    }
}

module.exports = { cadastrarUsuario, loginUsuario };
