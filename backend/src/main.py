from typing import Optional
from fastapi import FastAPI
from src.DataModel import DataModel
from src.PredictionModel import Model
import pandas as pd
from joblib import load

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
   return {"item_id": item_id, "q": q}

@app.post("/predict")
def make_predictions(dataModel: DataModel):
    df = pd.DataFrame(dataModel.dict(), columns=dataModel.dict().keys(), index=[0])
    df.columns = dataModel.columns()
    model = load("assets/pipeline_modelo.joblib")
    result = model.predict(df)
    return result
