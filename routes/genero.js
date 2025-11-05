const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerGenero = require('../controller/genero/controller_genero.js')

const bodyParserJSON = bodyParser.json()

//Retornar lista de gêneros
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os gêneros
    let genero = await controllerGenero.listarGeneros()

    console.log(genero)
    response.status(genero.status_code)
    response.json(genero)
})

//Retorna um gênero filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idGenero = request.params.id

    //Chama a função da controller para retornar o filme
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

//Recebe um novo genero BD
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o genero, anviamos os dados do body e o content-type
    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)
    response.status(genero.status_code)
    response.json(genero)
})

//Atualiza um Genero
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idGenero = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o filme 
    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

//Deleta um gênero
router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let genero = await controllerGenero.excluirGenero(id)

    response.status(genero.status_code)
    response.json(genero)
})