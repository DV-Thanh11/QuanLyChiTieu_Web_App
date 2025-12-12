document.addEventListener('DOMContentLoaded', () => {
    // 1. Khai báo các phần tử DOM cần thiết
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
    const toggleLoginBtn = document.getElementById('toggleLoginBtn');
    const registerSection = document.getElementById('registerSection');
    const messageDisplay = document.getElementById('message');
    const authTitle = document.getElementById('authTitle');

    // Hàm hiển thị thông báo lỗi/thành công// Địa chỉ base URL của API Flask (chạy trên cổng 5000)
const API_BASE_URL = 'http://127.0.0.1:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Khai báo các phần tử DOM cần thiết
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
    const toggleLoginBtn = document.getElementById('toggleLoginBtn');
    const registerSection = document.getElementById('registerSection');
    const messageDisplay = document.getElementById('message');
    const authTitle = document.getElementById('authTitle');
    
    // Khai báo thêm vùng hiển thị lời chào (MỚI)
    const welcomeMessage = document.getElementById('welcomeMessage');

    // Hàm hiển thị thông báo lỗi/thành công
    function showMessage(msg, type) {
        messageDisplay.textContent = msg;
        messageDisplay.style.color = type === 'error' ? 'red' : 'green';
    }
    
   // ... (Các dòng code khác giữ nguyên) ...

    // Hàm cập nhật lời chào theo yêu cầu của bạn
    function updateWelcomeMessage(state) {
        let title = '';
        // SỬ DỤNG THẺ <b> VÀ CHỈNH SỬA CÁC ĐỊNH DẠNG KHÁC TRONG DÒNG CHÚC MỪNG
        if (state === 'login') {
            title = 'Chào mừng quay trở lại với <b>SmartWallet</b>'; 
        } else { // state === 'register'
            title = 'Chào mừng bạn lần đầu đến với <b>SmartWallet</b>';
        }
        
        // Đoạn HTML chèn vào vùng welcomeMessage
        welcomeMessage.innerHTML = `
            <h3 style="margin-bottom: 5px;">${title}</h3>
            <p style="color: #6c757d; font-size: 0.9em; margin-bottom: 10px;">Chúc bạn có một trải nghiệm tuyệt vời</p>
            <hr style="border: 0; border-top: 1px solid #eee;">
        `;
    }


    
    // Khởi tạo lời chào ban đầu (trạng thái Đăng nhập)
    updateWelcomeMessage('login');

    // Hàm chuyển đổi sang Form Đăng ký
    toggleRegisterBtn.addEventListener('click', () => {
        registerSection.style.display = 'block';
        loginForm.style.display = 'none';
        authTitle.textContent = 'Đăng Ký Tài Khoản';
        updateWelcomeMessage('register'); // Cập nhật lời chào
        messageDisplay.textContent = ''; 
    });

    // Hàm chuyển đổi về Form Đăng nhập
    toggleLoginBtn.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginForm.style.display = 'block';
        authTitle.textContent = 'Đăng Nhập';
        updateWelcomeMessage('login'); // Cập nhật lời chào
        messageDisplay.textContent = '';
    });

    // --- Xử lý ĐĂNG KÝ (US01) ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // 1. Validation mật khẩu Front-end
        if (password !== confirmPassword) {
            showMessage("Lỗi: Mật khẩu xác nhận không khớp.", 'error');
            return;
        }
        if (password.length < 6) {
            showMessage("Lỗi: Mật khẩu phải có ít nhất 6 ký tự.", 'error');
            return;
        }
        
        showMessage("Đang xử lý đăng ký...", 'success');

        try {
            // 2. Gửi yêu cầu Đăng ký đến Back-end API
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const result = await response.json();

            // 3. Xử lý phản hồi từ Server
            if (response.ok) { // Mã 200-299, ví dụ 201 Created
                showMessage(result.message + " Vui lòng đăng nhập.", 'success');
                registerForm.reset();
                toggleLoginBtn.click(); // Tự động chuyển về form Đăng nhập
            } else {
                // Mã lỗi Server (409 Conflict, 400 Bad Request, 500 Server Error,...)
                showMessage("Lỗi ĐK: " + result.message, 'error');
            }
        } catch (error) {
            showMessage("Lỗi kết nối Server. Vui lòng kiểm tra Back-end.", 'error');
        }
    });

    // --- Xử lý ĐĂNG NHẬP (US01) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        showMessage("Đang đăng nhập...", 'success');

        try {
            // 1. Gửi yêu cầu Đăng nhập đến Back-end API
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            // 2. Xử lý phản hồi từ Server
            if (response.ok) { // Mã 200 OK
                // Đăng nhập thành công: Lưu user_id và name vào session (LocalStorage)
                localStorage.setItem('user_id', result.user_id);
                localStorage.setItem('user_name', result.name);
                
                showMessage(result.message + " Chuyển hướng đến Dashboard...", 'success');
                
                // Chuyển hướng sau 1 giây
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; 
                }, 1000); 
            } else {
                // Mã lỗi Server (401 Unauthorized,...)
                showMessage("Lỗi ĐN: " + result.message, 'error');
            }
        } catch (error) {
             showMessage("Lỗi kết nối Server. Vui lòng kiểm tra Back-end.", 'error');
        }
    });

});
    function showMessage(msg, type) {
        messageDisplay.textContent = msg;
        messageDisplay.style.color = type === 'error' ? 'red' : 'green';
    }
    
    // Hàm chuyển đổi sang Form Đăng ký
    toggleRegisterBtn.addEventListener('click', () => {
        registerSection.style.display = 'block';
        loginForm.style.display = 'none';
        authTitle.textContent = 'Đăng Ký Tài Khoản';
        messageDisplay.textContent = ''; // Xóa thông báo cũ
    });

    // Hàm chuyển đổi về Form Đăng nhập
    toggleLoginBtn.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginForm.style.display = 'block';
        authTitle.textContent = 'Đăng Nhập';
        messageDisplay.textContent = '';
    });

    // --- Xử lý ĐĂNG KÝ (US01) ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // 1. Validation mật khẩu
        if (password !== confirmPassword) {
            showMessage("Lỗi: Mật khẩu xác nhận không khớp.", 'error');
            return;
        }
        if (password.length < 6) {
            showMessage("Lỗi: Mật khẩu phải có ít nhất 6 ký tự.", 'error');
            return;
        }

        // 2. Lấy dữ liệu người dùng hiện tại từ LocalStorage (mô phỏng DB)
        // Dữ liệu được lưu dưới dạng: { email: { name: '...', password: '...' } }
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        // 3. Kiểm tra trùng email
        if (users[email]) {
            showMessage("Lỗi: Email này đã được đăng ký.", 'error');
            return;
        }

        // 4. Lưu người dùng mới
        users[email] = { name: name, password: password, transactions: [] }; // Thêm mảng transactions
        localStorage.setItem('users', JSON.stringify(users));

        showMessage("Đăng ký thành công! Quay lại Đăng nhập.", 'success');
        registerForm.reset();
        
        // Tự động chuyển về form Đăng nhập
        toggleLoginBtn.click();
    });

    // --- Xử lý ĐĂNG NHẬP (US01) ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const user = users[email];

        // 1. Kiểm tra Email và Mật khẩu
        if (user && user.password === password) {
            // 2. Đăng nhập thành công: Lưu thông tin người dùng đang hoạt động
            localStorage.setItem('currentUserEmail', email);
            showMessage("Đăng nhập thành công! Đang chuyển hướng...", 'success');
            
            // 3. Chuyển hướng đến trang Dashboard (US03)
            window.location.href = 'dashboard.html'; 
        } else {
            showMessage("Lỗi: Email hoặc Mật khẩu không đúng.", 'error');
        }
    });

});