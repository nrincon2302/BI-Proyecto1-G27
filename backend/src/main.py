from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .DataModel import DataModel
import pandas as pd
from joblib import load

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
pipeline = load("backend/src/assets/pipeline_funcional.joblib")

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
