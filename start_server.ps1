# Script khởi động SmartWallet Server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KHOI DONG SMARTWALLET SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra MySQL
Write-Host "Dang kiem tra MySQL..." -ForegroundColor Yellow
try {
    $env:PYTHONIOENCODING = 'utf-8'
    python -c "import mysql.connector; from dotenv import load_dotenv; import os; load_dotenv(); db = mysql.connector.connect(host='localhost', user='root', password=os.getenv('MYSQL_ROOT_PASSWORD')); print('MySQL OK!'); db.close()" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL connection failed"
    }
    Write-Host "MySQL da san sang!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[CANH BAO] MySQL Server chua duoc khoi dong!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vui long khoi dong MySQL truoc:" -ForegroundColor Yellow
    Write-Host "1. Mo Services (Windows + R, go: services.msc)" -ForegroundColor White
    Write-Host "2. Tim service MySQL va Start no" -ForegroundColor White
    Write-Host "3. Hoac mo MySQL Workbench de khoi dong MySQL" -ForegroundColor White
    Write-Host ""
    Write-Host "Sau do chay lai script nay." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Nhan Enter de thoat"
    exit 1
}

Write-Host ""
Write-Host "Dang khoi dong Flask Server..." -ForegroundColor Yellow
Write-Host "Server se chay tai: http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "Nhan Ctrl+C de dung server" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Khởi động Flask server
Set-Location $PSScriptRoot
$env:PYTHONIOENCODING = 'utf-8'
python server/app.py

