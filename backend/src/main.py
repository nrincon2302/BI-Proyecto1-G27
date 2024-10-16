from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .DataModel import DataModel, ReentrenamientoModel

import pandas as pd
from joblib import load, dump
import numpy as np

from sklearn.metrics import precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir solicitudes desde cualquier origen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar el pipeline entrenado
model_path = "backend/src/assets/pipeline_funcional.joblib"
pipeline = load(model_path)
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}

@app.post("/predict")
def make_prediction(dataModel: DataModel):
    # Convertir la entrada del modelo Pydantic a DataFrame
    df = pd.DataFrame(dataModel.dict(), columns=dataModel.dict().keys())

    # Usar el pipeline cargado para hacer la predicción
    predictions = pipeline.predict(df).tolist()  # Predecir todas las instancias
    probabilities = pipeline.predict_proba(df).tolist()  # Obtener las probabilidades para todas

    # Devolver todas las predicciones y probabilidades
    return {"predictions": predictions, "probabilities": probabilities}

@app.post("/reentrenamiento")
def reentrenar_modelo(data: ReentrenamientoModel):
    textos_nuevos = data.Textos_espanol
    etiquetas_nuevas = data.sdg

    if len(textos_nuevos) != len(etiquetas_nuevas):
        raise HTTPException(status_code=400, detail="El número de textos y etiquetas no coincide")

    # Cargar el dataset original
    data_original = pd.read_excel("data/ODScat_345.xlsx")
    textos_originales = data_original['Textos_espanol']
    etiquetas_originales = data_original['sdg']

    # Combinar los datos originales con los nuevos
    textos_combinados = pd.concat([textos_originales, pd.Series(textos_nuevos)], ignore_index=True)
    etiquetas_combinadas = pd.concat([etiquetas_originales, pd.Series(etiquetas_nuevas)], ignore_index=True)

    # Crear el DataFrame con los textos y etiquetas combinados
    df = pd.DataFrame({'Textos_espanol': textos_combinados, 'sdg': etiquetas_combinadas})

    # Dividir los datos en entrenamiento y prueba (80% entrenamiento, 20% prueba)
    X_train, X_test, y_train, y_test = train_test_split(
        df['Textos_espanol'], df['sdg'], test_size=0.2, random_state=42, stratify=df['sdg']
    )

    pipeline1 = pipeline
    pipeline1.fit(X_train, y_train)

    # Realizar predicciones en el conjunto de prueba
    y_pred = pipeline1.predict(X_test)

    # Calcular las métricas de desempeño
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    # Formatear las métricas a 5 cifras decimales
    precision = "{0:.5f}".format(precision)
    recall = "{0:.5f}".format(recall)
    f1 = "{0:.5f}".format(f1)

    # Guardar el modelo actualizado
    dump(pipeline1, model_path)

    return {
        "message": "Modelo reentrenado correctamente",
        "metrics": {
            "precision": precision,
            "recall": recall,
            "f1_score": f1
        }
    }
