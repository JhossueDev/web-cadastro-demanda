import { Router } from "express";
import Produto from "../models/Produto.js";
import {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto
} from "../controllers/produtoControle.js";

const router = Router();

//lista os produtos
router.get("/produtos", listarProdutos);
//faz a busca por ID
router.get("/produtos/:id", buscarProdutoPorId);
//cria produto
router.post("/produtos", criarProduto);
//atualiza o produto
router.put("/produtos/:id", atualizarProduto);
//deleta o produto
router.delete("/produtos/:id", deletarProduto);
//verifica o estoque
router.get("/verificarEstoque/:id", async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);

        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado❌" });
        }

        res.json({
            nome: produto.nome,
            preco: produto.preco,
            estoque: produto.quantidade
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao consultar estoque.❌" });
    }
});

export default router;
