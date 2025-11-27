import express from "express";
import cors from "cors";
import produtoRotas from "../routes/produtoRotas.js";
import vendaRotas from "../routes/vendaRotas.js";
import previsaoRotas from "../routes/previsaoRotas.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

//rota principal
app.get("/", (req, res) =>{
    res.sendFile(path.join(_dirname, "../views/index.html"));
});

app.get("/cadastro", (req, res) =>{
    res.sendFile(path.join(_dirname, "../views/cadastro.html"));
});

app.get("/vendas", (req, res) =>{
    res.sendFile(path.join(_dirname, "../views/vendas.html"));
});

app.get("/projecao", (req, res) =>{
    res.sendFile(path.join(_dirname, "../views/projecao.html"))
});

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(previsaoRotas);
app.use(produtoRotas);
app.use(vendaRotas);

export default app;
