const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerDiretor = require('../controller/diretor/controller_diretor.js')

const bodyParserJSON = bodyParser.json()


//Retorna a lista de diretores
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os diretores
    let diretor = await controllerDiretor.listarDiretores()

    response.status(diretor.status_code)
    response.json(diretor)
})

//Retorna um filme filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idDiretor = request.params.id

    //Chama a função da controller para retornar o filme
    let diretor = await controllerDiretor.buscarDiretorId(idDiretor)

    response.status(diretor.status_code)
    response.json(diretor)
})

//Novo diretor
router.post('/v1/locadora/diretor/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o diretor, anviamos os dados do body e o content-type
    let diretor = await controllerDiretor.inserirDiretor(dadosBody, contentType)
    response.status(diretor.status_code)
    response.json(diretor)
})

router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idDiretor = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar a nacionalidade
    let diretor = await controllerDiretor.atualizarDiretor(dadosBody, idDiretor, contentType)

    response.status(diretor.status_code)
    response.json(diretor)
})

router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let diretor = await controllerDiretor.excluirDiretor(id)

    response.status(diretor.status_code)
    response.json(diretor)
})