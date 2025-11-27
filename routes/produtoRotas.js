import { Router } from "express";
import { listarProdutos, buscarProdutoPorId, criarProduto, atualizarProduto, deletarProduto } from "../controllers/produtoControle.js";

const router = Router();

router.post("/Lprodutos", criarProduto);
router.get("/produtos", listarProdutos);
router.get("/Lprodutos/:id", buscarProdutoPorId);
router.put("/Lprodutos/:id", atualizarProduto);
router.delete("/Lprodutos/:id", deletarProduto);

export default router;
