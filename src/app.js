import express from "express"

const app = express()

//mock
const ListaProdutos =[
    {id: 1, produtos: "Air max TN purple", grupo: "Tênis"},
    {id: 2, produtos: "Air max TN pimento", grupo: "Tênis"},
    {id: 3, produtos: "Air max TN wolrd", grupo: "Tênis"},
    {id: 4, produtos: "Air max TN metalic", grupo: "Tênis"}
]
//estou criando a rota padrão ou raiz
app.get("/", (req,res) => {
    res.send("Testando o node js")
})

app.get("/Lprodutos", (req, res) =>{
    res.status(200).send(ListaProdutos)
})

export default app
