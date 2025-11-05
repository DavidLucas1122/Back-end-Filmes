const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerGenero = require('../controller/personagem/controller_personagem.js')

const bodyParserJSON = bodyParser.json()


//Retorna a lista de personagem
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os personagens
    let personagem = await controllerPersonagem.listarPersonagens()

    console.log(personagem)
    response.status(personagem.status_code)
    response.json(personagem)
})

//Retorna um personagem filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idPersonagem = request.params.id

    //Chama a função da controller para retornar o personagem
    let personagem = await controllerPersonagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

//Recebe um novo personagem BD
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o personagem, anviamos os dados do body e o content-type
    let personagem = await controllerPersonagem.inserirPersonagem(dadosBody, contentType)
    response.status(personagem.status_code)
    response.json(personagem)
})

//Atualiza um personagem no BD
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do personagem encaminhado pela URL
    let idPersonagem = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o personagem
    let personagem = await controllerPersonagem.atualizarPersonagem(dadosBody, idPersonagem, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})

//Deleta um pesonagem
app.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let personagem = await controllerPersonagem.excluirPersonagem(id)

    response.status(personagem.status_code)
    response.json(personagem)
})
