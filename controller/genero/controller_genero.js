/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 22/10/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO para manipular o CRUD o BD
const { json } = require('body-parser')
const generoDAO = require('../../model/DAO/genero.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')
const { buscarFilmeID } = require('../filme/controller_filme.js')

//Listar os gêneros de filmes
const listarGeneros = async function () {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de gêneros de filmes
        let result = await generoDAO.getSelectAllGenre()
        console.log(result)

        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (Array.isArray(result)) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.gender = result

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

//Filtrar gêneros por ID
const buscarGeneroPorId = async function (genero_id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (genero_id !== '' && genero_id != null && genero_id != undefined && !isNaN(genero_id) && genero_id > 0) {
            //Chamar a função para filtrar ID
            let result = await generoDAO.getSelectByIdGenre(parseInt(genero_id))

            if (result) {
                console.log(result)
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.gender = result

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

//Inserir um novo genero
const inserirGenero = async function (genero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar genero
            let validarDados = await validarDadosGenero(genero)

            if (!validarDados) {

                //Função DAO para inserir genero
                let result = await generoDAO.setInsertGenre(genero, contentType)

                if (result) {
                    //Função para receber o ID gerado
                    let lastIdGenre = await generoDAO.getSelectLastIdGenre()

                    if (lastIdGenre) {
                        genero.id = lastIdGenre
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = genero

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

const atualizarGenero = async function (genero, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //Validação content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Função para validar gênero
            let validarDados = await validarDadosGenero(genero)

            if (!validarDados) {

                //Validar a consistência do ID e verificar se existe no banco de dados
                let validarId = await buscarGeneroPorId(id)

                //Verificar se existe no BD, se sim, status 200
                if (validarId.status_code == 200) {

                    //Adicionando ID no Json com os dados do gênero
                    genero.id = parseInt(id)

                    //Chama a função do DAO para atualizar o gênero
                    let result = await generoDAO.setUpdateGenre(genero)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = genero

                        return MESSAGE.HEADER
                    }
                }
            }
        }
    } catch (error) {
        MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}






//Validar nome do genero
const validarDadosGenero = async function (genero) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}





module.exports = {
    listarGeneros,
    buscarGeneroPorId,
    inserirGenero,
    
}