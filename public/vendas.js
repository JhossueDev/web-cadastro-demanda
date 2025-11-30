const inputNome = document.getElementById("inputNome");
const inputMes = document.getElementById("dataVenda");
const inputQtd = document.getElementById("quantidade");
const inputCliente = document.getElementById("cliente");
const form = document.getElementById("formProdutos");
const lista = document.getElementById("listaProdutos");

let produtoSelecionado = null;
let carrinho = [];
let total = 0;

//adiciona item no carrinho
document.getElementById("addItem").addEventListener("click", () => {
    if (!produtoSelecionado) {
        alert("Selecione um produto válido.❌");
        return;
    }

    const quantidade = Number(inputQtd.value);

    if (quantidade <= 0) {
        alert("Quantidade inválida.");
        return;
    }

    if (quantidade > produtoSelecionado.estoque) {
        alert(`Estoque insuficiente! Disponível: ${produtoSelecionado.estoque}`);
        return;
    }

    const subtotal = produtoSelecionado.preco * quantidade;

    carrinho.push({
        id: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        quantidade,
        preco: produtoSelecionado.preco,
        subtotal
    });

    atualizarCarrinho();

    produtoSelecionado = null;
    inputNome.value = "";
    inputQtd.value = "";
});

//atualiza a tabela do carrinho
function atualizarCarrinho() {
    const tabela = document.getElementById("listaCarrinho");
    tabela.innerHTML = "";

    total = 0;

    carrinho.forEach(item => {
        total += item.subtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>R$ ${item.subtotal.toFixed(2)}</td>
        `;
        tabela.appendChild(tr);
    });

    document.getElementById("totalCompra").textContent = total.toFixed(2);
}

//autocomplete dos produtos
inputNome.addEventListener("input", async () => {
    const nome = inputNome.value.trim();

    if (nome.length < 1) {
        const oldBox = document.getElementById("sugestoes");
        if (oldBox) oldBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/api/produtos?nome=${encodeURIComponent(nome)}`);
        if (!res.ok) return;

        const produtos = await res.json();

        let box = document.getElementById("sugestoes");
        if (!box) {
            box = document.createElement("div");
            box.id = "sugestoes";
            box.classList.add("autocomplete-box");
            document.body.appendChild(box);
            box.style.position = "absolute";
        }

        const rect = inputNome.getBoundingClientRect();
        box.style.width = rect.width + "px";
        box.style.left = rect.left + "px";
        box.style.top = (rect.bottom + window.scrollY) + "px";
        box.innerHTML = "";

        if (!produtos.length) {
            const empty = document.createElement("div");
            empty.textContent = "Nenhum produto encontrado";
            empty.style.padding = "8px";
            empty.style.color = "#666";
            box.appendChild(empty);
            produtoSelecionado = null;
            return;
        }

        produtos.forEach(p => {
            const item = document.createElement("div");
            item.textContent = p.nome;
            item.style.padding = "8px";
            item.style.borderBottom = "1px solid #eee";
            item.style.background = "#fff";
            item.style.cursor = "pointer";

            item.onclick = async () => {
                inputNome.value = p.nome;
                box.innerHTML = "";

                try {
                    const infoRes = await fetch(`/api/verificarEstoque/${p._id}`);
                    if (!infoRes.ok) return;

                    const dados = await infoRes.json();

                    produtoSelecionado = {
                        id: p._id,
                        nome: dados.nome,
                        preco: dados.preco,
                        estoque: dados.estoque
                    };

                    alert(
                        `Produto encontrado:\n
Nome: ${dados.nome}
Preço: R$ ${Number(dados.preco).toFixed(2)}
Estoque: ${dados.estoque}`
                    );
                } catch (e) {
                    console.error(e);
                    alert("Erro ao obter estoque");
                }
            };

            box.appendChild(item);
        });

    } catch (err) {
        console.error("Erro no autocomplete:", err);
    }
});

//registra o item no back

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!produtoSelecionado) {
        alert("Selecione um produto válido!❌");
        return;
    }

    const quantidade = Number(inputQtd.value);
    const data = inputMes.value;
    const cliente = inputCliente.value.trim();

    if (!cliente) {
        alert("Informe o nome do cliente!");
        return;
    }

    if (quantidade <= 0) {
        alert("Quantidade inválida");
        return;
    }

    if (quantidade > produtoSelecionado.estoque) {
        alert(`Estoque insuficiente!`);
        return;
    }

    try {
        const res = await fetch("/api/vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produtoId: produtoSelecionado.id,
                quantidade,
                data,
                cliente
            })
        });

        if (!res.ok) {
            const err = await res.json();
            alert("Erro ao registrar venda: " + err.message);
            return;
        }

        alert("Item registrado no caixa!✅");

    } catch (err) {
        console.error(err);
        alert("Erro ao registrar a venda.");
    }
});

//finaliza a venda e a nota fiscal

document.getElementById("finalizarVenda").addEventListener("click", async () => {
    const cliente = inputCliente.value.trim();
    const dinheiro = Number(document.getElementById("dinheiroRecebido").value);

    if (!cliente) {
        alert("Informe o nome do cliente!");
        return;
    }

    if (!carrinho.length) {
        alert("Carrinho vazio.");
        return;
    }

    if (dinheiro < total) {
        alert("Dinheiro insuficiente!");
        return;
    }

    const troco = dinheiro - total;

    await fetch("/api/vendas/multipla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cliente,
            itens: carrinho,
            total,
            dinheiro,
            troco,
            data: new Date()
        })
    });

    const nota = `
========= NOTA FISCAL =========

Cliente: ${cliente}

${carrinho.map(i =>
`• ${i.nome} — ${i.quantidade} un — R$ ${i.subtotal.toFixed(2)}`).join("\n")}

--------------------------------
TOTAL: R$ ${total.toFixed(2)}
Recebido: R$ ${dinheiro.toFixed(2)}
Troco: R$ ${troco.toFixed(2)}
--------------------------------

Data: ${new Date().toLocaleString()}

===============================`;

    alert(nota);

    carrinho = [];
    atualizarCarrinho();
    inputCliente.value = "";
    await carregarVendas();  
});

//lista as vendas
async function carregarVendas() {
    try {
        const res = await fetch("/api/vendas");
        if (!res.ok) return;

        const vendas = await res.json();
        lista.innerHTML = "";

        vendas.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.nomeProduto || "Produto removido"}</td>
                <td>${v.cliente}</td>
                <td>${(v.data || "").substring(0, 10)}</td>
                <td>${v.quantidade}</td>
            `;
            lista.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
    }
}

carregarVendas();
