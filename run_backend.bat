@echo off

REM Verifica si la carpeta 'venv' ya existe
if exist venv (
    REM Si el entorno virtual ya existe, solo activa y ejecuta FastAPI
    echo ================================
    echo Activando el entorno virtual...
    echo ================================
    call venv\Scripts\activate

    echo ================================
    echo Entorno virtual activado.
    echo Iniciando el servidor del BackEnd...
    echo ================================
    uvicorn backend.src.main:app --reload
) else (
    REM Si el entorno virtual no existe, crea el entorno y las dependencias
    echo ================================
    echo Generando entorno virtual...
    echo ================================
    python -m venv venv

    echo ================================
    echo Entorno virtual creado.
    echo Activando entorno virtual...
    echo ================================
    call venv\Scripts\activate

    echo ================================
    echo Entorno virtual activado.
    echo Instalando dependencias...
    echo (esto puede tardar un momento)
    echo ================================
    pip install --no-cache-dir -r backend\requirements.txt

    echo ================================
    echo Dependencias instaladas.
    echo Iniciando el servidor del BackEnd...
    echo ================================
    uvicorn backend.src.main:app --reload
)
