import { PythonShell } from "python-shell";
import Venda from "../models/vendaModel.js";

export const previsaoGeral = async (req, res) => {
  try {
    const vendas = await Venda.find();

    const pyshell = new PythonShell("./python/previsao_geral.py", {
      mode: "text",
      pythonOptions: ["-u"]
    });

    pyshell.send(JSON.stringify(vendas));

    pyshell.on("message", (msg) => {
      return res.json(JSON.parse(msg));
    });

    pyshell.on("error", (err) => {
      return res.status(500).json({ error: err.message });
    });

    pyshell.end((err) => {
      if (err) return res.status(500).json({ error: err.message });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const previsaoPorProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const vendas = await Venda.find({ produtoId: id });

    const pyshell = new PythonShell("./python/previsao_produto.py", {
      mode: "text",
      pythonOptions: ["-u"]
    });

    pyshell.send(JSON.stringify({
      produtoId: id,
      vendas: vendas
    }));

    pyshell.on("message", (msg) => {
      return res.json(JSON.parse(msg));
    });

    pyshell.on("error", (err) => {
      return res.status(500).json({ error: err.message });
    });

    pyshell.end((err) => {
      if (err) return res.status(500).json({ error: err.message });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
