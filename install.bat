@echo off
echo 🚀 Instalando dependencias do Facebook Marketplace Bot...
echo.

echo 📦 Instalando dependencias Python...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias Python
    pause
    exit /b 1
)

echo.
echo 📦 Instalando dependencias Node.js...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias Node.js
    pause
    exit /b 1
)

echo.
echo ✅ Instalacao concluida com sucesso!
echo.
echo 🚀 Para executar o programa, execute: python main.py
echo.
pause
