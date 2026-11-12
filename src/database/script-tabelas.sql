-- Arquivo de apoio: cria o banco do Passport.
-- Você precisa executar os comandos no MySQL (na VM) para criar as tabelas.
-- Ter este arquivo aqui não significa que a tabela no seu banco está como abaixo!

CREATE DATABASE passport;

USE passport;

-- Usuário do site: é a tabela que o cadastro e o login usam.
-- (src/models/usuarioModel.js)
CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50),
	senha VARCHAR(50)
);

-- As outras tabelas do modelo do README (tipo_viagem, destino, custo e carimbo)
-- entram junto com a Dashboard, a Calculadora e os carimbos do jogo.
