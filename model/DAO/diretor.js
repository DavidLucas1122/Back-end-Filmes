/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de diretores no Banco de Dados MySQL
 * Data: 04/11/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os diretores do banco de dados
const getSelectAllDirector = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_diretor order by diretor_id desc`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return 0
    } catch (error) {
        console.log(error)
        return 2
    }
}

//Retorna um diretor filtrando pelo ID no banco de dados
const getSelectByIdDirector = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_diretor where diretor_id=${id}`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        // console.log(error)
        return false
    }
}

const getSelectLastIdDirector = async function () {
    try {
        //Script SQL
        let sql = `select diretor_id from tbl_diretor order by diretor_id desc limit 1`

        //Executa no BD o scrpt SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].diretor_id)
        else
            return 0
    } catch (error) {
        console.log(error)
        return
    }
}

//Insere um diretor no BD
const setInsertDirector = async function (diretor) {
    try {
        if (diretor.data_falecimento == null) {
            let sql = `insert into tbl_diretor (
            nome,
            data_nascimento,
            data_falecimento,
            genero, 
            foto
            )
            values('${diretor.nome}',
            '${diretor.data_nascimento}',
            ${diretor.data_falecimento}, 
            '${diretor.genero}',
            '${diretor.foto}')`

            let result = await prisma.$executeRawUnsafe(sql)
            if (result)
                return true
            else
                return false
        } else {
            let sql = `insert into tbl_diretor (
            nome,
            data_nascimento,
            data_falecimento,
            genero,
            foto)
            values('${diretor.nome}',
            '${diretor.data_nascimento}',
            '${diretor.data_falecimento}',
            '${diretor.genero}',
            '${diretor.foto}')`
            
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

//Atualiza um diretor
const setUpdateDirector = async function (diretor) {
    try {
        let sql = `update tbl_diretor set
                         nome = '${diretor.nome}',
                         data_nascimento = '${diretor.data_nascimento}',
                         data_falecimento = null,
                         genero = '${diretor.genero}',
                         foto = '${diretor.foto}'
                    where diretor_id = ${diretor.id}`

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
const setDeleteDirector = async function (id) {
    try {
        let sql = `delete from tbl_diretor where diretor_id = ${id}`

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
    getSelectAllDirector,
    getSelectByIdDirector,
    getSelectLastIdDirector,
    setInsertDirector,
    setUpdateDirector,
    setDeleteDirector
}