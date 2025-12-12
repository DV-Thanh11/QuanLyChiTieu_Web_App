-- Thiết kế bảng users (Dùng cho US01: Đăng nhập/Đăng ký)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính, ID người dùng
    name VARCHAR(100) NOT NULL,            -- Tên người dùng
    email VARCHAR(100) NOT NULL UNIQUE,    -- Email (Duy nhất, dùng làm tên đăng nhập)
    password_hash VARCHAR(255) NOT NULL,   -- Mật khẩu đã được mã hóa (bảo mật)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Thời gian tạo tài khoản
);