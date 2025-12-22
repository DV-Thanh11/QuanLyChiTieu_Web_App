@echo off
chcp 65001 >nul
echo ========================================
echo KHOI DONG SMARTWALLET SERVER
echo ========================================
echo.

REM Kiem tra MySQL
echo Dang kiem tra MySQL...
python -c "import mysql.connector; from dotenv import load_dotenv; import os; load_dotenv(); db = mysql.connector.connect(host='localhost', user='root', password=os.getenv('MYSQL_ROOT_PASSWORD')); print('MySQL OK!'); db.close()" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [CANH BAO] MySQL Server chua duoc khoi dong!
    echo.
    echo Vui long khoi dong MySQL truoc:
    echo 1. Mo Services (Windows + R, go: services.msc)
    echo 2. Tim service MySQL va Start no
    echo 3. Hoac mo MySQL Workbench de khoi dong MySQL
    echo.
    echo Sau do chay lai script nay.
    echo.
    pause
    exit /b 1
)

echo MySQL da san sang!
echo.
echo Dang khoi dong Flask Server...
echo Server se chay tai: http://127.0.0.1:5000
echo Nhan Ctrl+C de dung server
echo.
echo ========================================
echo.

cd /d "%~dp0"
python server/app.py

pause

