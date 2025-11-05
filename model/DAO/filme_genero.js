/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de no Banco de Dados MySQL referente ao relacionamento entre filme e genero
 * Data: 05/101/2025
 * Autor: David
 * Versão: 1.0
 *******************************************************************************************/


//Import da biblioteca do PrismaClient
// const { PrismaClient } = require('@prisma/client')
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retornar todos os filmes e generos no banco de dados
const getSelectAllFilmsGenres = async function () {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_genero order by id desc`

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

//Retornar filme e gênero filtrando pelo ID
const getSelectByIdFilmGenre = async function (id) {
    try {
        //Script SQL
        let sql = `select * from tbl_filme_genero where id = ${id}`

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


const getSelectGenresByIdFilm = async function (idFilme) {
    try {
        //Script SQL
        let sql = `select tbl_genero.genero_id, tbl_genero.nome
                        from tbl_filme
                            inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id_filme
                            inner join tbl_genero
                                on tbl_genero.genero_id = tbl_filme_genero.id_genero
                        where tbl_filme.id = ${idFilme}`

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

const getSelectFilmsByIdGenre = async function (idGenero) {
    try {
        //Script SQL
        let sql = `select tbl_filme.id, tbl_filme.nome
                        from tbl_filme
                            inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id_filme
                            inner join tbl_genero
                                on tbl_genero.genero_id = tbl_filme_genero.id_genero
                        where tbl_filme.id = ${idGenero}`

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

//Retornar o ultimo ID
const getSelectLastIdFilmGenre = async function () {
    try {
        //Script SQL
        let sql = `select id from tbl_filme_genero order by id desc limit 1`

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

//Insere um filme no BD
const setInsertFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `insert into tbl_filme_genero (id_filme, id_genero)
        values(
            ${filmeGenero.id_filme}, ${filmeGenero.id_genero});`
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Atualiza um gên no banco filtrando por ID
const setUpdateFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `update tbl_filme_genero set
                         id_filme = ${filmeGenero.id_filme},
                         id_genero = ${filmeGenero.id_genero}
                    where genero_id = ${filmeGenero.id}`

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

//Apaga um gênero no banco de dados
const setDeleteFilmsGenres = async function (id) {
    try {
        let sql = `delete from tbl_filme_genero where id = ${id}`

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
    getSelectAllFilmsGenres,
    getSelectByIdFilmGenre,
    getSelectFilmsByIdGenre,
    getSelectGenresByIdFilm,
    getSelectLastIdFilmGenre,
    setInsertFilmsGenres,
    setUpdateFilmsGenres,
    setDeleteFilmsGenres
}