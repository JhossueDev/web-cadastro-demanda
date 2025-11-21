# Backend de Produtos, Vendas e Previsões (Node.js/MongoDB + PythonShell)

Esse backend é o cérebro da aplicação — é ele que organiza os dados, fala com o banco, cuida das rotas e garante que tudo chegue no front do jeito certo.
A API foi construída em Node.js + Express, usando o MongoDB/Mongoose pra armazenar as informações de forma estruturada.

Aqui vai o resumo do que ele faz:
✅ Conexão com o Banco
Configura variáveis de ambiente com dotenv.
Centraliza a lógica de conexão em src/config/db.js.
Conecta no MongoDB e garante que tudo suba bonitinho antes do servidor rodar.

✅ CRUD de Produtos
Cadastra produtos novos.
Lista todos os produtos cadastrados.
Atualiza produtos existentes.
Remove produtos quando necessário.
Tudo isso direto na coleção real do MongoDB (sem mock, sem gambiarra).

✅ CRUD de Vendas
Registra novas vendas.
Lista histórico de vendas.
Permite trabalhar essas informações depois (ex.: previsões).

✅ Integração com Python
Usa PythonShell pra rodar o script de previsão.
Envia os dados das vendas pro modelo em Python.
Retorna o resultado calculado (previsão, análise, etc.).
Isso permite usar bibliotecas como scikit-learn sem complicar o Node.

✅ Estrutura organizada
Rotas separadas.
Controllers cuidando da lógica.
Models do Mongoose definindo o formato certinho dos dados.
Servidor carregando tudo de forma limpa e modular.
