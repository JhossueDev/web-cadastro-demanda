import mongoose from "mongoose";

//Criando uma função para conectar o banco de dados
async function connectDB () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONECTADO COM SUCESSO!✅");
    } catch (error) {
        console.log("NÃO FOI POSSIVEL SE CONECTAR!❌", error);
    }
}

export default connectDB;
