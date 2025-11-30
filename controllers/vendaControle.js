import Produto from '../models/Produto.js';
import Venda from '../models/vendaModel.js';

export const registarVenda = async (req, res) =>{
    try {
        const {produtoId, quantidade, data} = req.body;

        if (!produtoId || !quantidade) {
            return res.status(400).json({error: "produtoId e quantidade são obrigatórios."});
        }

        //confere se o produto existe
        const produto = await Produto.findById(produtoId);
        if (!produto) {
            return res.status(404).json({erro: "Produto não encontrado.❌"})
        };

        //diminiu o estoque
        produto.quantidade -= quantidade;
        await produto.save();

        //cria uma venda
        const venda = await Venda.create({
            produtoId,
            nomeProduto: produto.nome,
            precoUnitario: produto.preco,
            quantidade,
            data: data || new Date()
        });
        res.status(201).json(venda);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const listarVendas = async (req, res) =>{
    try {
        const vendas = await Venda.find();
        res.json(vendas);
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};
