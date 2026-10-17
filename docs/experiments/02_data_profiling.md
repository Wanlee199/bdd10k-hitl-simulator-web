# Báo Cáo Thực Nghiệm 02: Hồ Sơ Dữ Liệu Quang Học & Không Gian (Data Profiling)

> **Giai đoạn**: Phase 02 — Automated Data Profiling & Multi-Algorithm Tournament  
> **Notebook tham chiếu**: `notebooks/02_automated_data_profiling_benchmark.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Xây dựng hệ thống tự động trích xuất các chỉ số định lượng quang học và cấu trúc không gian 5D cho toàn bộ kho dữ liệu Unique Pool mà không phụ thuộc vào nhãn gán trước.
- Tổ chức giải đấu thực nghiệm đối đầu giữa các thuật toán ứng viên trên 5 Sub-Points để chọn ra thuật toán chính xác nhất ghi trường vào tệp kê khai dữ liệu (`data_profiling_manifest.json`).

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ2.1*: Làm thế nào để phân loại chính xác điều kiện ban đêm (`is_night`) và loại bỏ ảnh hưởng lóa đèn pha ngược chiều?
- *RQ2.2*: Phương pháp đo độ sắc nét / rung mờ (`is_blur`) nào kháng được vùng bầu trời phẳng đơn sắc và bắt trọn rung lắc chuyển động xe?
- *RQ2.3*: Làm thế nào để nhận diện thời tiết suy thoái (`is_weather_degraded`) mà không bị ảo giác trên mặt đường nhựa tối màu?
- *RQ2.4*: Mô hình hình học không gian nào phân định chính xác thứ tự che khuất (`is_high_occlusion`) giữa các vật thể?
- *RQ2.5*: Phân định cảnh giao thông đông đúc (`is_dense`) dựa trên thang đo đối tượng như thế nào?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Dữ liệu đầu vào**: Kho ảnh duy nhất từ Phase 01 (`data/processed/unique_pool`).
- **Mỏ neo kiểm chứng (Ground-Truth Anchors)**: Siêu dữ liệu gốc do UC Berkeley cung cấp (`timeofday`, `weather`, `scene`, tọa độ bounding boxes).
- **Trạng thái**: `TBD — Ghi nhận số lượng mẫu tham gia hồ sơ hóa.`

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
- **Sub-Point 2.1 (Ánh sáng)**: Mean Grayscale vs Otsu Adaptive Thresholding vs YCbCr P50 Median.
- **Sub-Point 2.2 (Độ mờ)**: Laplacian Variance $\sigma^2(\nabla^2 I)$ vs Edge-Gated Tenengrad vs Tenengrad + 2D-FFT Energy Slope.
- **Sub-Point 2.3 (Thời tiết)**: He et al. Dark Channel Prior (DCP) vs DCP Ngưỡng gắt vs DCP + Clear Day Guard.
- **Sub-Point 2.4 (Che khuất)**: Naive 2D IoU Overlap vs Intersection over Min-Area vs Directed DAG + $y_{\text{bottom}}$.
- **Sub-Point 2.5 (Mật độ)**: Phân bố số lượng hộp nhãn và diện tích tương đối.

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Đối chiếu song song kết quả của từng thuật toán ứng viên với mỏ neo nhãn gốc BDD10K.
- Kiểm toán mắt người độc lập (Human Audit) trên 100 mẫu ứng viên rung nhòe quang học.
- Đo lường thông lượng FPS trên CPU đơn lẻ để đảm bảo khả năng mở rộng hàng triệu ảnh.
- `TBD — Chi tiết cấu hình tham số trong notebook 02.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **Độ chính xác phân loại**: Precision, Recall, F1-Score so với mỏ neo nhãn gốc.
- **Tỷ lệ báo động giả (False Positive Rate)** trên các ca đặc biệt (đèn pha, bầu trời, mặt đường nhựa).
- **Thông lượng xử lý (Processing Throughput)**: FPS trên CPU.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng điểm giải đấu 3 thuật toán Sub-Point 2.1 (Ánh sáng)*: `TBD`
- *Bảng điểm giải đấu 3 thuật toán Sub-Point 2.2 (Độ mờ & Rung lắc)*: `TBD`
- *Bảng điểm giải đấu 3 thuật toán Sub-Point 2.3 (Thời tiết suy thoái)*: `TBD`
- *Bảng điểm giải đấu 3 thuật toán Sub-Point 2.4 (Đồ thị che khuất DAG)*: `TBD`
- *Độ tin cậy khoảng tin cậy Bootstrap 95% CI*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Quán quân từng Sub-Point**: `TBD — Ghi nhận các thuật toán được cấp quyền ghi manifest.`
- **Lý do lựa chọn**:
  - `TBD — Phân tích chi tiết nguyên nhân vượt trội của các phương pháp quán quân.`

---

## 9. Limitations — Hạn Chế
- Thuật toán thời tiết vẫn có độ trễ nhận diện khi mưa phùn hạt rất mịn.
- `TBD — Ghi nhận các trường hợp biên chưa tối ưu.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/02_automated_data_profiling_benchmark.ipynb
  ```
- **Artifacts đầu ra**:
  - `data/processed/data_profiling_manifest.json`
  - `results/phase_02/tables/` (Các bảng đối chuẩn kết quả thực nghiệm).

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: Frozen Splits &rarr;](03_frozen_splits.md)
