# BackEnd - API
Esta aplicación cuenta con dos Endpoints que corren en `localhost:8000`:

* */predict/*: Es el encargado de recibir un JSON con un arreglo de textos en español y retornar un JSON con un listado de todas las predicciones y un listado de las probabilidades de que la clasificación hubiese sido de cada tipo de ODS.

```
# INPUT
{
  "Textos_espanol": [
    "Primer texto", "Segundo texto", ...
  ]
}

# OUTPUT
{
  "predictions": [
    3,
    4,
    ...
  ],
  "probabilities": [
    [
      0.9999998400605583,
      9.063688371300689e-10,
      1.5903307276903518e-7
    ],
    [
      3.7189559865851526e-10,
      0.9999998729863434,
      1.2664176096180176e-7
    ],
    ...
  ]
}
```

* */reentrenar/*: Es el encargado de recibir un JSON con un arreglo de textos en español y un arreglo con sus predicciones respectivas. Retorna un JSON que contenga un mensaje de éxito y las métricas del nuevo modelo almacenado en JOBLIB:

```
# INPUT
{
  "Textos_espanol": [
    "Primer texto", "Segundo texto", ...
  ],
  "sdg": [
    3, 5, ...
  ]
}

# OUTPUT
{
  "message": "Modelo reentrenado correctamente",
  "metrics": {
    "precision": "0.97660",
    "recall": "0.97654",
    "f1_score": "0.97655"
  }
}
```

## ¿Cómo Ejecutar?

### Ejecución con comandos Shell
Navegar a la carpeta raíz del proyecto.

Ejecutar individualmente POR PRIMERA VEZ con:
* `python -m venv venv`
* `venv\Scripts\activate`
* `pip install --no-cache-dir -r requirements.txt`
* `uvicorn backend.src.main:app --reload`

Ejecutar después de instalado con:
* `venv\Scripts\activate`
* `uvicorn backend.src.main:app --reload`

### Ejecución con Script en Windows (RECOMENDADA)
*Nótese que esta opción sólo sirve para Sistema Operativo Windows*

Correr en una terminal el comando:
* `run_backend.bat`

Este debería instalar todas las dependencias y crear el entorno virtual de forma automática (realiza el proceso anterior en un solo paso).


# FrontEnd - ReactJS
Esta aplicación cuenta con un FrontEnd elaborado con el framework React JS que corre en `localhost:3000`.

## ¿Cómo Ejecutar?
En una terminal diferente a la del BackEnd (deben estar corriendo en simultáneo), aplicar los siguientes comandos:

* `npm install`
* `npm start`


# Opciones de Uso
Es posible navegar a la página principal desde cualquier navegador en la ruta `localhost:3000/`. En esta opción, el usuario puede interactuar con la aplicación web y todas sus funcionalidades.

\
También, si se desea, es posible correr las peticiones en el back directamente, respetando la estructura de los JSON en la siguiente ruta: `localhost:8000/docs/`