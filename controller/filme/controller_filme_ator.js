/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              para o CRUD  de filme e ator
 * Data: 19/11/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO do Filme Ator
const filmeAtorDAO = require('../../model/DAO/filme_ator.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Listar os atores e filmes
const listarFilmesAtores = async function () {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de atores de filmes
        let result = await filmeAtorDAO.getSelectAllFilmsActors()

        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.film_actor = result

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

//Filtrar filme e ator por ID
const buscarFilmeAtorId = async function (id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id !== '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeAtorDAO.getSelectByIdFilmActor(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_actor = result

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

//Retorna os atores filtrando por ID do filme
const listarAtoresIdFilme = async function (idFilme) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idFilme !== '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeAtorDAO.getSelectActorsByIdFilm(parseInt(idFilme))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_actor = result

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

//Retorna os filmes filtrando por ID do ator
const listarFilmesIdAtor = async function (idAtor) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idAtor !== '' && idAtor != null && idAtor != undefined && !isNaN(idAtor) && idAtor > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeAtorDAO.getSelectFilmsByIdActor(parseInt(idAtor))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_actor = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ATOR] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Inserir um novo filme ator
const inserirFilmeAtor = async function (filmeAtor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar genero
            let validarDados = await validarDadosFilmeAtor(filmeAtor)

            if (!validarDados) {

                //Função DAO para inserir genero
                let result = await filmeAtorDAO.setInsertFilmsActor(filmeAtor)

                if (result) {
                    //Função para receber o ID gerado
                    let lastIdFilmActor = await filmeAtorDAO.getSelectLastIdFilmActor()

                    if (lastIdFilmActor) {
                        filmeAtor.id = lastIdFilmActor
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmeAtor

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
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um filme ator filtrando pelo ID
const atualizarFilmeAtor = async function (filmeAtor, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeAtor(filmeAtor)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarFilmeAtorId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do ator
                    filmeAtor.id = parseInt(id)

                    //Chama a função do DAO para atualizar um ator
                    let result = await filmeAtorDAO.setUpdateFilmsActor(filmeAtor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmeAtor

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

const excluirFilmeAtor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmeAtorId(id)

        if (validarID.status_code == 200) {
            let result = await filmeAtorDAO.setDeleteFilmsActor(Number(id))

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
            return validarID
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirFilmeAtorIdFilme = async function (idFilme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeAtorDAO.setDeleteFilmsActorByIdFilm(Number(idFilme))

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

const excluirFilmeAtorIdAtor = async function (idAtor) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeAtorDAO.setDeleteFilmsActorByIdActor(Number(idAtor))

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



//Validar dados
const validarDadosFilmeAtor = async function (filmeAtor) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmeAtor.id_filme == '' || filmeAtor.id_filme == null || filmeAtor.id_filme == undefined || isNaN(filmeAtor.id_filme) || filmeAtor.id_filme <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (filmeAtor.id_ator == '' || filmeAtor.id_ator == null || filmeAtor.id_ator == undefined || isNaN(filmeAtor.id_ator) || filmeAtor.id_ator <= 0) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_ATOR] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}





module.exports = {
    listarFilmesAtores,
    buscarFilmeAtorId,
    inserirFilmeAtor,
    atualizarFilmeAtor,
    listarFilmesIdAtor,
    listarAtoresIdFilme,
    excluirFilmeAtor,
    excluirFilmeAtorIdFilme,
    excluirFilmeAtorIdAtor
}