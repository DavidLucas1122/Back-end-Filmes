/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 18/11/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO para manipular o CRUD o BD
const { json } = require('body-parser')
const atorDAO = require('../../model/DAO/ator.js')

//Import da controller filmeAtor (tabela de relação)
const controllerFilmeAtor = require('../filme/controller_filme_ator.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Listar atores
const listarAtores = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de atores
        let result = await atorDAO.getSelectAllActor()

        if (result) {
            for (let ator of result) {
                let resultFilmes = await controllerFilmeAtor.listarFilmesIdAtor(ator.ator_id)

                if (resultFilmes.status_code == 200)
                    ator.filme = resultFilmes.response.film_actor
            }

            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.actor = result

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

//Filtrar ator pelo ID
const buscarAtorId = async function (ator_id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (ator_id !== '' && ator_id != null && ator_id != undefined && !isNaN(ator_id) && ator_id > 0) {
            //Chamar a função para filtrar ID
            let result = await atorDAO.getSelectByIdActor(parseInt(ator_id))

            if (result) {
                if (result.length > 0) {
                    for (let ator of result) {
                        let resultFilmes = await controllerFilmeAtor.listarFilmesIdAtor(ator_id)

                        if (resultFilmes.status_code == 200)
                            ator.filme = resultFilmes.response.film_actor
                    }

                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.actor = result

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

//Insere um novo ator
const inserirAtor = async function (ator, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo ator
                let result = await atorDAO.setInsertActor(ator, contentType)

                if (result) {
                    //Chama uma função para receber o ID gerado no BD
                    let lastIdActor = await atorDAO.getSelectLastIdActor()

                    if (lastIdActor) {
                        ator.id = lastIdActor

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = ator

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
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualizar Ator filtrando pelo ID
const atualizarAtor = async function (ator, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosAtor(ator)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarAtorId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do ator
                    ator.id = parseInt(id)

                    //Chama a função do DAO para atualizar um ator
                    let result = await atorDAO.setUpdateActor(ator)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = ator

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //retorno da função de buscarFilmeID (400 ou 404 ou 500)
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

//Apaga um Ator filtrando pelo ID
const excluirAtor = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarAtorId(id)

        if (validarID.status_code == 200) {

            let resultDeleteFilmeAtor = await controllerFilmeAtor.excluirFilmeAtorIdAtor(id)

            if (resultDeleteFilmeAtor) {
                let result = await atorDAO.setDeleteActor(id)

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        } else {
            return validarID
        }
    }
    catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosAtor = async function (ator) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ator.nome == '' || ator.nome == null || ator.nome == undefined || ator.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (ator.data_nascimento == '' || ator.data_nascimento == null || ator.data_nascimento == undefined || ator.data_nascimento.length != 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_NASCIMENTO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (ator.genero == '' || ator.genero == null || ator.genero == undefined || ator.genero.length > 50) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GÊNERO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (ator.foto == undefined || ator.foto.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FOTO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}


module.exports = {
    listarAtores,
    buscarAtorId,
    inserirAtor,
    atualizarAtor,
    excluirAtor
}