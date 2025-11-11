const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerGenero = require('../controller/genero/controller_genero.js')

const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Gênero
 *   description: Rotas relacionadas a gêneros
 */

/**
 * @swagger
 * /v1/locadora/genero:
 *   get:
 *     summary: Retorna a lista de todos os gêneros
 *     tags: [Gênero]
 *     responses:
 *       200:
 *         description: Lista de gêneros retornada com sucesso
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retornar lista de gêneros
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os gêneros
    let genero = await controllerGenero.listarGeneros()

    console.log(genero)
    response.status(genero.status_code)
    response.json(genero)
})

/**
 * @swagger
 * /v1/locadora/genero/{id}:
 *   get:
 *     summary: Retorna uma gênero pelo ID
 *     tags: [Gênero]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da gênero
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gênero encontradao com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna um gênero filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idGenero = request.params.id

    //Chama a função da controller para retornar o filme
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)
})

/**
 * @swagger
 * /v1/locadora/genero:
 *   post:
 *     summary: Cadastra um novo gênero
 *     tags: [Gênero]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Terror"
 *                 description: Nome do gênero
 *     responses:
 *       201:
 *         description: Gênero cadastrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 */

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

/**
 * @swagger
 * /v1/locadora/genero/{id}:
 *   put:
 *     summary: Atualiza uma gênero existente
 *     tags: [Gênero]
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
 *                 example: "Terror"
 *                 description: Nome do gênero
 *     responses:
 *       200:
 *         description: Gênero atualizado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */

//Atualiza um Genero
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do genero encaminhado pela URL
    let idGenero = request.params.id

    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o genero 
    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    response.status(genero.status_code)
    response.json(genero)
})

/**
 * @swagger
 * /v1/locadora/genero/{id}:
 *   delete:
 *     summary: Exclui uma gênero do banco de dados
 *     tags: [Gênero]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gênero excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */

//Deleta um gênero
router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let genero = await controllerGenero.excluirGenero(id)

    response.status(genero.status_code)
    response.json(genero)
})

module.exports = router