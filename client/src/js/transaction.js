document.addEventListener("DOMContentLoaded", function () {
  // === 1. CẤU HÌNH DANH SÁCH DANH MỤC (Đã cập nhật theo yêu cầu) ===
  const categories = {
    // Danh sách Chi tiêu
    expense: [
      "Ăn uống",
      "Học tập",
      "Vui chơi",
      "Quần áo",
      "Cưới vợ",
      "Di chuyển",
      "Tiền nhà",
      "Khác",
    ],
    // Danh sách Thu nhập
    income: ["Lương", "Thưởng", "Lãi tiết kiệm", "Được tặng", "Khác"],
  };

  let currentType = "expense"; // Mặc định là Chi tiêu

  // === 2. LẤY CÁC THẺ HTML ===
  const expenseTab = document.getElementById("expense-tab");
  const incomeTab = document.getElementById("income-tab");
  const categorySelect = document.getElementById("transactionCategory");
  const form = document.getElementById("transactionForm");
  const dateInput = document.getElementById("transactionDate");
  const btnSubmit = document.getElementById("btnSubmit"); // Nút lưu

  // === 3. HÀM XỬ LÝ ===

  // Hàm nạp danh mục vào ô chọn (Dropdown)
  function loadCategories(type) {
    // Xóa danh sách cũ
    categorySelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';

    // Lấy danh sách mới
    const list = categories[type];

    // Tạo từng dòng option
    if (list) {
      list.forEach((catName) => {
        const option = document.createElement("option");
        option.value = catName;
        option.textContent = catName;
        categorySelect.appendChild(option);
      });
    }
  }

  // Hàm set ngày hôm nay
  function setToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Hàm đổi Tab (Thu / Chi)
  function switchTab(type) {
    currentType = type;

    if (type === "expense") {
      // Đang chọn Chi tiêu
      expenseTab.classList.add("active");
      incomeTab.classList.remove("active");
      document.body.classList.remove("mode-income"); // Xóa màu xanh

      // Đổi chữ trên nút
      if (btnSubmit) btnSubmit.innerText = "Lưu khoản Chi";
    } else {
      // Đang chọn Thu nhập
      incomeTab.classList.add("active");
      expenseTab.classList.remove("active");
      document.body.classList.add("mode-income"); // Thêm màu xanh

      // Đổi chữ trên nút
      if (btnSubmit) btnSubmit.innerText = "Lưu khoản Thu";
    }

    // Nạp lại danh mục tương ứng
    loadCategories(type);
  }

  // === 4. BẮT SỰ KIỆN (CLICK & SUBMIT) ===

  // Khi bấm tab Chi tiêu
  if (expenseTab)
    expenseTab.addEventListener("click", () => switchTab("expense"));

  // Khi bấm tab Thu nhập
  if (incomeTab) incomeTab.addEventListener("click", () => switchTab("income"));

  // Khi bấm nút Lưu (Submit form)
  if (form)
    form.addEventListener("submit", async function (e) {
      e.preventDefault(); // Chặn reload trang

      // Lấy dữ liệu từ form
      const amount = document.getElementById("transactionAmount").value;
      const category = categorySelect.value;
      const date = dateInput.value;
      const note = document.getElementById("transactionDescription").value;

      // Kiểm tra dữ liệu
      if (!amount || amount <= 0) {
        alert("Vui lòng nhập số tiền hợp lệ!");
        return;
      }
      if (!category) {
        alert("Vui lòng chọn danh mục!");
        return;
      }

      const formData = {
        amount: amount,
        category: category,
        transaction_date: date,
        description: note,
        type: currentType,
      };

      // Gửi về Server (Python)
      try {
        const response = await fetch("/api/transaction/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("✅ Đã lưu thành công!");

          // Reset form sau khi lưu
          document.getElementById("transactionAmount").value = "";
          document.getElementById("transactionDescription").value = "";
          categorySelect.value = "";
          setToday();
        } else {
          alert("❌ Lỗi khi lưu dữ liệu!");
        }
      } catch (error) {
        console.error(error);
        alert("⚠️ Lỗi kết nối Server! (Bạn đã bật python app.py chưa?)");
      }
    });

  // === 5. CHẠY LẦN ĐẦU KHI VÀO TRANG ===
  loadCategories("expense"); // Nạp danh mục chi tiêu mặc định
  setToday(); // Điền ngày hôm nay
});
