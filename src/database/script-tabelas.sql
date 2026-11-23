DROP DATABASE IF EXISTS passport;
CREATE DATABASE passport;
USE passport;


CREATE TABLE tipo_viagem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL,
    descricao VARCHAR(120)
);


CREATE TABLE destino (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pais VARCHAR(45) NOT NULL,
    cidades VARCHAR(120),
    inicio_viagem DATE,          -- o README só tem mês e ano: dia 1 na ida...
    fim_viagem DATE,             -- ...e o último dia do mês na volta
    melhor_epoca VARCHAR(60),
    moeda CHAR(3),               -- código da moeda: sempre 3 letras (CLP, EUR, USD...)
    cotacao_real DECIMAL(12,6),  -- quanto vale 1 unidade da moeda, em reais
    cor_fundo CHAR(7),           -- skin: cor de fundo da página (#RRGGBB)
    cor_botao CHAR(7),           -- skin: cor dos botões e destaques
    fonte VARCHAR(30)            -- skin: fonte dos textos (o nome da @font-face em public/css/skins.css)
);


CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    email VARCHAR(50) UNIQUE,    -- UNIQUE: o banco recusa dois cadastros com o mesmo e-mail
    senha VARCHAR(50),
    fk_tipo_viagem INT,          -- tipo de viagem preferido
    fk_skin INT,                 -- skin escolhida (um destino). Vazio (NULL) = skin padrão
    FOREIGN KEY (fk_tipo_viagem) REFERENCES tipo_viagem(id),
    FOREIGN KEY (fk_skin) REFERENCES destino(id)
);


CREATE TABLE custo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_destino INT NOT NULL,
    fk_tipo_viagem INT NOT NULL,
    valor_voo DECIMAL(10,2),     -- ida e volta saindo de São Paulo
    valor_diaria DECIMAL(10,2),  -- hospedagem e gastos de um dia
    FOREIGN KEY (fk_destino) REFERENCES destino(id),
    FOREIGN KEY (fk_tipo_viagem) REFERENCES tipo_viagem(id),
    UNIQUE (fk_destino, fk_tipo_viagem)  -- um preço só para cada par destino + tipo
);


CREATE TABLE carimbo (
    fk_usuario INT,
    fk_destino INT,
    data_conquista DATETIME DEFAULT CURRENT_TIMESTAMP,  -- o banco preenche sozinho
    pontuacao INT,                                      -- milhas na hora do carimbo
    PRIMARY KEY (fk_usuario, fk_destino),  -- chave composta: um carimbo de cada destino por usuário
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    FOREIGN KEY (fk_destino) REFERENCES destino(id)
);



INSERT INTO tipo_viagem (nome, descricao) VALUES
    ('Aventura', 'Passeios, trilhas e experiências'),
    ('Low cost', 'O mais barato possível'),
    ('Exclusiva', 'Conforto e bons hotéis');


INSERT INTO destino (pais, cidades, inicio_viagem, fim_viagem, melhor_epoca, moeda, cotacao_real, cor_fundo, cor_botao, fonte) VALUES
    ('Chile',          'Atacama',                               '2016-11-01', '2017-02-28', 'Março a maio e setembro a novembro', 'CLP', 0.005800, '#2B1A12', '#E76F51', 'Jersey 20'),
    ('Argentina',      'Mendoza',                               '2023-12-01', '2024-01-31', 'Março e abril (vindima)',            'ARS', 0.005500, '#2A0C1B', '#74ACDF', 'Jersey 15'),
    ('Espanha',        'Madrid, Sevilha, Utrera, Cádiz, Ronda', '2024-06-01', '2024-07-31', 'Abril a junho e setembro a outubro', 'EUR', 6.200000, '#2A0A0A', '#F1BF00', 'Silkscreen'),
    ('Portugal',       'Lisboa, Algarve, Portimão',             '2024-07-01', '2024-07-31', 'Abril a outubro',                    'EUR', 6.200000, '#0A1F3D', '#6FB1E8', 'Jersey 10'),
    ('Gibraltar',      'Gibraltar',                             '2024-07-01', '2024-08-31', 'Maio a setembro',                    'GBP', 7.200000, '#1C1F26', '#F25C5C', 'Handjet'),
    ('Moçambique',     'Maputo, Ponta do Ouro',                 '2024-08-01', '2024-10-31', 'Maio a novembro',                    'MZN', 0.085000, '#06282B', '#1CC5B7', 'Pixelify Sans'),
    ('Estados Unidos', 'Orlando',                               '2026-09-01', '2026-09-30', 'Março a maio e setembro a novembro', 'USD', 5.400000, '#120B3A', '#FF7AB6', 'Jersey 25');


INSERT INTO custo (fk_destino, fk_tipo_viagem, valor_voo, valor_diaria) VALUES
    (1, 1,  2600.00,  520.00), (1, 2,  1900.00,  230.00), (1, 3,  6800.00, 1600.00),
    (2, 1,  2100.00,  380.00), (2, 2,  1400.00,  170.00), (2, 3,  5200.00, 1100.00),
    (3, 1,  5200.00,  560.00), (3, 2,  3900.00,  290.00), (3, 3, 14500.00, 1900.00),
    (4, 1,  4900.00,  520.00), (4, 2,  3600.00,  270.00), (4, 3, 13800.00, 1800.00),
    (5, 1,  5600.00,  690.00), (5, 2,  4300.00,  380.00), (5, 3, 15200.00, 2300.00),
    (6, 1,  7300.00,  480.00), (6, 2,  5800.00,  240.00), (6, 3, 18900.00, 1700.00),
    (7, 1,  4700.00,  760.00), (7, 2,  3400.00,  390.00), (7, 3, 12900.00, 2500.00);


SELECT
    (SELECT COUNT(*) FROM tipo_viagem) AS tipos,
    (SELECT COUNT(*) FROM destino)     AS destinos,
    (SELECT COUNT(*) FROM custo)       AS custos,
    (SELECT COUNT(*) FROM usuario)     AS usuarios,
    (SELECT COUNT(*) FROM carimbo)     AS carimbos;
