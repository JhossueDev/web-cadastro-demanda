const inputNome = document.getElementById("inputNome");
const inputMes = document.getElementById("dataVenda");
const inputQtd = document.getElementById("quantidade");
const form = document.getElementById("formProdutos");
const lista = document.getElementById("listaProdutos");

let produtoSelecionado = null;

console.log("vendas.js carregado");

//autocomplete
inputNome.addEventListener("input", async () => {
    const nome = inputNome.value.trim();
    console.log("digitou:", nome);
    if (nome.length < 1) {
        const oldBox = document.getElementById("sugestoes");
        if (oldBox) oldBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/api/produtos?nome=${encodeURIComponent(nome)}`);
        console.log("/api/produtos?nome=", nome, "status", res.status);

        if (!res.ok) {
            console.error("Erro ao buscar produtos:", res.status, await res.text());
            alert("Erro ao buscar produtos no servidor. Veja console.");
            return;
        }

        const produtos = await res.json();
        console.log("produtos retornados:", produtos);

        let box = document.getElementById("sugestoes");
        if (!box) {
            box = document.createElement("div");
            box.id = "sugestoes";
            box.classList.add("autocomplete-box");
            document.body.appendChild(box);
            box.style.position = "absolute";
        }

        //posiciona a box
        const rect = inputNome.getBoundingClientRect();
        box.style.width = rect.width + "px";
        box.style.left = rect.left + "px";
        box.style.top = (rect.bottom + window.scrollY) + "px";
        box.innerHTML = "";

        if (!Array.isArray(produtos) || produtos.length === 0) {
            const empty = document.createElement("div");
            empty.textContent = "Nenhum produto encontrado";
            empty.style.padding = "8px";
            empty.style.color = "#666";
            box.appendChild(empty);
            produtoSelecionado = null;
            console.log("nenhum produto encontrado");
            return;
        }

        produtos.forEach(p => {
            const item = document.createElement("div");
            item.textContent = p.nome;
            item.style.padding = "8px";
            item.style.borderBottom = "1px solid #eee";
            item.style.background = "#fff";
            item.style.cursor = "pointer";

            item.onclick = async (ev) => {
                ev.stopPropagation();
                console.log("clicou item:", p);

                inputNome.value = p.nome;
                box.innerHTML = "";

                //faz a busca no estoque
                try {
                    const infoRes = await fetch(`/api/verificarEstoque/${p._id}`);
                    console.log("fetch verificarEstoque status:", infoRes.status);
                    if (!infoRes.ok) {
                        const txt = await infoRes.text();
                        console.error("Erro verificarEstoque:", infoRes.status, txt);
                        alert("Erro ao obter estoque do produto. Veja console.");
                        produtoSelecionado = null;
                        return;
                    }

                    const dados = await infoRes.json();
                    console.log("dados estoque:", dados);

                    produtoSelecionado = {
                        id: p._id,
                        nome: dados.nome,
                        preco: dados.preco,
                        estoque: dados.estoque
                    };

                    //mostrar info na tela em vez de depender só de alert
                    alert(
                        `Produto encontrado:\nNome: ${dados.nome}\nPreço: ${Number(dados.preco).toFixed(2)}\nEstoque: ${dados.estoque}`
                    );
                } catch (err) {
                    console.error("Erro fetch verificarEstoque:", err);
                    alert("Erro ao conectar para verificar estoque. Veja console.");
                    produtoSelecionado = null;
                }
            };

            box.appendChild(item);
        });

    } catch (err) {
        console.error("Erro no autocomplete:", err);
        alert("Erro no autocomplete. Veja console.");
    }
});

//submit(venda)
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("submit click, produtoSelecionado:", produtoSelecionado);

    if (!produtoSelecionado) {
        alert("Selecione um produto válido!❌");
        return;
    }

    const quantidade = Number(inputQtd.value);
    const data = inputMes.value;

    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Quantidade inválida");
        return;
    }

    if (quantidade > produtoSelecionado.estoque) {
        alert(`Estoque insuficiente! Disponível: ${produtoSelecionado.estoque}`);
        return;
    }

    try {
        const res = await fetch("/api/vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produtoId: produtoSelecionado.id,
                quantidade,
                data
            })
        });

        console.log("POST /api/vendas status:", res.status);
        const obj = await res.json();
        console.log("resposta venda:", obj);

        if (!res.ok) {
            alert("Erro ao registrar venda: " + (obj.error || obj.message || res.status));
            return;
        }

        alert("Venda registrada com sucesso!");
        produtoSelecionado = null;
        inputNome.value = "";
        inputQtd.value = "";
        carregarVendas();
    } catch (err) {
        console.error("Erro ao postar venda:", err);
        alert("Erro ao conectar ao servidor ao registrar venda. Veja console.");
    }
});

//lista as vendas
async function carregarVendas() {
    try {
        const res = await fetch("/api/vendas");
        if (!res.ok) {
            console.error("/api/vendas erro:", res.status, await res.text());
            return;
        }
        const vendas = await res.json();
        lista.innerHTML = "";
        vendas.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${v.produtoId?.nome || "Produto removido"}</td>
                            <td>${(v.data || "").substring(0,10)}</td>
                            <td>${v.quantidade}</td>`;
            lista.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro carregar vendas:", err);
    }
}

carregarVendas();
