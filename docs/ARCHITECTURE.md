# KIẾN TRÚC HỆ THỐNG XÉOOO PIZZA & PASTA (ENTERPRISE ARCHITECTURE)

## 1. Tổng Quan Kiến Trúc (Architecture Overview)
Hệ thống **Xéooo Pizza & Pasta v4.2** được thiết kế theo mô hình **Multi-Tier Micro-Modular Architecture**:
- **Presentation Tier (Frontend)**: React 18, TypeScript, Tailwind CSS, Vite, Progressive Web App (PWA) với Service Worker & Offline Cache.
- **Application Tier (Backend)**: Java 17, Spring Boot 3.3.4, Spring Security 6, JPA Hibernate, OpenAPI 3.0.
- **Data Tier (Database)**: Microsoft SQL Server 2022 Developer/Enterprise Edition với bảng phân hoạch, Trigger kiểm toán và chỉ mục tối ưu hóa cho truy vấn theo thời gian thực.
- **AI & Analytics Engine**: Tích hợp Google Gemini AI và thuật toán Heuristic Predictive Engine cho dự báo lưu lượng khách và phân tích ABC Menu.

---

## 2. Mô Hình Phân Lớp (Layered Design)
```
[ Client Browser / PWA Mobile / POS Terminal ]
                     │
                     ▼ (HTTPS / WSS / JWT)
[ Reverse Proxy Nginx & Load Balancer ]
       │                                │
       ▼                                ▼
[ React 18 SPA (Vite) ]        [ Spring Boot 3 REST API ]
  ├── Contexts & Hooks           ├── Controllers & DTOs
  ├── Service Layer (HTTP)       ├── Services & Business Logic
  └── PWA Service Worker         ├── Spring Security (JWT / RBAC)
                                 └── JPA Repositories
                                        │
                                        ▼ (HikariCP / TLS)
                          [ Microsoft SQL Server 2022 ]
                            ├── Reservations & Tables
                            ├── Kitchen KDS Queue
                            ├── Inventory & Recipes
                            └── Audit Logs (System Trail)
```

---

## 3. Quản Lý Trạng Thái & Bộ Nhớ Đệm (State & Caching)
- **Local & Session Cache**: Lưu trữ dữ liệu phiên, offline queue, giỏ hàng đặt món trước bằng `localStorage` có cơ chế checksum và phục hồi lỗi tự động.
- **Event Bus & WebSocket Sync**: Đồng bộ trạng thái tức thì giữa quầy thu ngân, nhân viên chạy bàn và đầu bếp (KDS).
- **HTTP Deduplication**: `HttpService` tự động loại bỏ các yêu cầu trùng lặp trong khoảng thời gian 300ms và áp dụng cơ chế Exponential Backoff khi gặp sự cố đường truyền.

---

## 4. Mô Hình An Ninh & Bảo Mật (Security Model)
1. **Role-Based Access Control (RBAC)**: Phân quyền chặt chẽ theo 4 cấp bậc (`CUSTOMER`, `STAFF`, `CASHIER`, `MANAGER`).
2. **Xác Thực 2 Lớp (2FA)**: Áp dụng mã OTP và mô phỏng WebAuthn FIDO2 sinh trắc học cho cấp quản lý.
3. **Chống Tấn Công Web**:
   - **XSS**: Làm sạch dữ liệu đầu vào qua hàm `sanitizeInput`.
   - **CSRF**: Header token tùy chỉnh `X-CSRF-Token` kèm thuộc tính Cookie `SameSite=Strict`.
   - **Rate Limiting**: Giới hạn tối đa 40 request / 10 giây trên mỗi client để ngăn chặn Brute-force và DoS.
