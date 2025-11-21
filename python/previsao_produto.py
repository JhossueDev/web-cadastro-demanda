import pandas as pd
from sklearn.linear_model import LinearRegression
import json
import sys

raw = sys.stdin.read()
dados = json.loads(raw)

produto_id = dados["produtoId"]
vendas = dados["vendas"]

df = pd.DataFrame(vendas)

#converte a data para datetime
df["data"] = pd.to_datetime(df["data"], unit="ms")

#agrupa as vendas por dia
df_grupo = df.groupby(df["data"].dt.date)["quantidade"].sum().reset_index()
df_grupo["data"] = pd.to_datetime(df_grupo["data"])

#calcula os dias desde o primeiro registro
df_grupo["dias"] = (df_grupo["data"] - df_grupo["data"].min()).dt.days

#prepara X e Y
x = df_grupo[["dias"]]
y = df_grupo[["quantidade"]]

#treina modelo
modelo = LinearRegression()
modelo.fit(x, y)

#predict do próximo dia
proximo_dia = df_grupo["dias"].max() + 1
previsao = modelo.predict([[proximo_dia]])[0][0]

# Retorna JSON
print(json.dumps({
    "produtoId": produto_id,
    "previsao": float(previsao)
}))
