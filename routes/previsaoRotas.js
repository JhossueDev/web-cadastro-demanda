import { Router } from "express";
import { previsaoGeral, previsaoPorProduto } from "../controllers/previsaoControle.js";

const rota = Router();

rota.get("/previsao/geral", previsaoGeral);
rota.get("/previsao/produto/:id", previsaoPorProduto);

export default rota;
