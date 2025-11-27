document.getElementById("formProdutos").addEventListener("submit", async (event)=> {
    event.preventDefault();

    const inputs  = document.querySelectorAll("#formProdutos input");

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

        const data = await response.json();

        if (!response.ok) {
            alert("Erro ao cadastrar o produto!❌")
            console.log(data);
            return;
        }

        alert("Produto cadastrado com sucesso.✅");

        adicionarNaTabela(data);

        event.target.reset();

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar á API.❌");
    }
});

function adicionarNaTabela(produto){
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