const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerPersonagem = require('../controller/personagem/controller_personagem.js')

const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Personagem
 *   description: Rotas relacionadas a personagens
 */

/**
 * @swagger
 * /v1/locadora/personagens:
 *   get:
 *     summary: Retorna a lista de todos os personagens
 *     tags: [Personagem]
 *     responses:
 *       200:
 *         description: Lista de personagem retornada com sucesso
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna a lista de personagem
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os personagens
    let personagem = await controllerPersonagem.listarPersonagens()

    console.log(personagem)
    response.status(personagem.status_code)
    response.json(personagem)
})

/**
 * @swagger
 * /v1/locadora/personagem/{id}:
 *   get:
 *     summary: Retorna uma personagem pelo ID
 *     tags: [Personagem]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da personagem
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Personagem encontradao com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna um personagem filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idPersonagem = request.params.id

    //Chama a função da controller para retornar o personagem
    let personagem = await controllerPersonagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)
})

/**
 * @swagger
 * /v1/locadora/personagem:
 *   post:
 *     summary: Cadastra uma nova personagem
 *     tags: [Personagem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Peter Parker"
 *                 description: Nome da personagem
 *               genero:
 *                 type: string
 *                 example: "Masculino"
 *                 description: Gênero da personagem
 *               idade:
 *                 type: integer
 *                 nullable: true
 *                 example: 25
 *                 description: Idade da personagem (pode ser nula)
 *               imagem:
 *                 type: string
 *                 nullable: true
 *                 example: "https://exemplo.com/imagem.jpg"
 *                 description: URL da imagem da personagem (pode ser nula)
 *     responses:
 *       201:
 *         description: Personagem cadastrada com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 */

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

/**
 * @swagger
 * /v1/locadora/personagem/{id}:
 *   put:
 *     summary: Atualiza uma personagem existente
 *     tags: [Personagem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da personagem a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Peter Parker"
 *                 description: Nome da personagem
 *               genero:
 *                 type: string
 *                 example: "Masculino"
 *                 description: Gênero da personagem
 *               idade:
 *                 type: integer
 *                 nullable: true
 *                 example: 25
 *                 description: Idade da personagem (pode ser nula)
 *               imagem:
 *                 type: string
 *                 nullable: true
 *                 example: "https://exemplo.com/imagem.jpg"
 *                 description: URL da imagem da personagem (pode ser nula)
 *     responses:
 *       200:
 *         description: Personagem atualizada com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Personagem não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

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

/**
 * @swagger
 * /v1/locadora/personagem/{id}:
 *   delete:
 *     summary: Exclui uma personagem do banco de dados
 *     tags: [Personagem]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Personagem excluída com sucesso
 *       500:
 *         description: Erro interno do servidor
 */

//Deleta um pesonagem
router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let personagem = await controllerPersonagem.excluirPersonagem(id)

    response.status(personagem.status_code)
    response.json(personagem)
})


module.exports = router