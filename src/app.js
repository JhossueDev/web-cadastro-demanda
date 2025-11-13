import express from "express";
import produtoRotas from "../routes/produtoRotas.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(produtoRotas);

export default app;
