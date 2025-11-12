/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de nacionalidades no Banco de Dados MySQL
 * Data: 01/11/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retornar todos as nacionalidades
const getSelectAllNationality = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_nacionalidade order by nacionalidade_id desc`

        //Executar o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retornar nacionalidade filtrando pelo ID
const getSelectByIdNationality = async function (nacionalidade_id) {
    try {
        //Script SQL
        let sql = `select * from tbl_nacionalidade where nacionalidade_id = ${nacionalidade_id}`

        //Executar o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retornar o ID da última nacionalidade
const getSelectLastIdNationality = async function () {
    try {
        //Script SQL
        let sql = `select nacionalidade_id from tbl_nacionalidade order by nacionalidade_id desc limit 1`

        //Executa o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].nacionalidade_id)
        else
            return 0
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere um nacionalidade no BD
const setInsertNationality = async function (nacionalidade) {
    try {
        let sql = `insert into tbl_nacionalidade (nome, sigla)
        values(
            '${nacionalidade.nome}',
            '${nacionalidade.sigla}');`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza uma nacionalidade no banco filtrando por ID
const setUpdateNationality = async function (nacionalidade) {
    try {
        let sql = `update tbl_nacionalidade set
                         nome = '${nacionalidade.nome}',
                         sigla = '${nacionalidade.sigla}'
                    where nacionalidade_id = ${nacionalidade.id}`

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

//Apaga uma nacionalidade no banco de dados
const setDeleteNationality = async function (id) {
    try {
        let sql = `delete from tbl_nacionalidade where nacionalidade_id = ${id}`

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
    getSelectAllNationality,
    getSelectByIdNationality,
    getSelectLastIdNationality,
    setInsertNationality,
    setUpdateNationality,
    setDeleteNationality
}