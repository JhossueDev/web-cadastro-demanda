//auto complte do produto
const inputNome = document.querySelector("#formProdutos ");
let produtoSeleionandoId = null;

//lista visual de sugestões
const listaSugestoes = document.createElement("ul");
listaSugestoes.id = "listaSugestoes";
listaSugestoes.style.listStyle = "none";
listaSugestoes.style.padding = "0";
listaSugestoes.style.marginTop = "5px";
listaSugestoes.style.border = "1px solid #ccc";
listaSugestoes.style.maxHeight = "150px";
listaSugestoes.style.overflow = "auto";
listaSugestoes.style.display = "none";
inputNome.parentNode.appendChild(listaSugestoes);

//enquanot digita buca o produto
inputNome.addEventListener("input", async () =>{
    const query = inputNome.ariaValueMax.trim();

    if (query.length === 0) {
        listaSugestoes.style.display = "none";
        listaSugestoes.innerHTML = "";
        produtoSeleionandoId = null;
        return;
    }

    try {
        const res = await fetch (`http://localhost:3333/produtos?search=${query}`);
        const produtos = await res.json();

        if (Array.isArray(produtos) || produtos.length === 0) {
         listaSugestoes.style.display = "none";
         return;   
        }

        listaSugestoes.innerHTML = produtos
        .map(p => `<li data-id="${p._id}" style="padding:6px; cursor:pointer">${p.nome}</li>`)
        .join("");

        listaSugestoes.style.display = "block";

        //clique em uma sugestão
        listaSugestoes.querySelectorAll("li").forEach(li =>{
            li.addEventListener("click", () =>{
                inputNome.value = li.textContent;
                produtoSeleionandoId - li.dataset.id;//slavo oi produto
                listaSugestoes.style.display = "none";
            });
        });
    } catch (err) {
        console.error("Erro no autocomplete", err);
    }
});

//quando o item perde o foco ele esconde a lista
inputNome.addEventListener("blur", () =>{
    setTimeout(() => listaSugestoes.style.display = "none", 150);
});

//cadastra a venda
document.getElementById("formProdutos").addEventListener("submit", async (event) => {
    event.preventDefault();


    const nomeProduto = inputNome.value.trim();
    const dataVenda = document.querySelecto("#formProdutos input:nth-child(2)").value;
    const quantidade = Number(document.querySelector("#formProdutos input:nth-child()").value);

    if (!produtoSeleionandoId) {
        alert("Selecione um produto válido nas sugestões!");
        return;
    }

    const venda = {
        produtoId: produtoSeleionandoId,
        quantidade,
        data: dataVenda ? new Date(dataVenda) : new Date() 
    };

    try {
        const res = await fetch("http:localhost:3333/vendas", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(venda)
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Erro ao resgistrar venda!❌");
            console.log(data);
            return;
        }

        alert("Venda resgistrada com sucesso!✅");
        adicionarVendaNaTabela(data);

        event.target.reset();
        produtoSeleionandoId = null;
    } catch (err) {
        console.error("Erro ao resgistrar vendas:", err);
    }
});

//listar de vendas
async function carregarVendas() {
    try {
        const res = await fetch("http:localhost:3333/vendas");
        const vendas = await res.json();

        vendas.forEach(v => adicionarVendaNaTabela(v))
    } catch (err) {
        console.error("Erro ao carregar vendas", err);
    }
}

function adicionarVendaNaTabela(venda) {
    const tabela = document.getElementById("listarProdutos");

    const linha = `
        <tr>
            <td>${venda.produtoId?.nome || "Produto removido"}</td>
            <td>${new Date(venda.data).toLocaleDateString("pt-BR")}</td>
            <td>${venda.quantidade}</td>
        </tr>
    `;
    tabela.innerHTML += linha;
}
carregarVendas();