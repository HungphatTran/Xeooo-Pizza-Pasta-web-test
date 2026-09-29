# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG XÉOOO PIZZA & PASTA (PRODUCTION DEPLOYMENT)

Tài liệu hướng dẫn triển khai toàn bộ ứng dụng Xéooo Pizza & Pasta gồm giao diện React PWA, backend Spring Boot 3 và cơ sở dữ liệu Microsoft SQL Server 2022.

---

## 1. Yêu Cầu Hạ Tầng (System Requirements)
- **Hệ Điều Hành Khuyến Nghị**: Ubuntu 22.04 LTS hoặc RedHat Enterprise Linux 9.
- **Phần Cứng Tối Thiểu**: 4 vCPU, 8GB RAM, 50GB NVMe SSD.
- **Phần Mềm Cần Cài Đặt**: Docker Engine 24.0+, Docker Compose v2.20+, OpenSSL.

---

## 2. Triển Khai Bằng Docker Compose (Khuyến Nghị Nhanh Nhất)
1. Sao chép toàn bộ mã nguồn lên server:
   ```bash
   git clone https://github.com/xeooo/xeooo-restaurant-platform.git
   cd xeooo-restaurant-platform
   ```

2. Tạo file biến môi trường `.env`:
   ```env
   DB_PASSWORD=XeoooStrongP@ssw0rd2026!
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   ```

3. Khởi chạy toàn bộ hệ thống bằng 1 lệnh duy nhất:
   ```bash
   docker compose up -d --build
   ```

4. Kiểm tra trạng thái các container:
   ```bash
   docker compose ps
   ```
   - `xeooo-frontend`: Chạy cổng 3000 (React Nginx PWA).
   - `xeooo-backend`: Chạy cổng 8080 (Spring Boot 3 API).
   - `xeooo-sqlserver`: Chạy cổng 1433 (Microsoft SQL Server 2022).

---

## 3. Cấu Hình Tên Miền & Chứng Chỉ SSL Miễn Phí (Let's Encrypt Certbot)
Cài đặt chứng chỉ HTTPS cho tên miền chính thức `xeooo-pizza.com`:
```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d xeooo-pizza.com -d api.xeooo-pizza.com
```

---

## 4. Sao Lưu Cơ Sở Dữ Liệu Tự Động Hàng Ngày (Automated MSSQL Backup)
Thêm cronjob sao lưu cơ sở dữ liệu định kỳ vào lúc 02:00 sáng hàng ngày:
```bash
crontab -e
# Thêm dòng sau:
0 2 * * * docker exec xeooo-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'XeoooStrongP@ssw0rd2026!' -Q "BACKUP DATABASE XeoooRestaurantDB TO DISK = '/var/opt/mssql/backup_$(date +\%Y\%m\%d).bak' WITH FORMAT, MEDIANAME = 'XeoooBackups'"
```
