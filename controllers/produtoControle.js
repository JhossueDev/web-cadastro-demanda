import Produto from "../models/Produto.js";

export const buscarProdutoPorNome = async (req, res) =>{
    try {
        const nome = req.query.nome;

        if (!nome) {
            return res.status(400).json({message: "Nome do produto é obrigatório!❌"});
        }

        const produto = await Produto.findOne({nome: { $regex: nome, $options: "i"}});

        if (!produto) {
            return res.status(404).json({message: "Produto não encontrado.❌"});
        }
        res.json(produto);
    } catch (error) {
        res.status(500).json({message: "Erro no servidor ao buscar por nome.❌"})
    }
}

//Post para criar ou adicionar produto
export const criarProduto = async (req, res) => {
    try {
        const {nome} = req.body;

        //verifica se já existe produto com esse nome
        const produtoExiste = await Produto.findOne({
            nome: { $regex: `^${nome}$`, $options: "i"}//faz a comparçaõ ignorando maiusculo/minusculo
        });

        if (produtoExiste) {
            return res.status(409).json({ message: "Esse produto já está cadastrado❌"});
        }

        const novoProduto = await Produto.create(req.body);
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(400).json({ message: "Erro ao cadastrar produto❌", error });
    }
};

// Lista dos produtos
export const listarProdutos = async (req, res) => {
    try {
        const nome = req.query.nome;

        if (nome) {
            const produtos = await Produto.find({
                nome: {$regex: nome, $options: "i"}
            });

            return res.json(produtos);
        }

        const todos = await Produto.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({error: "Erro ao listar os produtos!❌"});
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
