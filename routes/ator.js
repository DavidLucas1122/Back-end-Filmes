const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerAtor = require('../controller/ator/controller_ator')
const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Ator
 *   description: Rotas relacionadas a atores
 */

/**
 * @swagger
 * /v1/locadora/ator:
 *   get:
 *     summary: Retorna a lista de todas as ator
 *     tags: [Ator]
 *     responses:
 *       200:
 *         description: Lista de atores retornada com sucesso
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna a lista de atores
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os atores
    let ator = await controllerAtor.listarAtores()

    response.status(ator.status_code)
    response.json(ator)
})

/**
 * @swagger
 * /v1/locadora/ator/{id}:
 *   get:
 *     summary: Retorna uma ator pelo ID
 *     tags: [Ator]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da ator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ator encontrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna um ator filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idAtor = request.params.id

    //Chama a função da controller para retornar o ator
    let ator = await controllerAtor.buscarAtorId(idAtor)

    response.status(ator.status_code)
    response.json(ator)
})

/**
 * @swagger
 * /v1/locadora/ator:
 *   post:
 *     summary: Cadastra um novo ator
 *     tags: [Ator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               data_falecimento:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 description: Data de falecimento (caso o ator ainda esteja vivo, pode ser nulo)
 *               genero:
 *                 type: string
 *               foto:
 *                 nullable: true
 *                 type: string
 *                 description: URL da imagem do ator
 *     responses:
 *       201:
 *         description: Ator cadastrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */


//Novo ator
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o ator, anviamos os dados do body e o content-type
    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)
    response.status(ator.status_code)
    response.json(ator)
})

/**
 * @swagger
 * /v1/locadora/ator/{id}:
 *   put:
 *     summary: Atualiza um ator existente
 *     tags: [Ator]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               data_falecimento:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               genero:
 *                 type: string
 *               foto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ator atualizado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */

//Atualizar Ator
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do ator encaminhado pela URL
    let idAtor = request.params.id
    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar a nacionalidade
    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

/**
 * @swagger
 * /v1/locadora/ator/{id}:
 *   delete:
 *     summary: Exclui um ator do banco de dados
 *     tags: [Ator]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ator excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */

router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let ator = await controllerAtor.excluirAtor(id)

    response.status(ator.status_code)
    response.json(ator)
})

module.exports = router