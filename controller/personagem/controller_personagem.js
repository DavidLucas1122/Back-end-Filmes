/************************************************************************
 * Objetivo: Arquivo responsável pela manipulação entre o APP e a Model 
 *              (Validações, tratamento de dados, tratamento de erros, etc)
 * Data: 01/11/2025
 * Autor: David
 * Versão 1.0
**************************************************************************/

//Import do arquivo DAO para manipular o CRUD o BD
const { json } = require('body-parser')
const personagemDAO = require('../../model/DAO/personagem.js')

//import do arquivo que padroniza as respostas
const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

//Listar personagens
const listarPersonagens = async function () {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Chama a função do DAO para retornar a lista de personagens
        let result = await personagemDAO.getSelectAllCharacter()
        if (result) {
            //Validação para identificar se o retorno do banco é um array (vazio ou com dados)
            if (Array.isArray(result)) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.character = result

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

//Filtrar personagens pelo ID
const buscarPersonagemId = async function (personagem_id) {
    //Cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (personagem_id !== '' && personagem_id != null && personagem_id != undefined && !isNaN(personagem_id) && personagem_id > 0) {
            //Chamar a função para filtrar ID
            let result = await personagemDAO.getSelectByIdCharacter(parseInt(personagem_id))

            if (result) {
                console.log(result)
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.character = result

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

//Insere um novo personagem
const inserirPersonagem = async function (personagem, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosPersonagem(personagem)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await personagemDAO.setInsertCharacter(personagem, contentType)

                if (result) {

                    //Chama uma função para receber o ID gerado no BD
                    let lastIdPersonagem = await personagemDAO.getSelectLastIdCharacter()

                    if (lastIdPersonagem) {
                        personagem.id = lastIdPersonagem

                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = personagem

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

//Atualizar Personagem filtrando pelo ID
const atualizarPersonagem = async function (personagem, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosPersonagem(personagem)

            if (!validarDados) {

                //Chama a função para validar a consistência do ID e verificar se existe no banco de dados                
                let validarID = await buscarPersonagemId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200  
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do filme
                    personagem.id = parseInt(id)

                    //Chama a função do DAO para atualizar um filme
                    let result = await personagemDAO.setUpdateCharacter(personagem)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = personagem

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

//Apaga um personagem filtrando pelo ID
const excluirPersonagem = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let validarID = await buscarPersonagemId(id)

        if (validarID.status_code == 200) {

            let result = await personagemDAO.setDeleteCharacter(id)

            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            return validarID
        }
    }
    catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const validarDadosPersonagem = async function (personagem) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (personagem.nome == '' || personagem.nome == null || personagem.nome == undefined || personagem.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (personagem.genero == '' || personagem.genero == null || personagem.genero == undefined || personagem.genero.length > 50) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GÊNERO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (personagem.idade.length == 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else if (personagem.foto == undefined || personagem.foto.length > 200) {

    } else {
        return false
    }
}

module.exports = {
    listarPersonagens,
    buscarPersonagemId,
    inserirPersonagem,
    atualizarPersonagem,
    excluirPersonagem
}