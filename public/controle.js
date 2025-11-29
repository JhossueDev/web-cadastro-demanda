import Produto from "../models/Produto";

export const listaProdutos = async(req, res) =>{
    try {
        const nome = req.query.nome;

        if (nome) {
            const produtos = await Produto.find({
                nome: {$regex: nome, $options: "i"}
            });
            return res.json(produtos);
        }
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({error: "Erro ao listar os produtos❌"})
    }  
};