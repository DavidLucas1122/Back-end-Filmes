const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const controllerFilme = require('../controller/filme/controller_filme.js')

const bodyParserJSON = bodyParser.json()

/**
 * @swagger
 * tags:
 *   name: Filmes
 *   description: Rotas relacionadas aos filmes
 */

/**
 * @swagger
 * /v1/locadora/filme:
 *   get:
 *     summary: Retorna a lista de todos os filmes
 *     tags: [Filmes]
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 *       404:
 *          description: Não foram encontrados dados de retorno
 *       500:
 *          description: Erro interno do servidor
 */


//Retorna a lista de filmes
router.get('/', cors(), async function (request, response) {
    //Chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()

    console.log(filme)
    response.status(filme.status_code)
    response.json(filme)
})

/**
 * @swagger
 * /v1/locadora/filme/{id}:
 *   get:
 *     summary: Retorna um filme pelo ID
 *     tags: [Filmes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do filme
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme encontrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       404:
 *         description: Não foram encontrados dados de retorno
 *       500:
 *         description: Erro interno do servidor
 */

//Retorna um filme filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {

    //Recebe o ID enviado na requisição via parâmetro
    let idFilme = request.params.id

    //Chama a função da controller para retornar o filme
    let filme = await controllerFilme.buscarFilmeID(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

/**
 * @swagger
 * /v1/locadora/filme:
 *   post:
 *     summary: Cadastra um novo filme
 *     tags: [Filmes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Vingadores: Ultimato"
 *                 description: Nome do Filme
 *               sinopse:
 *                 type: string
 *                 example: "Os Vingadores se unem para reverter o estalo de Thanos e salvar o universo."
 *                 description: Sinopse do filme
 *               data_lancamento:
 *                 type: string
 *                 format: date
 *                 example: "2019-04-25"
 *                 description: Data de lançamento do filme
 *               duracao:
 *                 type: string
 *                 example: "3h 1m"
 *                 description: Duração total do filme
 *               orcamento:
 *                 type: number
 *                 format: float
 *                 example: 250000000.50
 *                 description: Valor do orçamento do filme (em reais)
 *               trailer:
 *                 type: string
 *                 example: "https://youtube.com/watch?v=TcMBFSGVi1c"
 *                 description: Link do trailer oficial
 *               capa:
 *                 type: string
 *                 example: "https://exemplo.com/capas/vingadores-ultimato.jpg"
 *                 description: URL da imagem da capa do filme
 *     responses:
 *       201:
 *         description: Filme cadastrado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */


// Recebe um novo filme BD
router.post('/', cors(), bodyParserJSON, async function (request, response) {
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //Chama a função da controller para inserir o filme, anviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)
    response.status(filme.status_code)
    response.json(filme)
})

/**
 * @swagger
 * /v1/locadora/filme/{id}:
 *   put:
 *     summary: Atualiza um filme existente
 *     tags: [Filmes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Vingadores: Ultimato"
 *                 description: Nome do Filme
 *               sinopse:
 *                 type: string
 *                 example: "Os Vingadores se unem para reverter o estalo de Thanos e salvar o universo."
 *                 description: Sinopse do filme
 *               data_lancamento:
 *                 type: string
 *                 format: date
 *                 example: "2019-04-25"
 *                 description: Data de lançamento do filme
 *               duracao:
 *                 type: string
 *                 example: "3h 1m"
 *                 description: Duração total do filme
 *               orcamento:
 *                 type: number
 *                 format: float
 *                 example: 250000000.50
 *                 description: Valor do orçamento do filme (em reais)
 *               trailer:
 *                 type: string
 *                 example: "https://youtube.com/watch?v=TcMBFSGVi1c"
 *                 description: Link do trailer oficial
 *               capa:
 *                 type: string
 *                 example: "https://exemplo.com/capas/vingadores-ultimato.jpg"
 *                 description: URL da imagem da capa do filme
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       400:
 *         description: Atributos inválidos
 *       500:
 *         description: Erro interno do servidor
 *       415:
 *          description: Formato inválido de requisição
 */

//Atualiza um filme no BD
router.put('/:id', cors(), bodyParserJSON, async function (request, response) {
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
})

/**
 * @swagger
 * /v1/locadora/filme/{id}:
 *   delete:
 *     summary: Exclui um filme do banco de dados
 *     tags: [Filmes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *       500:
 *         description: Erro interno do servidor
 */

router.delete('/:id', cors(), async function (request, response) {
    let id = request.params.id

    // Chama a função da controller
    let filme = await controllerFilme.excluirFilme(id)

    response.status(filme.status_code)
    response.json(filme)
})

module.exports = router