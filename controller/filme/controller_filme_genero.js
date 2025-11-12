/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              para o CRUD  de filme e genero
 * Data: 05/11/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO do Filme Genero
const filmeGeneroDAO = require('../../model/DAO/filme_genero.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Listar os gêneros e filmes
const listarFilmesGeneros = async function () {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de gêneros de filmes
        let result = await filmeGeneroDAO.getSelectAllFilmsGenres()

        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filme_genero = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Filtrar filme e gêneros por ID
const buscarFilmeGeneroId = async function (id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id !== '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeGeneroDAO.getSelectByIdFilmGenre(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Retorna os gêneros filtrando por ID do filme
const listarGenerosIdFilme = async function (idFilme) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idFilme !== '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeGeneroDAO.getSelectGenresByIdFilm(parseInt(idFilme))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Retorna os filmes filtrando por ID do genero
const listarFilmesIdGenero = async function (idGenero) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idGenero !== '' && idGenero != null && idGenero != undefined && !isNaN(idGenero) && idGenero > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeGeneroDAO.getSelectFilmsByIdGenre(parseInt(idGenero))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_genre = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Inserir um novo genero
const inserirFilmeGenero = async function (filmeGenero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar genero
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if (!validarDados) {

                //Função DAO para inserir genero
                let result = await filmeGeneroDAO.setInsertFilmsGenres(filmeGenero, contentType)

                if (result) {
                    //Função para receber o ID gerado
                    let lastIdFilmGenre = await filmeGeneroDAO.getSelectLastIdFilmGenre()

                    if (lastIdFilmGenre) {
                        filmeGenero.id = lastIdFilmGenre
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

                        return MESSAGE.HEADER //201
                    } else {
                        MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um filme genero filtrando pelo ID
const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarGeneroId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do genero
                    filmeGenero.id = parseInt(id)

                    //Chama a função do DAO para atualizar um genero
                    let result = await filmeGeneroDAO.setUpdateFilmsGenres(filmeGenero)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //retorno da função de buscarGeneroId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirFilmeGenero = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmeGeneroId(id)

        if (validarID.status_code == 200) {
            let result = await filmeGeneroDAO.setDeleteFilmsGenres(Number(id))

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                delete MESSAGE.HEADER.response
                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            validarID
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirFilmeGeneroIdFilme = async function (idFilme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeGeneroDAO.setDeleteFilmsGenresByIdFilm(Number(idFilme))

        if (result) {
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

            delete MESSAGE.HEADER.response
            return MESSAGE.HEADER //200
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirFilmeGeneroIdGenero = async function (idGenero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeGeneroDAO.setDeleteFilmsGenresByIdGenre(Number(idGenero))

        if (result) {
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

            delete MESSAGE.HEADER.response
            return MESSAGE.HEADER //200
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



//Validar nome do genero
const validarDadosFilmeGenero = async function (filmeGenero) {
    console.log(filmeGenero)
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmeGenero.id_filme == '' || filmeGenero.id_filme == null || filmeGenero.id_filme == undefined || isNaN(filmeGenero.id_filme) || filmeGenero.id_filme <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero == undefined || isNaN(filmeGenero.id_genero) || filmeGenero.id_genero <= 0) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}





module.exports = {
    listarFilmesGeneros,
    buscarFilmeGeneroId,
    inserirFilmeGenero,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    listarFilmesIdGenero,
    listarGenerosIdFilme,
    excluirFilmeGeneroIdFilme,
    excluirFilmeGeneroIdGenero
}