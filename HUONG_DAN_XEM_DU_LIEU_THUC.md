# HƯỚNG DẪN XEM DỮ LIỆU THỰC TẾ (US03)

## ⚠️ LƯU Ý QUAN TRỌNG

**Trang `dashboard_demo.html`** chỉ là trang DEMO với dữ liệu MẪU để xem giao diện.
**Trang `dashboard.html`** mới là trang THỰC TẾ lấy dữ liệu từ database của bạn.

---

## 📊 CÁCH XEM DỮ LIỆU THỰC TẾ

### Bước 1: Đăng nhập vào hệ thống

1. Mở file: `client/public/index.html`
2. Đăng ký tài khoản mới (nếu chưa có) hoặc đăng nhập
3. Sau khi đăng nhập thành công, bạn sẽ được chuyển đến `dashboard.html`

### Bước 2: Thêm giao dịch để có dữ liệu

Trong Dashboard, bạn sẽ thấy form "Thêm Giao Dịch":

1. **Chọn loại giao dịch:**
   - Tab "Chi tiêu" (màu đỏ) - cho các khoản chi
   - Tab "Thu nhập" (màu xanh) - cho các khoản thu

2. **Điền thông tin:**
   - **Số tiền**: Nhập số tiền (VD: 100000)
   - **Danh mục**: Chọn danh mục phù hợp (Ăn uống, Di chuyển, Lương, v.v.)
   - **Ngày**: Chọn ngày giao dịch
   - **Ghi chú**: Mô tả ngắn (tùy chọn)

3. **Nhấn "Lưu Giao Dịch"**

4. **Dữ liệu sẽ tự động cập nhật:**
   - Tổng quan số liệu (Tổng Thu, Tổng Chi, Số Dư)
   - Biểu đồ chi tiêu theo danh mục
   - Biểu đồ thu/chi theo tháng
   - Danh sách thông báo giao dịch gần đây

---

## 🔍 KIỂM TRA DỮ LIỆU TRONG DATABASE

### Cách 1: Qua Dashboard (Khuyên dùng)
- Đăng nhập và xem trực tiếp trên Dashboard
- Tất cả số liệu đều được tính từ database

### Cách 2: Qua Script Python
Chạy lệnh:
```powershell
python check_data.py
```

Script này sẽ hiển thị:
- Số lượng người dùng
- Số lượng giao dịch
- Danh sách giao dịch gần đây
- Tổng quan số dư theo từng người dùng

### Cách 3: Qua MySQL Workbench
1. Mở MySQL Workbench
2. Kết nối đến database `financial_app`
3. Chạy các query:
   ```sql
   -- Xem tất cả giao dịch
   SELECT * FROM transactions;
   
   -- Xem tổng thu/chi theo user
   SELECT 
       u.name,
       SUM(CASE WHEN t.type='income' THEN t.amount ELSE 0 END) as total_income,
       SUM(CASE WHEN t.type='expense' THEN t.amount ELSE 0 END) as total_expense,
       SUM(CASE WHEN t.type='income' THEN t.amount ELSE 0 END) - 
       SUM(CASE WHEN t.type='expense' THEN t.amount ELSE 0 END) as balance
   FROM users u
   LEFT JOIN transactions t ON u.user_id = t.user_id
   GROUP BY u.user_id, u.name;
   ```

---

## 📈 CÁCH DỮ LIỆU ĐƯỢC TÍNH TOÁN

### Trong Dashboard thực tế (`dashboard.html`):

1. **Tổng quan số liệu:**
   - Gọi API: `GET /api/balance?user_id=...`
   - Tính: `Số Dư = Tổng Thu - Tổng Chi`
   - Dữ liệu lấy từ bảng `transactions` trong database

2. **Biểu đồ chi tiêu theo danh mục:**
   - Gọi API: `GET /api/transactions/stats?user_id=...`
   - Nhóm theo `category_id` và tính tổng `amount`
   - Chỉ hiển thị các giao dịch loại `expense`

3. **Biểu đồ thu/chi theo tháng:**
   - Gọi API: `GET /api/transactions/stats?user_id=...`
   - Nhóm theo tháng (YYYY-MM) từ `transaction_date`
   - Tính tổng `income` và `expense` theo từng tháng

---

## 🎯 TÓM TẮT

- **Trang DEMO**: Dữ liệu mẫu (hardcoded) - chỉ để xem giao diện
- **Trang THỰC**: Dữ liệu từ database - cần đăng nhập và thêm giao dịch
- **Để có dữ liệu**: Đăng nhập → Thêm giao dịch → Xem thống kê tự động cập nhật

---

## 💡 GỢI Ý

Để test đầy đủ US03, hãy thêm một số giao dịch mẫu:
- 2-3 giao dịch Thu nhập (Lương, Thưởng)
- 5-7 giao dịch Chi tiêu (Ăn uống, Di chuyển, Mua sắm)
- Chọn các ngày khác nhau để thấy biểu đồ theo tháng

Sau đó Dashboard sẽ hiển thị đầy đủ thống kê dựa trên dữ liệu bạn đã nhập!

