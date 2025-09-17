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

async function setupDatabase() {
    const conexao = await conectar();

    let query = `
        CREATE Table if not exists trabalhos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            descricao TEXT,
            link VARCHAR(255),
            image VARCHAR(255)
        )
    `;
    await conexao.execute(query);

    query = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(100) NOT NULL,
            tipo INT DEFAULT 0,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=INNODB
    `;
    await conexao.execute(query);
    
    query = `
        CREATE TABLE IF NOT EXISTS pedidos_arte (
            id INT PRIMARY KEY AUTO_INCREMENT,
            id_usuario INT NOT NULL,
            titulo VARCHAR(100) NOT NULL,
            descricao TEXT NOT NULL,
            referencia VARCHAR(255),
            status ENUM(
                'pendente',
                'em andamento',
                'concluído',
                'cancelado'
            ) DEFAULT 'pendente',
            data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
            data_conclusao DATETIME DEFAULT NULL,
            data_cancelamento DATETIME DEFAULT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )
    `;
    await conexao.execute(query);
    
    query = `
        CREATE TABLE IF NOT EXISTS mensagens_pedidos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_pedido INT NOT NULL,
            id_usuario INT NOT NULL,
            mensagem TEXT NOT NULL,
            data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_pedido) REFERENCES pedidos_arte(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )
    `;
    await conexao.execute(query);
    
    await desconectar(conexao);
}

module.exports = { cadastrarUsuario, loginUsuario, setupDatabase };
