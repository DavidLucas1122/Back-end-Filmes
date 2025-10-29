/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de gêneros de filmes no Banco de Dados MySQL
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
            return Number(result[0].personagem_id)
        else
            return 0
    } catch (error) {
        console.log(error)
        return error
    }
}