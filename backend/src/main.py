from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.DataModel import DataModel
from src.Preprocessing import pipeline_datos
import pandas as pd
from joblib import load

app = FastAPI()

# Configura CORS
app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)

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
   df.columns = dataModel.columns()

   # Cargar el modelo ya entrenado con el pipeline que incluye 'pipeline_datos'
   model = load("./src/assets/pipeline.joblib")

   # El modelo incluye el pipeline, por lo que solo pasamos los datos sin procesar
   prediction = model.predict(df).tolist()[0]
   probability = model.predict_proba(df).tolist()[0]

   # Devolver la predicción y la probabilidad
   return {"prediction": prediction, "probability": probability}
