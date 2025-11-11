const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerClassificacao = require('../controller/classificacao/controller_classificacao.js')

const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Classificação
 *   description: Rotas relacionadas a classificações
 */

/**
 * @swagger
 * /v1/locadora/classificacao:
 *   get:
 *     summary: Retorna a lista de todas as classificações
 *     tags: [Classificação]
 *     responses:
 *       200:
 *         description: Lista de classificações retornada com sucesso
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retornar lista de classificações
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos as classificações
    let classificacao = await controllerClassificacao.listarClassificacoes()

    response.status(classificacao.status_code)
    response.json(classificacao)
})

/**
 * @swagger
 * /v1/locadora/classificacao/{id}:
 *   get:
 *     summary: Retorna uma classificação pelo ID
 *     tags: [Classificação]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da classificação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Classificação encontrada com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna uma classificacao filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idClassificacao = request.params.id

    //Chama a função da controller para retornar o filme
    let classificacao = await controllerClassificacao.buscarClassificacaoId(idClassificacao)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

/**
 * @swagger
 * /v1/locadora/classificacao:
 *   post:
 *     summary: Cadastra uma nova classificação
 *     tags: [Classificação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Livre"
 *                 description: Nome da classificação indicativa
 *     responses:
 *       201:
 *         description: Classificação cadastrada com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 */

//Recebe uma nova classificação BD
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o genero, anviamos os dados do body e o content-type
    let classificacao = await controllerClassificacao.inserirClassificacao(dadosBody, contentType)
    response.status(classificacao.status_code)
    response.json(classificacao)
})

/**
 * @swagger
 * /v1/locadora/classificacao/{id}:
 *   put:
 *     summary: Atualiza uma classificação existente
 *     tags: [Classificação]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Livre"
 *                 description: Nome da classificação indicativa
 *     responses:
 *       200:
 *         description: Classificação atualizado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */

router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
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
})

/**
 * @swagger
 * /v1/locadora/classificacao/{id}:
 *   delete:
 *     summary: Exclui uma classificação do banco de dados
 *     tags: [Classificação]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Classificação excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */

router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let classificacao = await controllerClassificacao.excluirClassificacao(id)

    response.status(classificacao.status_code)
    response.json(classificacao)
})

module.exports = router