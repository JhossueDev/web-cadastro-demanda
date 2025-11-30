import mongoose from "mongoose";
import { type } from "os";

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

    cliente: {
        type: String,
        required: true
    },

    data: {
        type: String,
        required: true
    }
});

export default mongoose.model("Venda", vendaSchema);