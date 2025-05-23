
-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

create database projeto_individual;
use projeto_individual;

CREATE TABLE organizadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    documento VARCHAR(20),
    telefone VARCHAR(20)
);

-- Tabela de eventos
CREATE TABLE eventos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organizador_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    local varchar(100) not null,
    meta_receita DECIMAL(10,2),
    meta_lucro DECIMAL(10,2),
    FOREIGN KEY (organizador_id) REFERENCES organizadores(id)
);

-- Tabela de gastos
CREATE TABLE gastos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT NOT NULL,
    nome VARCHAR(100),
    valor DECIMAL(10,2) NOT NULL,
    quantidade INT,
    total DECIMAL(10,2),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- Tabela de receitas
CREATE TABLE receitas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT NOT NULL,
    fonte VARCHAR(100),
    valor DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- Tabela de ingressos
CREATE TABLE ingressos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade_disponivel INT NOT NULL,
    vendido INT DEFAULT 0,
    meta int,
    quantidade int,
    total decimal(10,2),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- Tabela de produtos adicionais vendidos
CREATE TABLE produtos_adicionais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT NOT NULL,
    nome VARCHAR(100),
    preco_unitario DECIMAL(10,2),
    vendido INT,
    meta int,
    quantidade int,
    total decimal(10,2),
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
);
