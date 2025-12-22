# HƯỚNG DẪN KHẮC PHỤC LỖI KẾT NỐI SERVER

## Vấn đề: MySQL Server chưa được khởi động

Lỗi: `2003 (HY000): Can't connect to MySQL server on 'localhost:3306' (10061)`

## Cách khắc phục:

### Cách 1: Khởi động MySQL qua Services (Khuyên dùng)

1. Nhấn `Windows + R`
2. Gõ `services.msc` và nhấn Enter
3. Tìm service có tên:
   - `MySQL` hoặc
   - `MySQL80` hoặc  
   - `MySQL57` hoặc
   - Tên tương tự có chứa "MySQL"
4. Nhấp chuột phải → Chọn **"Start"** hoặc **"Restart"**
5. Đợi vài giây để MySQL khởi động xong

### Cách 2: Khởi động MySQL qua Command Line

Mở PowerShell hoặc CMD với quyền Administrator và chạy:

```powershell
# Tìm tên service MySQL
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Khởi động MySQL (thay MySQL80 bằng tên service thực tế của bạn)
Start-Service MySQL80
```

### Cách 3: Khởi động MySQL qua MySQL Workbench

1. Mở MySQL Workbench
2. Nếu MySQL chưa chạy, Workbench sẽ tự động đề xuất khởi động
3. Hoặc vào Server → Startup/Shutdown → Start Server

### Sau khi khởi động MySQL:

1. Chạy lại server Flask:
   ```powershell
   cd c:\Users\Admin\QuanLyChiTieu_Web_App_SmartWallet
   python server/app.py
   ```

2. Hoặc chạy script test:
   ```powershell
   python test_server.py
   ```

3. Kiểm tra server đã chạy:
   - Mở trình duyệt: http://127.0.0.1:5000/
   - Nếu thấy: "Backend Server is running..." → Thành công!

## Kiểm tra MySQL đã chạy:

```powershell
# Kiểm tra cổng 3306
netstat -ano | Select-String "3306"

# Hoặc test kết nối
python -c "import mysql.connector; from dotenv import load_dotenv; import os; load_dotenv(); db = mysql.connector.connect(host='localhost', user='root', password=os.getenv('MYSQL_ROOT_PASSWORD')); print('MySQL OK!'); db.close()"
```

## Nếu vẫn không được:

1. Kiểm tra MySQL đã được cài đặt chưa
2. Kiểm tra mật khẩu trong file `.env` có đúng không
3. Kiểm tra MySQL có đang chạy trên cổng 3306 không (có thể đổi cổng)

