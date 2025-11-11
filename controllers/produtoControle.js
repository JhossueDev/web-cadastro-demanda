import Produto from "../models/Produto.js";

// Lista dos produtos
export const listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos❌", error });
    }
};

//Faz a busca por ID 
export const buscarProdutoPorId = async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado.❌" });
        }
        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produto❌", error });
    }
};

//Post para criar ou adicionar produto
export const criarProduto = async (req, res) => {
    try {
        const novoProduto = await Produto.create(req.body);
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(400).json({ message: "Erro ao cadastrar produto❌", error });
    }
};

//para atualizar produto
export const atualizarProduto = async (req, res) => {
    try {
        const produtoAtualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!produtoAtualizado) {
            return res.status(404).json({ message: "Produto não encontrado!❌" });
        }
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar produto❌", error });
    }
};

//Para deletar algum produto
export const deletarProduto = async (req, res) => {
    try {
        const produtoDeletado = await Produto.findByIdAndDelete(req.params.id);
        if (!produtoDeletado) {
            return res.status(404).json({ message: "Produto não encontrado!❌" });
        }
        res.status(200).json({ message: "Produto removido com sucesso!✅", produtoDeletado });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover produto❌", error });
    }
};
