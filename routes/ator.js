const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerAtor = require('../controller/ator/controller_ator')
const bodyParserJSON = bodyParser.json()


//Retorna a lista de atores
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os atores
    let ator = await controllerAtor.listarAtores()

    response.status(ator.status_code)
    response.json(ator)
})

//Retorna um ator filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idAtor = request.params.id

    //Chama a função da controller para retornar o ator
    let ator = await controllerAtor.buscarAtorId(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})


//Novo ator
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o ator, anviamos os dados do body e o content-type
    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)
    response.status(ator.status_code)
    response.json(ator)
})


//Atualizar Ator
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do ator encaminhado pela URL
    let idAtor = request.params.id
    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar a nacionalidade
    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)
})


router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let ator = await controllerAtor.excluirAtor(id)

    response.status(ator.status_code)
    response.json(ator)
})

module.exports = router