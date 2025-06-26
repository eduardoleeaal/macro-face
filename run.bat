@echo off
echo 🤖 Iniciando Facebook Marketplace Bot...
echo.
python main.py
if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao executar o programa
    echo Certifique-se de que as dependencias estao instaladas: install.bat
    pause
)
