/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de classificações no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/

//Import da biblioteca do PrismaClient
// const { PrismaClient } = require('@prisma/client')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos as classificações do banco de dados
const getSelectAllRatings = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_classificacao order by classificacao_id desc`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Retorna uma classificacao filtrando pelo ID no banco de dados
const getSelectByIdRating = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_classificacao where classificacao_id=${id}`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retornar o ID da última classificação
const getSelectLastIdRating = async function () {
    try {
        //Script SQL
        let sql = `select classificacao_id from tbl_classificacao order by classificacao_id desc limit 1`

        //Executa o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)){
            return Number(result[0].classificacao_id)
        }
        else
            return false
    } catch (error) {
        return error
    }
}

//Insere uma classificacao no BD
const setInsertRating = async function (classificacao) {
    try {
        let sql = `insert into tbl_classificacao (nome)
        values(
            '${classificacao.nome}');`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza uma classificação no banco filtrando ID
const setUpdateRating = async function (classificacao) {
    try {
        let sql = `update tbl_classificacao set
                         nome = '${classificacao.nome}'
                    where classificacao_id = ${classificacao.id}`

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

//Deleta uma classificação
const setDeleteRating = async function (id) {
    try {
        let sql = `delete from tbl_classificacao where classificacao_id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}



module.exports = {
    getSelectAllRatings,
    getSelectByIdRating,
    getSelectLastIdRating,
    setInsertRating,
    setUpdateRating,
    setDeleteRating
}