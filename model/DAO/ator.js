/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de atores no Banco de Dados MySQL
 * Data: 12/11/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os atores do banco de dados
const getSelectAllActor = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_ator order by ator_id desc`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return 0
    } catch (error) {
        return false
    }
}

//Retorna um ator filtrando pelo ID no banco de dados
const getSelectByIdActor = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_ator where ator_id=${id}`

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

const getSelectLastIdActor = async function () {
    try {
        //Script SQL
        let sql = `select ator_id from tbl_ator order by ator_id desc limit 1`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].ator_id)
        else
            return false
    } catch (error) {
        return false
    }
}

//Insere um ator no BD
const setInsertActor = async function (ator) {
    try {
        if (ator.data_falecimento == null) {
            let sql = `insert into tbl_ator (
            nome,
            data_nascimento,
            data_falecimento,
            genero, 
            foto
            )
            values('${ator.nome}',
            '${ator.data_nascimento}',
            ${ator.data_falecimento}, 
            '${ator.genero}',
            '${ator.foto}')`

            let result = await prisma.$executeRawUnsafe(sql)
            if (result)
                return true
            else
                return false
        } else {
            let sql = `insert into tbl_ator (
            nome,
            data_nascimento,
            data_falecimento,
            genero,
            foto)
            values('${ator.nome}',
            '${ator.data_nascimento}',
            '${ator.data_falecimento}',
            '${ator.genero}',
            '${ator.foto}')`
            
            let result = await prisma.$executeRawUnsafe(sql)

            if (result)
                return true
            else
                return false
        }

    } catch (error) {
        return false
    }
}

//Atualiza um ator
const setUpdateActor = async function (ator) {
    try {
        let sql = `update tbl_ator set
                         nome = '${ator.nome}',
                         data_nascimento = '${ator.data_nascimento}',
                         data_falecimento = null,
                         genero = '${ator.genero}',
                         foto = '${ator.foto}'
                    where ator_id = ${ator.id}`

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

//Apaga um diretor no banco de dados
const setDeleteActor = async function (id) {
    try {
        let sql = `delete from tbl_ator where ator_id = ${id}`

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
    getSelectAllActor,
    getSelectByIdActor,
    getSelectLastIdActor,
    setInsertActor,
    setUpdateActor,
    setDeleteActor
}