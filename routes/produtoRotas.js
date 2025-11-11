import { Router } from "express";
import { listarProdutos, buscarProdutoPorId, criarProduto, atualizarProduto, deletarProduto } from "../controllers/produtoControle.js";

const router = Router();

router.get("/Lprodutos", listarProdutos);
router.get("/Lprodutos/:id", buscarProdutoPorId);
router.post("/Lprodutos", criarProduto);
router.put("/Lprodutos/:id", atualizarProduto);
router.delete("/Lprodutos/:id", deletarProduto);

export default router;
