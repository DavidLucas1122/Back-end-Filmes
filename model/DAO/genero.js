/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de gêneros de filmes no Banco de Dados MySQL
 * Data: 22/10/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/

//Import da biblioteca do PrismaClient
// const { PrismaClient } = require('@prisma/client')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retornar todos os gêneros de filmes no banco de dados
const getSelectAllGenre = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_genero order by genero_id desc`

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

//Retornar gênero filtrando pelo ID
const getSelectByIdGenre = async function (genero_id) {
    try {
        //Script SQL
        let sql = `select * from tbl_genero where genero_id = ${genero_id}`

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

//Retornar o ID do último gênero
const getSelectLastIdGenre = async function () {
    try {
        //Script SQL
        let sql = `select genero_id from tbl_genero order by genero_id desc limit 1`

        //Executa o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].genero_id)
        else
            return 0
    } catch (error) {
        console.log(error)
        return error
    }
}

//Insere um gênero no BD
const setInsertGenre = async function (genero) {
    try {
        let sql = `insert into tbl_genero (nome)
        values(
            '${genero.nome}');`

    let result = await prisma.$executeRawUnsafe(sql)

    if (result)
        return true
    else
        return false
    } catch (error){
        return false
    }
}

const setUpdateGenre = async function (genero) {
    try {
        let sql = `update tbl_genero set
                         nome = '${genero.nome}'
                    where id = ${genero.id}`

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


//Exports de funções
module.exports = {
    getSelectAllGenre,
    getSelectByIdGenre,
    getSelectLastIdGenre,
    setInsertGenre,
    setUpdateGenre
}