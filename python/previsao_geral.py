import pandas as pd
from sklearn.linear_model import LinearRegression
import json
import sys

#recebe JSON do node
raw = sys.stdin.read()
vendas = json.loads(raw)

#criando DataFrame
df = pd.DataFrame(vendas)

#garante que existe coluna "data"
df['data'] = pd.to_datetime(df['data'])

#agrupa por dia
df_grupo = df.groupby(df['data'].dt.date)['quantidade'].sum().reset_index()
df_grupo['data'] = pd.to_datetime(df_grupo['data'])

#cria coluna de dias(baseado no menor dia)
df_grupo['dias'] = (df_grupo['data'] - df_grupo['data'].min()).dt.days


x = df_grupo[['dias']]
y = df_grupo[['quantidade']]

#treina o modelo
modelo = LinearRegression()
modelo.fit(x, y)

#gera o próximo dia
ultimo_dia = df_grupo['dias'].max()
proximo_dia = ultimo_dia + 1

previsao = modelo.predict([[proximo_dia]])[0][0]

print(json.dumps({"previsao": previsao}))
