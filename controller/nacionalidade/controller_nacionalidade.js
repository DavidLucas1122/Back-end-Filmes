/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 01/11/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO para manipular o CRUD o BDz\
const { json } = require('body-parser')
const nacionalidadeDAO = require('../../model/DAO/nacionalidade.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Listar as nacionalidade
const listarNacionalidades = async function () {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de gêneros de filmes
        let result = await nacionalidadeDAO.getSelectAllNationality()

        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (Array.isArray(result)) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.nacionalidade = result

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

//Filtrar nacionalidades por ID
const buscarNacionalidadeId = async function (id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id !== '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chamar a função para filtrar ID
            let result = await nacionalidadeDAO.getSelectByIdNationality(parseInt(id))

            if (result) {
                console.log(result)
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.nationality = result

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
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Inserir uma nova nacionalidade
const inserirNacionalidade = async function (nacionalidade, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar nacionalidade
            let validarDados = await validarDadosNacionalidade(nacionalidade)

            if (!validarDados) {

                //Função DAO para inserir nacionalidade
                let result = await nacionalidadeDAO.setInsertNationality(nacionalidade, contentType)

                if (result) {
                    //Função para receber o ID gerado
                    let lastIdNationality = await nacionalidadeDAO.getSelectLastIdNationality()

                    if (lastIdNationality) {
                        nacionalidade.id = lastIdNationality
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = nacionalidade

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

//Atualiza um nacionalidade filtrando pelo ID
const atualizarNacionalidade = async function (nacionalidade, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {


            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosNacionalidade(nacionalidade)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarNacionalidadeId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados da nacionalidade
                    nacionalidade.id = parseInt(id)

                    //Chama a função do DAO para atualizar uma nacionalidade
                    let result = await nacionalidadeDAO.setUpdateNationality(nacionalidade)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = nacionalidade

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
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirNacionalidade = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let validarID = await buscarNacionalidadeId(id)

        if (validarID.status_code == 200) {
            let result = await nacionalidadeDAO.setDeleteNationality(id)

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

//Validar dados nacionalidade
const validarDadosNacionalidade = async function (nacionalidade) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (nacionalidade.nome == '' || nacionalidade.nome == null || nacionalidade.nome == undefined || nacionalidade.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (nacionalidade.sigla == '' || nacionalidade.sigla == null || nacionalidade.sigla == undefined || nacionalidade.sigla.length > 5) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SIGLA] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }   
    else {
        return false
    }
}


module.exports = {
    listarNacionalidades,
    buscarNacionalidadeId,
    inserirNacionalidade,
    atualizarNacionalidade,
    excluirNacionalidade
}