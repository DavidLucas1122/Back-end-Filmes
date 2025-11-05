const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerNacionalidade = require('../controller/nacionalidade/controller_nacionalidade.js')

const bodyParserJSON = bodyParser.json()


//Retorna a lista de nacionalidades
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos as nacionalidades
    let nacionalidade = await controllerNacionalidade.listarNacionalidades()

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

//Retorna uma nacionalidade filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idNacionalidade = request.params.id

    //Chama a função da controller para retornar a nacionalidade
    let nacionalidade = await controllerNacionalidade.buscarNacionalidadeId(idNacionalidade)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

//Recebe uma nova nacionalidade BD
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir a nacionalidade, anviamos os dados do body e o content-type
    let nacionalidade = await controllerNacionalidade.inserirNacionalidade(dadosBody, contentType)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idNacionalidade = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar a nacionalidade
    let nacionalidade = await controllerNacionalidade.atualizarNacionalidade(dadosBody, idNacionalidade, contentType)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let nacionalidade = await controllerNacionalidade.excluirNacionalidade(id)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})