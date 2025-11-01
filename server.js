import app from "./src/app.js"

const PORT = 3333

//escutar a porta 3333
app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço http://localhost:${PORT}`) 
})
