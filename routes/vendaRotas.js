import { Router } from "express";
import { registarVenda, listarVendas } from "../controllers/vendaControle.js";
import Produto from "../models/Produto.js";
import { buscarProdutoPorNome } from "../controllers/produtoControle.js";

const router = Router();

router.post("/vendas", registarVenda);
router.get("/vendas", listarVendas);
router.get("/produto/nome/buscar", buscarProdutoPorNome);
router.get("/verificadorEstoque/:id", async (req, res) =>{
    try {
        const produto = await Produto.findById(req.params.id)

        if (!produto) return res.status(404).json({error: "Produto não encontrado❌"});

        res.json({
            nome: produto.nome,
            preco: produto.preco,
            estoque: produto.quantidade
        });
    } catch (err) {
        res.status(500).json({error: "Erro ao consultar estoque❌"});
    }
});

export default router;
