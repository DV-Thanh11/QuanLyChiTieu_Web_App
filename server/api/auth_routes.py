from flask import Blueprint, request, jsonify, current_app
import mysql.connector
import bcrypt # Dùng để mã hóa mật khẩu
auth_bp = Blueprint('auth', __name__)
def get_db_connection():
    # Hàm kết nối DB, sử dụng cấu hình từ app.py
    return mysql.connector.connect(
        host=current_app.config['MYSQL_HOST'],
        user=current_app.config['MYSQL_USER'],
        password=current_app.config['MYSQL_PASSWORD'],
        database=current_app.config['MYSQL_DB']
    )


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password').encode('utf-8') # Mã hóa mật khẩu thành bytes

    if not all([name, email, password]):
        return jsonify({"message": "Thiếu thông tin đăng ký bắt buộc."}), 400

    # 1. Mã hóa mật khẩu bằng bcrypt (an toàn)
    password_hash = bcrypt.hashpw(password, bcrypt.gensalt())
    
    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        # 2. Kiểm tra email đã tồn tại chưa (phải duy nhất)
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"message": "Email đã tồn tại."}), 409 # Mã lỗi Conflict
            
        # 3. Chèn người dùng mới vào DB
        sql = "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)"
        cursor.execute(sql, (name, email, password_hash))
        db.commit()
        
        return jsonify({"message": "Đăng ký thành công!"}), 201
        
    except mysql.connector.Error as err:
        print(f"Lỗi MySQL khi đăng ký: {err}")
        return jsonify({"message": "Lỗi server khi đăng ký."}), 500
    finally:
        if db and db.is_connected():
            cursor.close()
            db.close()


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password').encode('utf-8')

    if not all([email, password]):
        return jsonify({"message": "Thiếu thông tin đăng nhập."}), 400

    db = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True) # Trả về kết quả dưới dạng dictionary
        
        # 1. Tìm người dùng bằng email
        cursor.execute("SELECT user_id, name, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            # 2. So sánh mật khẩu đã mã hóa (kiểm tra mật khẩu)
            if bcrypt.checkpw(password, user['password_hash'].encode('utf-8')):
                # Đăng nhập thành công, trả về thông tin người dùng
                return jsonify({
                    "message": "Đăng nhập thành công!",
                    "user_id": user['user_id'],
                    "name": user['name']
                }), 200
            else:
                # Mật khẩu sai
                return jsonify({"message": "Email hoặc mật khẩu không đúng."}), 401
        else:
            # Email không tồn tại
            return jsonify({"message": "Email hoặc mật khẩu không đúng."}), 401
            
    except mysql.connector.Error as err:
        print(f"Lỗi MySQL khi đăng nhập: {err}")
        return jsonify({"message": "Lỗi server khi đăng nhập."}), 500
    finally:
        if db and db.is_connected():
            cursor.close()
            db.close()
