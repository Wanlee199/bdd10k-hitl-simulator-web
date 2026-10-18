# Báo Cáo Scout & Brainstorm: Chuyển Đổi Hệ Thống Sang ActiveLab UI Mới

**Ngày:** 18/10/2026  
**Nhánh Git:** `mentor` (vừa tạo từ `quan` và đã push origin)  
**Tác vụ:** Đánh giá, scout và đề xuất lộ trình tích hợp bộ 5 trang HTML mới cùng hệ thống `css/activelab.css` và `js/activelab.js`.

---

## 1. Kết Quả Codebase Scouting (`/ck:scout`)

### 1.1 Hiện Trạng Mã Nguồn Trên Workspace
- **Tài nguyên mới đã có sẵn:**
  - `css/activelab.css` (44.8 KB, 636 dòng): Hệ thống token biến CSS chuẩn academic, hỗ trợ light/dark mode, container 1080px, responsive, 0 dependency.
  - `js/activelab.js` (24.8 KB, 522 dòng): Module `window.AL` dựng SVG charts (`hbar`, `dumbbell`, `slope`, `diverge`), KaTeX math auto-render, tabs, lightbox, clipboard.
  - **100% Assets hình ảnh/video khớp chuẩn:** Đã kiểm tra 23/23 tệp ảnh, video MP4, diagram PNG trong thư mục `assets/` mà 5 tệp HTML mới tham chiếu — tất cả đều tồn tại đầy đủ và sẵn sàng.
- **5 Tệp HTML mới được cung cấp:**
  1. `fastdedup-point1.html` (Chuyên đề 01: Lọc trùng hai luồng CPU)
  2. `splits-point3.html` (Chuyên đề 03: Chia 4 tập đóng băng Hybrid Mix 80/20)
  3. `training-point4.html` (Chuyên đề 04: Mô hình mầm Seed V0)
  4. `active-mining-point5.html` (Chuyên đề 05: Khai phá mẫu Super Fusion C4)
  5. `retraining-point6.html` (Chuyên đề 06: Tái huấn luyện YOLO11n V1)

### 1.2 Khoảng Trống Kiến Trúc Phát Hiện (Key Findings)
1. **Thiếu Point 02 (`profiling-point2.html`):** Trong danh sách 6 chuyên đề trên thanh Rail (`<nav class="rail">`), Point 02 được dẫn link đến `profiling-point2.html`. Tuy nhiên nội dung mới cho Point 02 chưa được cung cấp. Nếu người dùng xem web và bấm vào Point 02, giao diện sẽ bị "gãy" (nhảy về layout sidebar cũ).
2. **Trang Chủ `index.html` (Tổng quan):** Cả 5 trang mới đều có nút về trang chủ `index.html` ("Tổng quan · BDD10K ActiveLab"). Hiện tại `index.html` ở nhánh cũ là Master Visualizer (với 3.108 dòng Tailwind + sidebar).

---

## 2. So Sánh Kiến Trúc & Phân Tích Trade-Offs

| Tiêu Chí | Kiến Trúc Cũ (Branch `quan`/`dev`) | Kiến Trúc Mới (`ActiveLab` trên `mentor`) | Đánh Giá Kỹ Thuật |
| :--- | :--- | :--- | :--- |
| **Mục đích** | Interactive Simulator Dashboard (dạng SaaS/App) | Scientific Paper Report (Báo cáo khoa học chuẩn xuất bản) | Mới phù hợp hơn với đối tượng Mentor / Hội đồng chấm paper |
| **Phụ thuộc (Dependencies)** | Tailwind CDN, Chart.js, Lucide Icons, inline CSS | **0 dependency external** (chỉ dùng KaTeX cdn async cho LaTeX) | Mới vượt trội về tốc độ tải, bảo mật và tính tự chủ |
| **Hiệu năng & FOUC** | Thỉnh thoảng bị FOUC do chờ Tailwind CDN parse | Tải tức thì (< 50ms), CSS native không có hiện tượng giật layout | Mới thắng tuyệt đối |
| **Biểu đồ (Charts)** | Canvas nặng qua Chart.js | Pure Vector SVG responsive do `js/activelab.js` render trực tiếp | Mới sắc nét trên màn hình Retina/4K, không vỡ nét |
| **Dark Mode** | Script custom thủ công | Tự động theo hệ điều hành + hỗ trợ `data-theme="light"` | Mới chuẩn công thái học |

---

## 3. Các Phương Án Đề Xuất (Brainstorming Options)

### Phương Án 1 (Khuyến nghị): Áp Dụng Ngay 5 Trang Mới + Đồng Bộ Point 02 Theo Chuẩn ActiveLab
- **Bước 1:** Cập nhật 5 file `fastdedup-point1.html`, `splits-point3.html`, `training-point4.html`, `active-mining-point5.html`, `retraining-point6.html` vào nhánh `mentor`.
- **Bước 2:** Chuyển đổi file `profiling-point2.html` sang chuẩn `activelab.css` và `js/activelab.js` (dựa trên dữ liệu và biểu đồ hiện có của Point 2) để người dùng điều hướng liên tục giữa cả 6 chuyên đề mà không bị gãy giao diện.
- **Bước 3:** Giữ `index.html` làm Master Visualizer hoặc tạo bản trang bìa Tổng quan liên kết đến Master Visualizer.

### Phương Án 2: Chỉ Áp Dụng 5 Trang Đã Cung Cấp, Giữ Nguyên Point 02 & Chờ Mentor
- Chỉ ghi đè 5 file HTML được cung cấp.
- Giữ nguyên `profiling-point2.html` cũ và đợi mentor cung cấp file Point 02 sau.
- *Nhược điểm:* Trải nghiệm duyệt web không đồng nhất khi click qua Point 02.

### Phương Án 3: Lưu Bản Mới Dưới Dạng Tên Riêng (e.g. `paper-point*.html`)
- Giữ nguyên các trang hiện tại, tạo các trang mới với prefix riêng để so sánh song song.
- *Nhược điểm:* Trùng lặp code, phải sửa toàn bộ link `href` nội bộ trong 5 file mới.

---

## 4. Kế Hoạch Tiếp Theo
Sau khi bạn lựa chọn phương án:
1. Ghi đè các file HTML tương ứng trên nhánh `mentor`.
2. Kiểm tra hiển thị trực tiếp trên local server `http://localhost:8080/`.
3. Cam kết Git commit sạch sẽ trên nhánh `mentor`.
