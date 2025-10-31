const express = require("express")
const app = express()
const port = 3333

//estou criando a rota padrão ou raiz
app.get("/", (req,res) => {
    res.send("Testando o node js")
})

//escutar a porta 3333
app.listen(port, () => {
    console.log(`Servidor rodando no endereço http://localhost:${port}`) 
})
