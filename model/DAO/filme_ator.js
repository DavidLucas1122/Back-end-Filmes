/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de no Banco de Dados MySQL referente ao relacionamento entre filme e ator
 * Data: 19/11/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/


//Import da biblioteca do PrismaClient
// const { PrismaClient } = require('@prisma/client')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retornar todos os filmes e ator no banco de dados
const getSelectAllFilmsActors = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_ator order by id desc`

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

//Retornar filme e ator filtrando pelo ID
const getSelectByIdFilmActor = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_ator where id = ${id}`

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


const getSelectActorsByIdFilm = async function (idFilme) {
    try {
        //Script SQL
        let sql = `select tbl_ator.ator_id, tbl_ator.nome
                        from tbl_filme
                            inner join tbl_filme_ator
                                on tbl_filme.id = tbl_filme_ator.id_filme
                            inner join tbl_ator
                                on tbl_ator.ator_id = tbl_filme_ator.id_ator
                        where tbl_filme.id = ${idFilme}`

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

const getSelectFilmsByIdActor = async function (idAtor) {
    try {
        //Script SQL
        let sql = `select tbl_filme.id, tbl_filme.nome
                        from tbl_filme
                            inner join tbl_filme_ator
                                on tbl_filme.id = tbl_filme_ator.id_filme
                            inner join tbl_ator
                                on tbl_ator.ator_id = tbl_filme_ator.id_ator
                        where tbl_ator.ator_id = ${idAtor};`

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

//Retornar o ultimo ID
const getSelectLastIdFilmActor = async function () {
    try {
        //Script SQL
        let sql = `select id from tbl_filme_ator order by id desc limit 1`

        //Executa o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Insere um filme no BD
const setInsertFilmsActor = async function (filmeAtor) {
    try {
        let sql = `insert into tbl_filme_ator (id_filme, id_ator)
        values(
            ${filmeAtor.id_filme}, ${filmeAtor.id_ator});`
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um filme_ator no banco filtrando por ID
const setUpdateFilmsActor = async function (filmeAtor) {
    try {
        let sql = `update tbl_filme_ator set
                         id_filme = ${filmeAtor.id_filme},
                         id_ator = ${filmeAtor.id_ator}
                    where id = ${filmeAtor.id}`

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

//Apaga um ator no banco de dados
const setDeleteFilmsActor = async function (id) {
    try {
        let sql = `delete from tbl_filme_ator where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Apaga um filme_ator pelo id do filme no banco de dados
const setDeleteFilmsActorByIdFilm = async function (idFilme) {
    try {
        let sql = `delete from tbl_filme_ator where id_filme = ${idFilme}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteFilmsActorByIdActor = async function (idAtor) {
    try {
        let sql = `delete from tbl_filme_ator where id_ator = ${idAtor}`

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
    getSelectAllFilmsActors,
    getSelectByIdFilmActor,
    getSelectFilmsByIdActor,
    getSelectActorsByIdFilm,
    getSelectLastIdFilmActor,
    setInsertFilmsActor,
    setUpdateFilmsActor,
    setDeleteFilmsActor,
    setDeleteFilmsActorByIdActor,
    setDeleteFilmsActorByIdFilm
}