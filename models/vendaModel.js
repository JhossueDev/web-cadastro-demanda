import mongoose from "mongoose";

const vendaSchema = new mongoose.Schema({
    produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
        required: true
    },

    nomeProduto: {
        type: String,
        required: true
    },

    precoUnitario: {
        type: Number,
        required: true
    },

    quantidade: {
        type: Number,
        required: true
    },
    
    data: {
        type: String,
        required: true
    }
});

export default mongoose.model("Venda", vendaSchema);