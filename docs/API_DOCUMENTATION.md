# TÀI LIỆU API HỆ THỐNG XÉOOO PIZZA & PASTA (RESTFUL SPECIFICATION)

Base URL: `https://api.xeooo-pizza.com/api/v1`  
Chuẩn giao tiếp: `JSON / REST / OpenAPI 3.1`  
Cơ chế bảo mật: `Bearer JWT Authorization`

---

## 1. Authentication & Security
- `POST /api/v1/auth/login`: Đăng nhập bằng mã PIN nhân viên hoặc mật khẩu quản trị.
  - Request: `{"username": "thuhanv", "pin": "1234"}`
  - Response: `{"token": "ey...", "refreshToken": "ey...", "user": {...}}`
- `POST /api/v1/auth/refresh-token`: Cấp lại JWT Token mới khi access token hết hạn.
- `POST /api/v1/auth/verify-2fa`: Xác thực mã OTP 6 chữ số cho Quản Lý.

---

## 2. Reservations & Tables
- `GET /api/v1/reservations`: Lấy danh sách đặt bàn (Query: `date`, `floor`, `status`).
- `POST /api/v1/reservations`: Tạo đặt bàn mới trực tuyến kèm tạo mã VietQR tự động.
- `PATCH /api/v1/reservations/{id}/status`: Cập nhật trạng thái (`confirmed`, `seated`, `completed`, `cancelled`).
- `POST /api/v1/tables/merge`: Gộp 2 bàn phục vụ đoàn khách đông.
- `POST /api/v1/tables/split`: Tách bàn đã gộp về trạng thái độc lập ban đầu.
- `POST /api/v1/tables/move`: Chuyển khách sang vị trí bàn trống khác.

---

## 3. Kitchen Display System (KDS)
- `GET /api/v1/kitchen/orders`: Lấy hàng đợi các món đang cần bếp nấu.
- `PATCH /api/v1/kitchen/orders/{id}/status`: Đổi trạng thái chế biến (`pending` ➔ `cooking` ➔ `ready` ➔ `served`).

---

## 4. Billing & E-Invoice
- `POST /api/v1/billing/split`: Tính toán chia hóa đơn theo số người hoặc theo món.
- `POST /api/v1/billing/e-invoice`: Phát hành hóa đơn điện tử VAT 8% chuẩn thuế.
- `POST /api/v1/billing/refund`: Tiếp nhận và xử lý yêu cầu hoàn tiền cọc giữ chỗ.

---

## 5. AI Suite & Forecast
- `POST /api/v1/ai/traffic-forecast`: Trả về dự báo lượng khách theo từng khung 30 phút.
- `POST /api/v1/ai/anomalies`: Quét và phát hiện đặt bàn nghi ngờ spam/số ảo.
- `POST /api/v1/ai/chatbot`: Trả lời câu hỏi tư vấn thực đơn và vị trí bàn view đẹp.
