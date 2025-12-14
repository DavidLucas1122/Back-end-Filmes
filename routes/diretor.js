const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerDiretor = require('../controller/diretor/controller_diretor.js')

const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Diretor
 *   description: Rotas relacionadas aos diretores
 */

/**
 * @swagger
 * /v1/locadora/diretor:
 *   get:
 *     summary: Retorna a lista de todos os diretores
 *     tags: [Diretor]
 *     responses:
 *       200:
 *         description: Lista de diretores retornada com sucesso
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna a lista de diretores
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os diretores
    let diretor = await controllerDiretor.listarDiretores()

    response.status(diretor.status_code)
    response.json(diretor)
})

/**
 * @swagger
 * /v1/locadora/diretor/{id}:
 *   get:
 *     summary: Retorna um diretor pelo ID
 *     tags: [Diretor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do diretor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Diretor encontrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Diretor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna um diretor filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idDiretor = request.params.id

    //Chama a função da controller para retornar o diretor
    let diretor = await controllerDiretor.buscarDiretorId(idDiretor)

    response.status(diretor.status_code)
    response.json(diretor)
})

/**
 * @swagger
 * /v1/locadora/diretor:
 *   post:
 *     summary: Cadastra um novo diretor
 *     tags: [Diretor]
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
 *                 description: Data de falecimento (caso o diretor ainda esteja vivo, pode ser nulo)
 *               genero:
 *                 type: string
 *               foto:
 *                 nullable: true
 *                 type: string
 *                 description: URL da imagem do diretor
 *     responses:
 *       201:
 *         description: Diretor cadastrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */

//Novo diretor
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o diretor, anviamos os dados do body e o content-type
    let diretor = await controllerDiretor.inserirDiretor(dadosBody, contentType)
    response.status(diretor.status_code)
    response.json(diretor)
})

/**
 * @swagger
 * /v1/locadora/diretor/{id}:
 *   put:
 *     summary: Atualiza um diretor existente
 *     tags: [Diretor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do diretor a ser atualizado
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
 *         description: Diretor atualizado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */

//Atualizar Diretor
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
    //Recebe os dados do body
    let dadosBody = request.body

    //Recebe o id do diretor encaminhado pela URL
    let idDiretor = request.params.id
    //Recebe o content-type da requisição 
    let contentType = request.headers['content-type']

    //Chama a função para atualizar o diretor
    let diretor = await controllerDiretor.atualizarDiretor(dadosBody, idDiretor, contentType)

    response.status(diretor.status_code)
    response.json(diretor)
})

/**
 * @swagger
 * /v1/locadora/diretor/{id}:
 *   delete:
 *     summary: Exclui um diretor do banco de dados
 *     tags: [Diretor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Diretor excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */

router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let diretor = await controllerDiretor.excluirDiretor(id)

    response.status(diretor.status_code)
    response.json(diretor)
})

module.exports = router