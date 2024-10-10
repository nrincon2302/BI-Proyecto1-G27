from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .DataModel import DataModel
import pandas as pd
from joblib import load
import numpy as np  
from sklearn.metrics import precision_score, recall_score, f1_score
from joblib import dump
from fastapi import HTTPException
from pydantic import BaseModel
from typing import List
from .Preprocessing import pipeline_datos_reentrenamiento
from sklearn.metrics import confusion_matrix
from collections import Counter
import warnings
from sklearn.exceptions import UndefinedMetricWarning
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import json
import pandas as pd
import unicodedata
from num2words import num2words
from nltk.corpus import stopwords
from nltk import word_tokenize
from nltk.stem import SnowballStemmer, WordNetLemmatizer

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

@app.post("/words")
def get_important_words(dataModel: DataModel):
   # Convertir la entrada a un DataFrame que maneje múltiples textos
   df = pd.DataFrame(dataModel.dict(), columns=dataModel.dict().keys())

   # Cargar el modelo (ajusta según tu estructura si es diferente)
   model = load("backend/src/assets/pipeline_funcional.joblib")

   features = model['tfidf'].get_feature_names_out()
   important_features = model['clf'].coef_[0]

   if hasattr(important_features, 'toarray'):
      important_features = important_features.toarray().ravel()

   word_indices = np.argsort(important_features)[-300:]

   review_important = []
   for user_review in df['Textos_espanol']:
      user_review_important = []
      for word in user_review.split():
         for idx in word_indices:
            if word == features[idx]:
               user_review_important.append(features[idx])
      review_important.append(user_review_important)

   return {"important_words": review_important}



# Define el modelo de entrada para la API
class ReentrenamientoModel(BaseModel):
    textos: List[str]
    etiquetas: List[int]




@app.post("/reentrenamiento")
def reentrenar_modelo(data: ReentrenamientoModel):
    textos_nuevos = data.textos
    etiquetas_nuevas = data.etiquetas

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

    # Verificar la distribución de clases antes de la división
    print("Distribución de etiquetas combinadas:", Counter(df['sdg']))

    # Dividir los datos en entrenamiento y prueba (80% entrenamiento, 20% prueba)
    X_train, X_test, y_train, y_test = train_test_split(
        df['Textos_espanol'], df['sdg'], test_size=0.2, random_state=42, stratify=df['sdg']
    )

    # Verificar la distribución de clases después de la división
    print("Distribución de etiquetas en el conjunto de entrenamiento:", Counter(y_train))
    print("Distribución de etiquetas en el conjunto de prueba:", Counter(y_test))

    # Preprocesar los textos de entrenamiento y prueba
    X_train_processed = pipeline_datos_reentrenamiento(X_train)
    X_test_processed = pipeline_datos_reentrenamiento(X_test)

    # Vectorización con TfidfVectorizer
    tfidf = TfidfVectorizer(max_features=10000)

    # Ajustar el vectorizador con los datos de entrenamiento y transformar los datos de prueba
    X_train_tfidf = tfidf.fit_transform(X_train_processed)
    X_test_tfidf = tfidf.transform(X_test_processed)

    # Crear y entrenar el clasificador con multi_class='multinomial'
    clf = LogisticRegression(C=100, max_iter=100, solver='newton-cg', multi_class='multinomial')
    clf.fit(X_train_tfidf, y_train)

    # Realizar predicciones en el conjunto de prueba
    y_pred = clf.predict(X_test_tfidf)

    # Calcular las métricas de desempeño
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    # Formatear las métricas a 5 cifras decimales
    precision = "{0:.5f}".format(precision)
    recall = "{0:.5f}".format(recall)
    f1 = "{0:.5f}".format(f1)

    # Crear un pipeline con el preprocesamiento, vectorizador y clasificador entrenado
    pipeline = Pipeline([
        ('preprocesamiento', FunctionTransformer(pipeline_datos_reentrenamiento)),
        ('tfidf', tfidf),
        ('clf', clf)
    ])

    # Guardar el modelo actualizado
    dump(pipeline, model_path)

    return {
        "message": "Modelo reentrenado correctamente",
        "metrics": {
            "precision": precision,
            "recall": recall,
            "f1_score": f1
        }
    }