//autocomplete do nome
const inputNome = document.getElementById("nomeProduto");

//cria a lista de sugestões
const listaSugestoes = document.createElement("ul");
listaSugestoes.id = "listaSugestoes";
listaSugestoes.style.listStyle = "none";
listaSugestoes.style.padding = "0";
listaSugestoes.style.marginTop = "5px";
listaSugestoes.style.border = "1px solid #ccc";
listaSugestoes.style.borderRadius = "4px";
listaSugestoes.style.maxHeight = "140px";
listaSugestoes.style.overflowY = "auto";
listaSugestoes.style.display = "none";

inputNome.parentNode.appendChild(listaSugestoes);

let produtoEditandoId = null;

//faz busca enquanto digita
inputNome.addEventListener("input", async () => {
    const query = inputNome.value.trim().toLowerCase();

    if (!query) {
        listaSugestoes.style.display = "none";
        listaSugestoes.innerHTML = "";
        return;
    }

    try {
        const response = await fetch("http://localhost:3333/api/produtos");
        const produtos = await response.json();

        const filtrados = produtos.filter(p =>
            p.nome.toLowerCase().includes(query)
        );

        if (filtrados.length === 0) {
            listaSugestoes.style.display = "none";
            listaSugestoes.innerHTML = "";
            return;
        }

        listaSugestoes.innerHTML = filtrados
            .map(p => `<li style="padding: 6px; cursor:pointer">${p.nome}</li>`)
            .join("");

        listaSugestoes.style.display = "block";

        [...listaSugestoes.children].forEach(li => {
            li.addEventListener("click", () => {
                inputNome.value = li.textContent;
                listaSugestoes.style.display = "none";
            });
        });

    } catch (err) {
        console.error("Erro ao buscar produtos", err);
    }
});

// esconde ao perder foco
inputNome.addEventListener("blur", () => {
    setTimeout(() => listaSugestoes.style.display = "none", 150);
});

//cadastro normal
document.getElementById("formProdutos").addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll("#formProdutos input");

    const produto = {
        nome: inputs[0].value,
        preco: Number(inputs[1].value),
        quantidade: Number(inputs[2].value)
    };

    let url = "http://localhost:3333/api/produtos";
    let method = "POST";

    if (produtoEditandoId) {
        url = `http://localhost:3333/api/produtos/${produtoEditandoId}`;
        method = "PUT";
    }

    try {
        const response = await fetch( url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                alert("Esse produto já existe na lista.❌")
            } else {
                alert("Erro ao cadastrar o produto!❌");
            }
            return;
        }

        if (method === "POST") {
            adicionarNaTabela(data)
            alert("Produto cadastrado com sucesso.✅");
        } else {
            atualizarLinhaTabela(data);
            alert("Produto atualizado com sucesso.✅")
            produtoEditandoId = null;
        }

        event.target.reset();

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar à API.❌");
    }
});

function adicionarNaTabela(produto) {
    const tabela = document.getElementById("listaProdutos");

    const tr = document.createElement("tr");
    tr.dataset.id = produto._id;

    tr.innerHTML = `
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>
            <button class="btn-editar">✏️ Editar</button>
            <button class="btn-excluir">🗑️ Excluir</button>
        </td>
    `;

    // Editar
    tr.querySelector(".btn-editar").addEventListener("click", () => {
        selecionarProduto(produto);
    });

    // Excluir
    tr.querySelector(".btn-excluir").addEventListener("click", async () => {
        if (!confirm("Deseja realmente excluir este produto?")) return;

        try {
            const response = await fetch(
                `http://localhost:3333/api/produtos/${produto._id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                alert("Erro ao excluir produto.❌");
                return;
            }

            tr.remove();
            alert("Produto excluído com sucesso!✅");
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Não foi possível conectar à API.❌");
        }
    });

    tabela.appendChild(tr);
}

function atualizarLinhaTabela(produto) {
    const tr = document.querySelector(`tr[data-id="${produto._id}"]`);
    if (!tr) return;

    tr.innerHTML = `
        <td>${produto.nome}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>
            <button class="btn-editar">✏️ Editar</button>
            <button class="btn-excluir">🗑️ Excluir</button>
        </td>
    `;

    // Editar
    tr.querySelector(".btn-editar").addEventListener("click", () => {
        selecionarProduto(produto);
    });

    // Excluir
    tr.querySelector(".btn-excluir").addEventListener("click", async () => {
        if (!confirm("Deseja realmente excluir este produto?")) return;

        try {
            const response = await fetch(
                `http://localhost:3333/api/produtos/${produto._id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                alert("Erro ao excluir produto.❌");
                return;
            }

            tr.remove();
            alert("Produto excluído com sucesso!✅");
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Não foi possível conectar à API.❌");
        }
    });
}

function selecionarProduto(produto){
    produtoEditandoId = produto._id;

    const inputs = document.querySelectorAll("#formProdutos input");

    inputs[0].value = produto.nome;
    inputs[1].value = produto.preco;
    inputs[2].value = produto.quantidade;
}

//lista inicial ao abrir a tabela
async function carregarlistaInicial() {
    try {
        const response = await fetch("/api/produtos");
        const produtos = await response.json();

        document.getElementById("listaProdutos").innerHTML = "";

        produtos.forEach(produto => {
            adicionarNaTabela(produto);});
    } catch (error) {
         console.error("Erro ao carregar lista Inicial.❌")
    }
}

carregarlistaInicial();

