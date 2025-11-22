/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de no Banco de Dados MySQL referente ao relacionamento entre filme e diretor
 * Data: 20/11/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/


//Import da biblioteca do PrismaClient
// const { PrismaClient } = require('@prisma/client')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retornar todos os filmes e diretores no banco de dados
const getSelectAllFilmsDirectors = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_diretor order by id desc`

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

//Retornar filme e diretor filtrando pelo ID
const getSelectByIdFilmDirector = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_diretor where id = ${id}`

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


const getSelectDirectorsByIdFilm = async function (idFilme) {
    try {
        //Script SQL
        let sql = `select tbl_diretor.diretor_id, tbl_diretor.nome
                        from tbl_filme
                            inner join tbl_filme_diretor
                                on tbl_filme.id = tbl_filme_diretor.id_filme
                            inner join tbl_diretor
                                on tbl_diretor.diretor_id = tbl_filme_diretor.id_diretor
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

const getSelectFilmsByIdDirector = async function (idDiretor) {
    try {
        //Script SQL
        let sql = `select tbl_filme.id, tbl_filme.nome
                        from tbl_filme
                            inner join tbl_filme_diretor
                                on tbl_filme.id = tbl_filme_diretor.id_filme
                            inner join tbl_diretor
                                on tbl_diretor.diretor_id = tbl_filme_diretor.id_diretor
                        where tbl_diretor.diretor_id = ${idDiretor};`

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
const getSelectLastIdFilmDirector = async function () {
    try {
        //Script SQL
        let sql = `select id from tbl_filme_diretor order by id desc limit 1`

        //Executa o script no BD
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false
    } catch (error) {
        return false
    }
}

//Insere um filme no BD
const setInsertFilmsDirectors = async function (filmeDiretor) {
    try {
        let sql = `insert into tbl_filme_diretor (id_filme, id_diretor)
        values(
            ${filmeDiretor.id_filme}, ${filmeDiretor.id_diretor});`
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um diretor no banco filtrando por ID
const setUpdateFilmsDirectors = async function (filmeDiretor) {
    try {
        let sql = `update tbl_filme_diretor set
                         id_filme = ${filmeDiretor.id_filme},
                         id_diretor = ${filmeDiretor.id_diretor}
                    where id = ${filmeDiretor.id}`

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

//Apaga um filme_diretor no banco de dados
const setDeleteFilmsDirectors = async function (id) {
    try {
        let sql = `delete from tbl_filme_diretor where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Apaga um filme_diretor no banco de dados através do idFilme
const setDeleteFilmsDirectorsByIdFilm = async function (idFilme) {
    try {
        let sql = `delete from tbl_filme_diretor where id_filme = ${idFilme}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Apaga um filme_diretor no banco de dados através do idDiretor
const setDeleteFilmsDirectorsByIdDirector = async function (idDiretor) {
    try {
        let sql = `delete from tbl_filme_diretor where id_diretor = ${idDiretor}`

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
    getSelectAllFilmsDirectors,
    getSelectByIdFilmDirector,
    getSelectFilmsByIdDirector,
    getSelectDirectorsByIdFilm,
    getSelectLastIdFilmDirector,
    setInsertFilmsDirectors,
    setUpdateFilmsDirectors,
    setDeleteFilmsDirectors,
    setDeleteFilmsDirectorsByIdFilm,
    setDeleteFilmsDirectorsByIdDirector
}