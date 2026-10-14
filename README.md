# 🚗 BDD10K Active Learning Lab — Frontend Interactive Simulator

> **Dự án**: Autonomous Driving Human-in-the-Loop Vision Engine Dashboard  
> **Tác giả**: Nguyễn Xuân Huỳnh  
> **Kiến trúc**: Vanilla JavaScript (ES6+ Modules) + Modern CSS Design System + HTML5 Canvas  
> **Mục đích**: Giả lập trải nghiệm 9 chặng toàn trình HITL, trực quan hóa đấu trường benchmark mAP@50 và mini-studio thẩm định gán nhãn AI.

---

## 🌟 Tính Năng Nổi Bật (Key Interactive Modules)

1. **Hero Live Telemetry HUD**:
   - Hiển thị các chỉ số đối chuẩn cốt lõi: Cách biệt `+4.95%` vs Random, Tiết kiệm `40.1%` ngân sách, Đánh bại trần 100% Target `+1.00%` (27.85% vs 26.85%), Thông lượng pHash `>360 FPS`, Rò rỉ dữ liệu `0 KB` Symlink.
   - Hiệu ứng đếm số mượt mà khi mở trang.

2. **The 9-Stage Interactive HITL Flywheel (Giả lập 9 chặng liên hoàn)**:
   - Thanh điều khiển trực quan: Bấm từng chặng (1 đến 9) hoặc bật nút **"▶ Mô Phỏng Vòng Lặp"** tự động chạy tuần tự với tốc độ tùy chỉnh (1x, 2x, 4x).
   - Mỗi chặng tích hợp công thức toán học, chỉ số phần cứng và **Sandbox trải nghiệm trực quan**:
     - *Chặng 1*: Máy đo khoảng cách Hamming pHash phát hiện và loại bỏ khung hình trùng lặp với KMV.
     - *Chặng 2*: Trích xuất 11 thuộc tính quang học (Tenengrad, Retinex, HSV).
     - *Chặng 3*: Sơ đồ phân chia cách ly Zero Data Leakage (Test 1.400, Val 700, Seed 500, Pool 4.394).
     - *Chặng 4*: Phân bổ 4 lát cắt khó cho Seed V0 (Đêm 35%, Nhỏ 20%, Che 20%, Ngày 25%).
     - *Chặng 5*: Slider tương tác thử nghiệm tính điểm khai thác C6 Super-Fusion.
     - *Chặng 6*: Cây phân luồng Consensus Router 2 tầng (AI Pre-label vs Chuyên gia CVAT).
     - *Chặng 7*: Đồ thị cột mô phỏng hội tụ hàm mất mát Focal Loss qua 15 epochs.
     - *Chặng 8*: Bảng kiểm tra 5 tầng rào chắn dừng an toàn (`VICTORY_CONFIRMED`).
     - *Chặng 9*: So sánh độ trễ lượng tử hóa INT8 (7.8ms vs 38.4ms FP32).

3. **"Be the Human Oracle" Mini-Studio (Trải nghiệm làm chuyên gia gán nhãn)**:
   - Khung hình Canvas mô phỏng camera hành trình ban đêm trời mưa với hiệu ứng ánh sáng đường ướt và vệt mưa.
   - Bounding boxes phân tầng: Tier 1 (Xe con & Đèn tín hiệu) vs Tier 2 (Người lái xe và người đi bộ trong bóng tối).
   - Nút tương tác:
     - Duyệt nhanh Tier 1 (tiết kiệm 26.67% thời gian).
     - Thẩm định và cứu các mẫu vật thể khó Tier 2.
     - Đóng gói Batch Vàng & Hiệu ứng ăn mừng nâng điểm mô hình lên 27.85%.

4. **Dynamic Benchmark Arena (Đấu trường điểm số & 10 lớp giao thông)**:
   - Thanh trượt dòng thời gian (Timeline Scrubber) qua 5 vòng lặp (V0 &rarr; V5).
   - Đồ thị đường cong học tập kép (Proposed Active vs Random Baseline vs 100% Target Ceiling).
   - Bảng phân rã chi tiết 10 lớp BDD10K với dấu sao ★ cho các lớp vượt trần.
   - Dynamic $C_w$ Deficit Weight Equalizer: 10 kênh cân bằng tự động ghìm `car` ở $0.20\times$ để tăng tốc lớp `train` từ $0\%$ lên $16.2\%$.
   - 🔬 **Panel Chẩn Đoán Hạt Giống & Lỗ Hổng Tri Thức (Seed Diagnostics & Error Audit)** *(Mới bổ sung)*:
     - Đối soát trực tiếp giữa **Nhãn Vàng Ground-Truth** vs **Dự đoán Model $V_{k-1}$**.
     - Thống kê tỷ lệ bỏ sót (*False Negatives* - Lỗ hổng tri thức cần vá) và ảo giác (*False Positives*).
     - Phân bổ 6 lát cắt khó (*Hard Slices*: Đêm, Nhỏ, Che khuất, Thời tiết, Rung mờ, Mật độ cao).
     - Bóc tách các cặp nhầm lẫn phân loại phổ biến (*Classification Confusions*: `car -> bus`, `car -> rider`, v.v.).
     - Trực quan hóa kết quả kiểm định giải đấu **Strategy Tournament** (Hybrid Mix 80/20 đạt 93.59 điểm) và báo cáo quét chống rò rỉ **13.454.400 cặp pHash** (0 vi phạm).

5. **ROI & Fleet Resource Calculator (Máy tính tối ưu chi phí đội xe)**:
   - 3 thanh trượt tùy chỉnh: Quy mô đội xe, Số giờ chạy/ngày, Chi phí gán nhãn ($/ảnh).
   - Tính toán ngay lập tức số tiền USD tiết kiệm được, số giờ làm việc giảm tải cho annotator và lượng $CO_2$ giảm thải.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

Website được xây dựng theo chuẩn **Option A: Pure Vanilla JS**, hoàn toàn không cần `npm install` hay build step phức tạp:

### Cách 1: Chạy trực tiếp bằng Python
```powershell
python -m http.server 8080 --directory srcFe
```
Mở trình duyệt truy cập: [http://localhost:8080](http://localhost:8080)

### Cách 2: Mở trực tiếp file `index.html`
Nhấp đúp chuột vào file `srcFe/index.html` trong trình duyệt bất kỳ (Chrome, Edge, Safari, Firefox).

---

## 🌐 Hướng Dẫn Deploy Lên GitHub Pages (1 Click)

1. Đẩy thư mục `srcFe` lên GitHub Repository của bạn.
2. Vào tab **Settings** của Repo &rarr; Chọn mục **Pages**.
3. Tại phần **Build and deployment**:
   - Source: Chọn `Deploy from a branch`.
   - Branch: Chọn `main` (hoặc nhánh của bạn) và chọn thư mục `/srcFe` (hoặc `/root` nếu đặt làm trang chủ).
4. Nhấn **Save**. Website sẽ hoạt động online miễn phí 100% trong vòng 1-2 phút!
