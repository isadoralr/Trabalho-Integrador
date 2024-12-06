const bcrypt = require("bcrypt");
const pgp = require("pg-promise")({});
const db = require("../server");

async function criarUsuarios() {
    const saltRounds = 10;

    const usuarios = [
        {
            email: "prestador@email.com",
            nome: "Prestador de Serviços",
            senha: "prestadoradmin123",
            cpf: "123.456.789-00",
            admin: true,
        },
        {
            email: "funcionario@email.com",
            nome: "Funcionario",
            senha: "funcionario123",
            cpf: "987.654.321-00",
            admin: false,
        },
    ];

    for (const usuario of usuarios) {
        usuario.senha = await bcrypt.hash(usuario.senha, saltRounds);
        console.log(`Usuário: ${usuario.email}, Hash da Senha: ${usuario.senha}`);
    }

    return usuarios;
}

async function inserirUsuarios() {
    const usuarios = await criarUsuarios();

    for (const usuario of usuarios) {
        try {
            await db.none(
                "INSERT INTO usuario (email, nome, senha, cpf, admin) VALUES ($1, $2, $3, $4, $5)",
                [usuario.email, usuario.nome, usuario.senha, usuario.cpf, usuario.admin]
            );
            console.log(`Usuário ${usuario.email} inserido com sucesso!`);
        } catch (error) {
            console.error(`Erro ao inserir o usuário ${usuario.email}:`, error.message);
        }
    }
}

inserirUsuarios();
