/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de personagens no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/

//Import do arquivo DAO para manipular o CRUD o BD
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retornar todos os personagens de filmes no banco de dados
const getSelectAllCharacter = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_personagem order by id desc`

        //Executar o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return error
    }
}

//Retornar personagem filtrando pelo ID
const getSelectByIdCharacter = async function (personagem_id) {
    try {
        //Script SQL
        let sql = `select * from tbl_personagem where id = ${personagem_id}`

        //Executar o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return error
    }
}

//Retornar o ID do último personagem
const getSelectLastIdCharacter = async function () {
    try {
        //Script SQL
        let sql = `select id from tbl_personagem order by id desc limit 1`

        //Executa o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return 0
    } catch (error) {
        console.log(error)
        return error
    }
}

//Insere um personagem no BD
const setInsertCharacter = async function (personagem) {
    try {
        
        let sql = `insert into tbl_personagem (
            nome, 
            genero,
            idade, 
            imagem
        ) values (
            '${personagem.nome}',
            '${personagem.genero}',
            '${personagem.idade}',
            '${personagem.imagem}'
        )`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um personagem
const setUpdateCharacter = async function (personagem) {
    try {
        let sql = `update tbl_personagem set
                         nome = '${personagem.nome}',
                         genero = '${personagem.genero}',
                         idade = '${personagem.idade}',
                         imagem = '${personagem.imagem}'
                    where id = ${personagem.id}`

        // $executeRawUnsafe() -> Permite apenas executar scripts SQL que não tem retorno de dados (INSER, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Apaga um personagem no banco de dados
const setDeleteCharacter = async function (id) {
    try {
        let sql = `delete from tbl_personagem where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//exports das funções
module.exports = {
    getSelectAllCharacter,
    getSelectByIdCharacter,
    getSelectLastIdCharacter,
    setInsertCharacter,
    setUpdateCharacter,
    setDeleteCharacter
}