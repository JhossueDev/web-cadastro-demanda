import { Router } from "express";
import { registarVenda, listarVendas } from "../controllers/vendaControle.js";

const router = Router();

router.post("/vendas", registarVenda);
router.get("/vendas", listarVendas);

export default router;
