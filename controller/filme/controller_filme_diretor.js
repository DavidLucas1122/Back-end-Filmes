/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              para o CRUD  de filme e diretor
 * Data: 05/11/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO do Filme Diretor
const filmeDiretorDAO = require('../../model/DAO/filme_diretor.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Listar os diretor e filmes
const listarFilmesDiretor = async function () {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de gêneros de filmes
        let result = await filmeDiretorDAO.getSelectAllFilmsDirectors()

        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.film_director = result

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

//Filtrar filme e diretores por ID
const buscarFilmeDiretorId = async function (id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id !== '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeDiretorDAO.getSelectByIdFilmDirector(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_director = result

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

//Retorna os diretores filtrando por ID do filme
const listarDiretoresIdFilme = async function (idFilme) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idFilme !== '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeDiretorDAO.getSelectDirectorsByIdFilm(parseInt(idFilme))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_director = result

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

//Retorna os filmes filtrando por ID do diretor
const listarFilmesIdDiretor = async function (idDiretor) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (idDiretor !== '' && idDiretor != null && idDiretor != undefined && !isNaN(idDiretor) && idDiretor > 0) {
            //Chamar a função para filtrar ID
            let result = await filmeDiretorDAO.getSelectFilmsByIdDirector(parseInt(idDiretor))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film_director = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
        else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_DIRETOR] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Inserir um novo filme diretor
const inserirFilmeDiretor = async function (filmeDiretor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar diretor
            let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

            if (!validarDados) {

                //Função DAO para inserir diretor
                let result = await filmeDiretorDAO.setInsertFilmsDirectors(filmeDiretor, contentType)

                if (result) {
                    //Função para receber o ID gerado
                    let lastIdFilmDirector = await filmeDiretorDAO.getSelectLastIdFilmDirector()

                    if (lastIdFilmDirector) {
                        filmeDiretor.id = lastIdFilmDirector
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = filmeDiretor

                        return MESSAGE.HEADER //201
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
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

//Atualiza um filme diretor filtrando pelo ID
const atualizarFilmeDiretor = async function (filmeDiretor, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeDiretor(filmeDiretor)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarFilmeDiretorId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do diretor
                    filmeDiretor.id = parseInt(id)

                    //Chama a função do DAO para atualizar um diretor
                    let result = await filmeDiretorDAO.setUpdateFilmsDirectors(filmeDiretor)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filmeDiretor

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //retorno da função de buscarDiretorId (400 ou 404 ou 500)
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

const excluirFilmeDiretor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarFilmeDiretorId(id)

        if (validarID.status_code == 200) {
            let result = await filmeDiretorDAO.setDeleteFilmsDirectors(Number(id))

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

const excluirFilmeDiretorIdFilme = async function (idFilme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeDiretorDAO.setDeleteFilmsDirectorsByIdFilm(Number(idFilme))

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

const excluirFilmeDiretorIdDiretor = async function (idDiretor) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeDiretorDAO.setDeleteFilmsDirectorsByIdDirector(Number(idDiretor))

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



//Validar filme/diretor
const validarDadosFilmeDiretor = async function (filmeDiretor) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filmeDiretor.id_filme == '' || filmeDiretor.id_filme == null || filmeDiretor.id_filme == undefined || isNaN(filmeDiretor.id_filme) || filmeDiretor.id_filme <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (filmeDiretor.id_diretor == '' || filmeDiretor.id_diretor == null || filmeDiretor.id_diretor == undefined || isNaN(filmeDiretor.id_diretor) || filmeDiretor.id_diretor <= 0) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_DIRETOR] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}





module.exports = {
    listarFilmesDiretor,
    listarDiretoresIdFilme,
    listarFilmesIdDiretor,
    inserirFilmeDiretor,
    atualizarFilmeDiretor,
    excluirFilmeDiretor,
    excluirFilmeDiretorIdDiretor,
    excluirFilmeDiretorIdFilme
}