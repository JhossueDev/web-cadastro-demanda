// Seletores
const inputNome = document.querySelector("#formProdutos input[type='text']");
const inputMes = document.querySelector("#formProdutos input[type='month']");
const inputQtd = document.querySelector("#formProdutos input[type='number']");
const form = document.getElementById("formProdutos");
const lista = document.getElementById("listaProdutos");

//autocomplete das sugestão de produtos
inputNome.addEventListener("input", async () => {
    const nome = inputNome.value.trim();

    if (nome.length < 1) return;

    const res = await fetch(`/api/produtos?nome=${nome}`);
    const produtos = await res.json();

    //cria dropdown simples
    let box = document.getElementById("sugestoes");
    if (!box) {
        box = document.createElement("div");
        box.id = "sugestoes";
        box.classList.add("autocomplete-box");
        inputNome.parentNode.appendChild(box);
    }

    box.innerHTML = "";

    produtos.forEach(p => {
        const item = document.createElement("div");
        item.innerText = p.nome;
        item.onclick = () => {
            inputNome.value = p.nome;
            inputNome.dataset.id = p._id; // salva o id escondido
            box.innerHTML = "";
        };
        box.appendChild(item);
    });
});

//registra a  venda
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produtoId = inputNome.dataset.id;
    const quantidade = inputQtd.value;
    const data = inputMes.value;

    if (!produtoId) {
        alert("Selecione um produto válido da lista!");
        return;
    }

    const res = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtoId, quantidade, data })
    });

    const venda = await res.json();

    if (venda.error) {
        alert(venda.error);
        return;
    }

    alert("Venda registrada com sucesso!");
    carregarVendas();
});

//listar vendas
async function carregarVendas() {
    const res = await fetch("/api/vendas");
    const vendas = await res.json();

    lista.innerHTML = "";

    vendas.forEach(v => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${v.produtoId.nome}</td>
            <td>${v.data.substring(0, 10)}</td>
            <td>${v.quantidade}</td>
        `;

        lista.appendChild(tr);
    });
}

carregarVendas();
