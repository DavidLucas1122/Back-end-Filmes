/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 29/10/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO para manipular o CRUD o BD
const { json } = require('body-parser')
const classificacaoDAO = require('../../model/DAO/classificacao.js')

//import do arquivo de que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarClassificacoes = async function () {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))


    try {
        //Chama a função do DAO para retornar a lista de filmes
        let result = await classificacaoDAO.getSelectAllRatings()

        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (Array.isArray(result)) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ratings = result

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

const buscarClassificacaoId = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        //Validação de campo obrigatório
        if (id !== '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar o id                                                                              
            let result = await classificacaoDAO.getSelectByIdRating(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.rating = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirClassificacao = async function (classificacao, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar classificacao
            let validarDados = await validarDadosClassificacao(classificacao)

            if (!validarDados) {

                //Função DAO para inserir classificacao
                let result = await classificacaoDAO.setInsertRating(classificacao, contentType)

                if (result) {
                    //Função para receber o ID gerado
                    let lastIdRating = await classificacaoDAO.getSelectLastIdRating()

                    if (lastIdRating) {
                        classificacao.id = lastIdRating
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = classificacao

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

//Atualiza uma classificação pelo ID
const atualizarClassificacao = async function (classificacao, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosClassificacao(classificacao)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarClassificacaoId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do classificacao
                    classificacao.id = parseInt(id)

                    //Chama a função do DAO para atualizar um classificacao
                    let result = await classificacaoDAO.setUpdateRating(classificacao)
                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = classificacao

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //retorno da função de buscarClassificacaoId (400 ou 404 ou 500)
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

const excluirClassificacao = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
        try {
            let validarID = await buscarClassificacaoId(id)
    
            if (validarID.status_code == 200) {
                let result = await classificacaoDAO.setDeleteRating(id)
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message
    
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

const validarDadosClassificacao = async function (classificacao) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (classificacao.nome == '' || classificacao.nome == null || classificacao.nome == undefined || classificacao.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}



module.exports = {
    listarClassificacoes,
    buscarClassificacaoId,
    inserirClassificacao,
    atualizarClassificacao,
    excluirClassificacao
}