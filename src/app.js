import express from "express"

//indicar para o express ler body com JSON
const app = express()

app.use(express.json())

//mock
const ListaProdutos =[
    {id: 1, produtos: "Air max TN purple", grupo: "Tênis"},
    {id: 2, produtos: "Air max TN pimento", grupo: "Tênis"},
    {id: 3, produtos: "Air max TN wolrd", grupo: "Tênis"},
    {id: 4, produtos: "Air max TN metalic", grupo: "Tênis"}
]

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
app.get("/Lprodutos", (req, res) =>{
    res.status(200).send(ListaProdutos)
})

//Faz a busca pelo id
app.get("/Lprodutos/:id", (req, res) =>{
    res.json(buscarProdutoPorId(req.params.id))
})

//Post para criar ou adicionar produto
app.post("/Lprodutos", (req, res) =>{
    ListaProdutos.push(req.body)
    res.status(201).send("Produto cadastrado com sucesso!")
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
