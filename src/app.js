import express from "express";
import cors from "cors";
import produtoRotas from "../routes/produtoRotas.js";
import vendaRotas from "../routes/vendaRotas.js";
import previsaoRotas from "../routes/previsaoRotas.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(previsaoRotas);
app.use(produtoRotas);
app.use(vendaRotas);

export default app;
