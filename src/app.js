import express from "express";
import produtoRotas from "../routes/produtoRotas.js";

const app = express();

app.use(express.json());
app.use(produtoRotas);

export default app;
