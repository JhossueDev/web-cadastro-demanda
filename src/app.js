import express from "express"
import Produto from "../models/Produto.js"

//indicar para o express ler body com JSON
const app = express()

app.use(express.json())



//Função para retornar o objeto por id
function buscarProdutoPorId(id){
    return ListaProdutos.filter(produto => produto.id == id)
}

//Função para pegar a posição do elemento no array por id
function buscarIndexProdutos(id){
    return ListaProdutos.findIndex(produto => produto.id == id)
}

//Rota padrão 
app.get("/", (req,res) => {
    res.send("Testando o node js")
})

//Lista dos produtos
app.get("/Lprodutos", async (req, res) =>{
    try {
        const produtos = await Produto.find();
        res.status(200).send(produtos);
    } catch (error) {
        res.status(500).json({massage: "Erro ao buscar produto ", error});
    }
})

//Faz a busca pelo id
app.get("/Lprodutos/:id", async (req, res) =>{
    try {
        const produto = await Produto.findById(req.params.id)
        if (!produto) {
            return res.status(404).json({massage: "Produto não encontrado."});
        }
        res.status(200).json(produto);
    } catch (error) {
        return res.status(500).json({massage: "Erro ao encontrar produto", error});
    }
});

//Post para criar ou adicionar produto
app.post("/Lprodutos", async (req, res) =>{
    try {
        const novoProduto = await Produto.create(req.body)
        res.status(201).send(novoProduto)
    } catch (error) {
        res.status(400).send({massage:"Erro ao cadastrar produto", error})
    }
})

//Para deletar algum produto
app.delete("/Lprodutos/:id", (req, res) =>{
    let index = buscarIndexProdutos(req.params.id)
    ListaProdutos.splice(index, 1)
    res.send(`"Produto com id: ${req.params.id} removido co sucesso!"`)
})

//para atualizar produto
app.put("/Lprodutos/:id", (req, res) => {
    let index = buscarIndexProdutos(req.params.id)
    ListaProdutos[index].produtos = req.body.produtos
    ListaProdutos[index].grupo = req.body.grupo
    res.json(ListaProdutos)
})

export default app
