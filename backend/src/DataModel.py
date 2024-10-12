from pydantic import BaseModel
from typing import List

class DataModel(BaseModel):

    # Estas varibles permiten que la librería pydantic haga el parseo entre el Json recibido y el modelo declarado.
    Textos_espanol: List[str]

    # Esta función retorna los nombres de las columnas correspondientes con el modelo exportado en joblib.
    def columns(self):
        return ["Textos_espanol"]


class ReentrenamientoModel(BaseModel):
    Textos_espanol: List[str]
    sdg: List[int]

    def columns(self):
        return ["Textos_espanol", "sdg"]