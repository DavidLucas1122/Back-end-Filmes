const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')



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

// Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Locadora',
      version: '1.0.0',
      description: 'Documentação da API de Locadora de Filmes',
    },
  },
  apis: ['./routes/*.js'], // Caminho onde estão as rotas documentadas
}

const swaggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, function () {
    console.log('API aguardando requisições!!!')
})