const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

const PORT = process.env.PORT || 8080

const app = express()

// Configurações do CORS
app.use(cors())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    next()
})

//Import das controller da API
const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_genero.js')
const controllerClassificacao = require('./controller/classificacao/controller_classificacao.js')
const controllerPersonagem = require ('./controller/personagem/controller_personagem.js')



//Endpoint para CRUD de Filmes

//Retorna a lista de filmes
app.get('/v1/locadora/filme/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()

    console.log(filme)
    response.status(filme.status_code)
    response.json(filme)
})

//Retorna um filme filtrando pelo ID
app.get('/v1/locadora/filme/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idFilme = request.params.id

    //Chama a função da controller para retornar o filme
    let filme = await controllerFilme.buscarFilmeID(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//Recebe um novo filme BD
app.post('/v1/locadora/filme/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, anviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)
    response.status(filme.status_code)
    response.json(filme)
})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idFilme = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o filme 
    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)

    console.log('>> contentType recebido:', contentType);
    console.log('>> tipo (typeof):', typeof contentType);

})

app.delete('/v1/locadora/filme/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let filme = await controllerFilme.excluirFilme(id)

    response.status(filme.status_code)
    response.json(filme)
})




//EndPoints para Crud de gêneros de filmes

//Retornar lista de gêneros
app.get('/v1/locadora/genero/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os gêneros
    let genero = await controllerGenero.listarGeneros()

    console.log(genero)
    response.status(genero.status_code)
    response.json(genero)
})

//Retorna um gênero filtrando pelo ID
app.get('/v1/locadora/genero/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idGenero = request.params.id

    //Chama a função da controller para retornar o filme
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

//Recebe um novo genero BD
app.post('/v1/locadora/genero/', cors(), bodyParserJSON, async function (request, response) {
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
app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function (request, response) {
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

    console.log('>> contentType recebido:', contentType);
    console.log('>> tipo (typeof):', typeof contentType);

})

//Deleta um gênero
app.delete('/v1/locadora/genero/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let genero = await controllerGenero.excluirGenero(id)

    response.status(genero.status_code)
    response.json(genero)
})

//EndPoints Classiicação

//Retornar lista de classificações
app.get('/v1/locadora/classificacao/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os gêneros
    let classificacao = await controllerClassificacao.listarClassificacoes()

    response.status(classificacao.status_code)
    response.json(classificacao)
})

//Retorna uma classificacao filtrando pelo ID
app.get('/v1/locadora/classificacao/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idClassificacao = request.params.id

    //Chama a função da controller para retornar o filme
    let classificacao = await controllerClassificacao.buscarClassificacaoId(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

//Recebe uma nova classificação BD
app.post('/v1/locadora/classificacao/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o genero, anviamos os dados do body e o content-type
    let classificacao = await controllerClassificacao.inserirClassificacao(dadosBody, contentType)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

app.put('/v1/locadora/classificacao/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do filme encaminhado pela URL
    let idClassificacao = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar a classificacao
    let classificacao = await controllerClassificacao.atualizarClassificacao(dadosBody, idClassificacao, contentType)

    response.status(classificacao.status_code)
    response.json(classificacao)

    console.log('>> contentType recebido:', contentType);
    console.log('>> tipo (typeof):', typeof contentType);
})

app.delete('/v1/locadora/classificacao/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let classificacao = await controllerClassificacao.excluirClassificacao(id)

    response.status(classificacao.status_code)
    response.json(classificacao)
})


//END POINTS CRUD PERSONAGEM

//Retorna a lista de personagem
app.get('/v1/locadora/personagem/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os personagens
    let personagem = await controllerPersonagem.listarPersonagens()

    console.log(personagem)
    response.status(personagem.status_code)
    response.json(personagem)
})

//Retorna um personagem filtrando pelo ID
app.get('/v1/locadora/personagem/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idPersonagem = request.params.id

    //Chama a função da controller para retornar o personagem
    let personagem = await controllerPersonagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

//Recebe um novo personagem BD
app.post('/v1/locadora/personagem/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o personagem, anviamos os dados do body e o content-type
    let personagem = await controllerPersonagem.inserirPersonagem(dadosBody, contentType)
    response.status(personagem.status_code)
    response.json(personagem)
})


app.put('/v1/locadora/personagem/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do personagem encaminhado pela URL
    let idPersonagem = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o filme 
    let personagem = await controllerPersonagem.atualizarPersonagem(dadosBody, idPersonagem, contentType)

    response.status(personagem.status_code)
    response.json(personagem)

    console.log('>> contentType recebido:', contentType);
    console.log('>> tipo (typeof):', typeof contentType);

})

app.delete('/v1/locadora/personagem/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let personagem = await controllerPersonagem.excluirPersonagem(id)

    response.status(personagem.status_code)
    response.json(personagem)
})

app.listen(PORT, function () {
    console.log('API aguardando requisições!!!')
})