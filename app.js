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

//Import das rotas
const filmeRoutes = require('./routes/filme.js')
const generoRoutes = require('./routes/genero.js');
const classificacaoRoutes = require('./routes/classificacao.js');
const personagemRoutes = require('./routes/personagem.js');
const nacionalidadeRoutes = require('./routes/nacionalidade.js');
const diretorRoutes = require('./routes/diretor.js');

app.use('/v1/locadora/filme', filmeRoutes)
app.use('/v1/locadora/genero', generoRoutes)
app.use('/v1/locadora/classificacao', classificacaoRoutes)
app.use('/v1/locadora/personagem', personagemRoutes)
app.use('/v1/locadora/nacionalidade', nacionalidadeRoutes)
app.use('/v1/locadora/diretor', diretorRoutes)

app.listen(PORT, function () {
    console.log('API aguardando requisições!!!')
})