import mongoose from "mongoose";

const ProdutoSchema = new mongoose.Schema({
    produto:{type: String, required: true},
    grupo: {type:String, required: true},
    preco: {type: Number, required: true}
}, {
    timestamps : true
});

const Produto = mongoose.model("Produto", ProdutoSchema);
 export default Produto;