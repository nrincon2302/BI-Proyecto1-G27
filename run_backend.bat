@echo off

REM Verifica si la carpeta 'venv' ya existe
if exist backend\venv (
    REM Si el entorno virtual ya existe, solo activa y ejecuta FastAPI
    echo ================================
    echo Activando el entorno virtual...
    echo ================================
    cd backend
    call venv\Scripts\activate

    echo ================================
    echo Entorno virtual activado.
    echo Iniciando el servidor del BackEnd...
    echo ================================
    uvicorn main:app --reload
) else (
    REM Si el entorno virtual no existe, crea el entorno y las dependencias
    echo ================================
    echo Generando entorno virtual...
    echo ================================
    cd backend
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
    REM Oculta la salida de la instalación de dependencias
    pip install fastapi uvicorn >nul 2>&1

    echo ================================
    echo Dependencias instaladas.
    echo Iniciando el servidor del BackEnd...
    echo ================================
    uvicorn src.main:app --reload
)
