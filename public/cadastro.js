//autocomplete do nome
const inputNome = document.getElementById("nomeProduto");

// cria a lista de sugestões
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

// busca enquanto digita
inputNome.addEventListener("input", async () => {
    const query = inputNome.value.trim().toLowerCase();

    if (query.length === 0) {
        listaSugestoes.style.display = "none";
        listaSugestoes.innerHTML = "";
        return;
    }

    try {
        const response = await fetch("http://localhost:3333/produtos");
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

        Array.from(listaSugestoes.children).forEach(li => {
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

    try {
        const response = await fetch("http://localhost:3333/Lprodutos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

    const venda = await res.json();

        if (!response.ok) {
            alert("Erro ao cadastrar o produto!❌");
            console.log(data);
            return;
        }

        alert("Produto cadastrado com sucesso.✅");

        adicionarNaTabela(data);

        event.target.reset();

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar à API.❌");
    }
});

function adicionarNaTabela(produto) {
    const tabela = document.getElementById("listaProdutos");

    const linha = `
        <tr>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
        </tr>
    `;
    tabela.innerHTML += linha;
}
