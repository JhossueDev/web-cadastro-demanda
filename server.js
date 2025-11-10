import app from "./src/app.js"
import connectDB from "./config/db.js"
import dotenv from "dotenv";

dotenv.config()

const PORT = 3333

//chamndo a função criada para a rota principal
connectDB();

//escutar a porta 3333
app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço http://localhost:${PORT}`);
})
