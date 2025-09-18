const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/img')); // Salva na pasta frontend/img
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Define um nome único para a imagem
    }
});

const upload = multer({ storage: storage });

// -------------------- Controllers --------------------
const {
    listarTrabalhos,
    buscarTrabalho,
    inserirTrabalho,
    atualizarTrabalho,
    deletarTrabalho
} = require('./controllers/trabalhoController');

const {
    cadastrarUsuario,
    loginUsuario,
    setupDatabase
} = require('./controllers/usuarioController'); // controller sem bcrypt


setupDatabase()

// -------------------- Logs --------------------
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url);
    next();
});

// -------------------- Rotas Gerais --------------------
app.get("/", (req, res) => {
    res.send("Running...");
});

// -------------------- Rotas Trabalhos --------------------
app.get("/trabalhos", async (req, res) => {
    try {
        const trabalhos = await listarTrabalhos();
        res.json(trabalhos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: err.message });
    }
});

app.get("/trabalho/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const trabalho = await buscarTrabalho(id);
        if (trabalho) {
            res.json(trabalho);
        } else {
            res.status(404).json({ mensagem: "Trabalho não encontrado!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: err.message });
    }
});

// Modificação do endpoint POST /trabalhos para aceitar o upload de imagem
app.post("/trabalhos", upload.single('image'), async (req, res) => {
    try {
        const { titulo, descricao, link } = req.body;
        if (!titulo || !descricao || !link) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
        }

        // Verifica se a imagem foi enviada, se sim, pega o caminho dela, senão usa o link
        const imagePath = req.file ? '/img/' + req.file.filename : link;

        // Inserção do trabalho no banco de dados com o caminho da imagem
        const novoTrabalho = await inserirTrabalho({
            titulo,
            descricao,
            link,
            image: imagePath // Salva o caminho da imagem no banco
        });

        res.status(201).json(novoTrabalho);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: err.message });
    }
});

// Endpoint PUT /trabalho/:id para editar o trabalho (também permite editar imagem)
app.put("/trabalho/:id", upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, link } = req.body;

        const imagePath = req.file ? '/img/' + req.file.filename : req.body.image; // Usar a imagem enviada ou a já existente

        const atualizado = await atualizarTrabalho(id, { titulo, descricao, link, image: imagePath });
        
        if (atualizado) {
            return res.json({ mensagem: "Trabalho atualizado com sucesso!" });
        } else {
            return res.status(404).json({ mensagem: "Trabalho não encontrado!" });
        }
    } catch (err) {
        console.error("Erro no PUT /trabalho/:id ->", err);
        res.status(500).json({ mensagem: err.message });
    }
});

app.delete("/trabalho/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await deletarTrabalho(id);
        if (deletado) {
            return res.json({ mensagem: "Trabalho deletado com sucesso!" });
        } else {
            return res.status(404).json({ mensagem: "Trabalho não encontrado!" });
        }
    } catch (err) {
        console.error("Erro no DELETE /trabalho/:id ->", err);
        res.status(500).json({ mensagem: err.message });
    }
});

// -------------------- Middleware de exemplo --------------------
function verificarAdmin(req, res, next) {
    const { tipo } = req.body; // ou req.user se usar JWT
    if (tipo !== 1) {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
}

// -------------------- Rotas Usuários --------------------

// Logout de usuário
app.post("/logout", (req, res) => {
    // Como estamos usando localStorage no frontend, o logout é basicamente limpar o localStorage lá
    // Aqui no backend, podemos apenas confirmar
    res.status(200).json({ message: 'Logout realizado com sucesso!' });
});

// Cadastro de usuário (sem bcrypt)
app.post("/register", async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // tipo padrão 0 se não enviado
        const usuario = await cadastrarUsuario({ 
            nome, 
            email, 
            senha, 
            tipo: tipo ?? 0 
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
    } catch (err) {
        console.error('Erro na rota /register:', err.message);

        if (err.message === 'Email já cadastrado.') {
            return res.status(409).json({ error: err.message });
        }

        res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
    }
});

// Login de usuário (sem bcrypt)
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const usuario = await loginUsuario({ email, senha });

        // retorna tipo junto com os dados do usuário
        res.status(200).json({ 
            message: 'Login realizado com sucesso!', 
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });
    } catch (err) {
        console.error('Erro na rota /login:', err.message);
        res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
});

// -------------------- Inicialização do Servidor --------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
