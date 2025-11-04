import express from "express"

const app = express()
//indicar para o express ler body com JSON

app.use(express.json())

//mock
const ListaProdutos =[
    {id: 1, produtos: "Air max TN purple", grupo: "Tênis"},
    {id: 2, produtos: "Air max TN pimento", grupo: "Tênis"},
    {id: 3, produtos: "Air max TN wolrd", grupo: "Tênis"},
    {id: 4, produtos: "Air max TN metalic", grupo: "Tênis"}
]

//retornar o objeto por id
function buscarProdutoPorId(id){
    return ListaProdutos.filter(produto => produto.id == id)
}

//pegar a posição do elemento no array por id
function buscarIndexProdutos(id){
    return ListaProdutos.findIndex(produto => produto.id == id)
}

//estou criando a rota padrão ou raiz
app.get("/", (req,res) => {
    res.send("Testando o node js")
})

app.get("/Lprodutos", (req, res) =>{
    res.status(200).send(ListaProdutos)
})

app.get("/produtos/:id", (req, res) =>{
    res.json(buscarProdutoPorId(req.params.id))
})

app.post("/Lprodutos", (req, res) =>{
    ListaProdutos.push(req.body)
    res.status(201).send("Produto cadastrado com sucesso!")
})

app.delete("/produtos/:id", (req, res) =>{
    let index = buscarIndexProdutos(req.params.id)
    ListaProdutos.splice(index, 1)
    res.send(`"Produto com id: ${req.params.id} removido co sucesso!"`)
})

export default app
