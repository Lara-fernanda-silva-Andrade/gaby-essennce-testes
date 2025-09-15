-- SQLBook: Code
CREATE DATABASE IF NOT EXISTS gaby;

USE gaby;

CREATE Table if not exists trabalhos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    link VARCHAR(255),
    image VARCHAR(255)
);

INSERT INTO trabalhos (titulo, descricao, link, image)
VALUES
(
  "Desenvolvimento de Sites",
  "Criação de sites responsivos e otimizados para SEO, utilizando as melhores práticas de desenvolvimento web.",
  "https://exemplo.com/desenvolvimento-sites",
  "https://exemplo.com/img/desenvolvimento-sites.jpg"
),
(
  "Manutenção de Computadores",
  "Serviço de manutenção preventiva e corretiva para desktops e notebooks, garantindo desempenho e segurança.",
  "https://exemplo.com/manutencao-computadores",
  "https://exemplo.com/img/manutencao-computadores.jpg"
),
(
  "Consultoria em Marketing Digital",
  "Análise de presença online e estratégias para aumentar vendas, engajamento e visibilidade da marca.",
  "https://exemplo.com/marketing-digital",
  "https://exemplo.com/img/marketing-digital.jpg"
),
(
  "Fotografia Profissional",
  "Sessões fotográficas para produtos, eventos ou portfólios, com edição profissional de imagens.",
  "https://exemplo.com/fotografia-profissional",
  "https://exemplo.com/img/fotografia-profissional.jpg"
),
(
  "Design Gráfico",
  "Criação de identidades visuais, logotipos, banners e materiais gráficos personalizados.",
  "https://exemplo.com/design-grafico",
  "https://exemplo.com/img/design-grafico.jpg"
);

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'artista')
);
 
CREATE TABLE pedidos_arte (
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
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);
CREATE TABLE mensagens_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_usuario INT NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos_arte(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS usuarios;

ALTER TABLE usuarios 
MODIFY COLUMN tipo INT DEFAULT 0;