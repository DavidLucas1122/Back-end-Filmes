




const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

const PORT = process.env.PORT || 8080

const app = express()

// Configurações do CORS
app.use(cors())
app.use((request, response, next)=>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    next()
})

//Import das controller da API
const controllerFilme = require('./controller/filme/controller_filme.js')

//Endpoint para CRUD de Filmes

//Retorna a lista de filmes
app.get('/v1/locadora/filme/', cors(), async function(request, response){
    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()

    console.log(filme)
    response.status(filme.status_code)
    response.json(filme)
})

//Retorna um filme filtrando pelo ID
app.get('/v1/locadora/filme/:id', cors(), async function(request, response){

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





app.listen(PORT, function(){
    console.log('API aguardando requisições!!!')
})