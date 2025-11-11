const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerNacionalidade = require('../controller/nacionalidade/controller_nacionalidade.js')

const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Nacionalidade
 *   description: Rotas relacionadas a nacionalidades
 */

/**
 * @swagger
 * /v1/locadora/nacionalidade:
 *   get:
 *     summary: Retorna a lista de todas as nacionalidade
 *     tags: [Nacionalidade]
 *     responses:
 *       200:
 *         description: Lista de nacionalidade retornada com sucesso
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna a lista de nacionalidades
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos as nacionalidades
    let nacionalidade = await controllerNacionalidade.listarNacionalidades()

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

/**
 * @swagger
 * /v1/locadora/nacionalidade/{id}:
 *   get:
 *     summary: Retorna uma nacionalidade pelo ID
 *     tags: [Nacionalidade]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da nacionalidade
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nacionalidade encontradao com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */


//Retorna uma nacionalidade filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idNacionalidade = request.params.id

    //Chama a função da controller para retornar a nacionalidade
    let nacionalidade = await controllerNacionalidade.buscarNacionalidadeId(idNacionalidade)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

/**
 * @swagger
 * /v1/locadora/nacionalidade:
 *   post:
 *     summary: Cadastra uma nova nacionalidade
 *     tags: [Nacionalidade]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Brasileira"
 *                 description: Nome do nacionalidade
 *               sigla:
 *                  type: string
 *                  example: "BR"
 *                  description: Sigla da Nacionalidade
 *     responses:
 *       201:
 *         description: Nacionalidade cadastrada com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 */

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

/**
 * @swagger
 * /v1/locadora/nacionalidade/{id}:
 *   put:
 *     summary: Atualiza uma nacionalidade existente
 *     tags: [Nacionalidade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da nacionalidade a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Brasileira"
 *                 description: Nome da nacionalidade
 *               sigla:
 *                 type: string
 *                 example: "BR"
 *                 description: Sigla da nacionalidade
 *     responses:
 *       200:
 *         description: Nacionalidade atualizada com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *         description: Formato inválido de requisição
 */
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

/**
 * @swagger
 * /v1/locadora/nacionalidade/{id}:
 *   delete:
 *     summary: Exclui uma nacionalidade do banco de dados
 *     tags: [Nacionalidade]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nacionalidade excluída com sucesso
 *       500:
 *         description: Erro interno do servidor
 */


router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let nacionalidade = await controllerNacionalidade.excluirNacionalidade(id)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

module.exports = router