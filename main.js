/**
 * Processo principal 
 * Estudo do CRUD com mongodb
 */

// Importação do modulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')
const Clientes = require('./src/models/Clientes.js')

// Importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

// Importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
        // a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso")

    } catch (error) {
        // Tratamento de exceções especificas
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} ja esta cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// CRUD - Read - Função para listar todos os clientes cadastrados
const listarCliente = async () => {
    try {
        // A linha abaixo lista todos os clientes cadastrados por ordem alfabetica
        const cliente = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(cliente)
    } catch (error) {
        console.log(error)
    }
}

// CRUD - Read - Função para buscar um cliente especifico
const buscarCliente = async (nome) => {
    try {
        // find() buscar
        // nomecliente: new RegExp(nome)  filtro pelo nome
        // i insensitive (ignorar letras maiusculas ou minusculas)
        const cliente = await clienteModel.find({ nomeCliente: new RegExp(nome, 'i') })

        // calcular a similaridade entre os nomes retomados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        // validação se não existir o cliente pesquisado
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)

            // Cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)

            //Formatação da data
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpf: melhorCliente.cpf,
                dataCadastro: melhorCliente.dataCadastro.toLocaleDateString("pt-BR")
            }
            console.log(clienteFormatado)  
        }
    } catch (error) {
        console.log(error)
    }
}

// execução da aplicação
const app = async () => {
    await conectar()
    // CRUD - Create
    //await criarCliente("Patrick Silva", "11971263806", "687.998.710-55")

    // CRUD - Read (Exemplo 1 - Listar todos os clientes) 
    //await listarCliente()

    // CRUD - Read (Exemplo 2 - Buscar cliente)
    await buscarCliente("patrick")

    await desconectar()
}
console.clear()
app()
