import express from "express"
import Produto from "../models/Produto.js"

//indicar para o express ler body com JSON
const app = express()

app.use(express.json())


//Rota padrão 
app.get("/", (req,res) => {
    res.send("Testando o node js")
})

//Lista dos produtos
app.get("/Lprodutos", async (req, res) =>{
    try {
        const produtos = await Produto.find();
        res.status(200).send(produtos);
    } catch (error) {
        res.status(500).json({massage: "Erro ao buscar produto ", error});
    }
})

//Faz a busca pelo id
app.get("/Lprodutos/:id", async (req, res) =>{
    try {
        const produto = await Produto.findById(req.params.id)
        if (!produto) {
            return res.status(404).json({massage: "Produto não encontrado."});
        }
        res.status(200).json(produto);
    } catch (error) {
        return res.status(500).json({massage: "Erro ao encontrar produto", error});
    }
});

//Post para criar ou adicionar produto
app.post("/Lprodutos", async (req, res) =>{
    try {
        const novoProduto = await Produto.create(req.body)
        res.status(201).send(novoProduto)
    } catch (error) {
        res.status(400).send({massage:"Erro ao cadastrar produto", error})
    }
})

//Para deletar algum produto
app.delete("/Lprodutos/:id", async (req, res) =>{
    try {
        const produtoDeletado = await Produto.findByIdAndDelete(req.params.id);

        if (!produtoDeletado) {
            return res.status(404).json({message: "Produto não encontrado!❌"});
        }

        return res.status(200).json({message: "Produto removido com sucesso!✅",
            produto: produtoDeletado
        });

    } catch (error) {
        return res.status(500).json({message: "Erro ao remover produto.❌", error});
    }

});

//para atualizar produto
app.put("/Lprodutos/:id", async (req, res) => {
    try {
        const produtoAtualizado = await Produto.findByIdAndUpdate(req.params.id,req.body,{new:true});

        if (!produtoAtualizado) {
            return res.status(404).json({message: "Produto não encontrado!"});
        }

        res.status(200).json(produtoAtualizado);

    } catch (error) {
        return res.status(500).json({message: "Erro ao atualizar produto."});
    }
});

export default app
