# Báo Cáo Thực Nghiệm 03: Phân Chia Tập Đóng Băng & Chống Rò Rỉ (Frozen Splits)

> **Giai đoạn**: Phase 03 — Shared Frozen Test & Val Splits Benchmark  
> **Notebook tham chiếu**: `notebooks/03_shared_frozen_test_val_splits.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Thiết lập tập kiểm thử (**Frozen Test Set**) và kiểm định (**Frozen Val Set**) bất biến dùng chung cho toàn bộ các chu kỳ học tập chủ động sau này.
- Tổ chức giải đấu giữa 6 chiến lược phân chia nhằm tìm ra phương án tối ưu hóa hàm mục tiêu xếp hạng tổng hợp **Composite Benchmark Score (CBS)**.
- Xây dựng rào chắn kiểm toán rò rỉ kép (**Anti-Leakage Dual Barrier**) ngăn ngừa 100% video sequence overlap và vi phạm khoảng cách băm tri giác pHash giữa tập Test và Pool.

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ3.1*: Chiến lược phân chia nào đảm bảo độ bao phủ không gian đặc trưng tối đa ($R_{\text{cov}}$ cực tiểu) và bảo tồn đồng đều tỷ lệ 10 lớp đối tượng?
- *RQ3.2*: Làm thế nào để phân chia dữ liệu theo cụm video sequence mà vẫn đáp ứng nghiêm ngặt các quota lát cắt khó (đêm, thời tiết, che khuất)?
- *RQ3.3*: Khoảng cách pHash tối thiểu giữa các tập dữ liệu cần đạt bao nhiêu bit để đảm bảo không xảy ra hiện tượng rò rỉ dữ liệu vô hình (Visual Data Leakage)?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Dữ liệu đầu vào**: Hồ sơ đặc trưng 5D từ Phase 02 (`data_profiling_manifest.json`).
- **Ràng buộc tỷ lệ phân chia**: Đóng băng 20% cho Test, 10% cho Val, phần còn lại dành cho Seed V0 và Unlabeled Pool.
- **Ràng buộc cách ly**: Không cho phép bất kỳ cặp frame nào từ cùng một video sequence xuất hiện đồng thời ở Test và Train/Pool.

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Chiến lược 1 (Baseline)**: Random Group Splitter (Phân chia cụm ngẫu nhiên).
2. **Chiến lược 2**: Direct Metadata Stratified Splitter (Phân tầng theo nhãn thuộc tính trực tiếp).
3. **Chiến lược 3**: Stratified Minimax k-Center Splitter (Gonzalez Core-Set).
4. **Chiến lược 4**: Submodular Facility Location Splitter (Tối ưu hóa độ đại diện cụm).
5. **Chiến lược 5 (Đề xuất)**: **Hybrid Mix 80/20** (80% Facility Location + 20% Gonzalez k-Center).
6. **Chiến lược 6**: Hybrid Mix 70/30 (70% Facility Location + 30% Gonzalez k-Center).

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Gom cụm toàn bộ ảnh theo chuỗi `video_name` độc lập.
- Chạy song song 6 chiến lược phân chia với cùng một seed ngẫu nhiên cố định (`seed=42`).
- Chấm điểm hàm mục tiêu tổng hợp CBS trên thang điểm chuẩn hóa 0 &ndash; 100:
  $$\text{CBS} = 0.35 \cdot S_{\text{quota}} + 0.25 \cdot S_{\text{class}} + 0.20 \cdot S_{R_{\text{cov}}} + 0.20 \cdot S_{F_{\text{loc}}} - \text{Penalty}_{\text{leak}}$$
- Quét kiểm toán rò rỉ chéo ma trận pHash toàn phần trên hàng triệu cặp ảnh giữa Test set và Pool.

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **Điểm tổng hợp CBS (Composite Benchmark Score)**: Thang điểm 0 &ndash; 100.
- **Bán kính bao phủ cực đại ($R_{\text{cov}}$)**: Đo lường khoảng cách xa nhất từ điểm dữ liệu bất kỳ đến tâm đại diện gần nhất.
- **Điểm dàn đều tựa mô-đun ($S_{F_{\text{loc}}}$)**: Độ hội tụ về tâm cụm đặc trưng.
- **Độ tương đồng cosine phân bố lớp ($S_{\text{class}}$)**: Bảo tồn cấu trúc 10 lớp đối tượng.
- **Số cặp vi phạm rò rỉ dữ liệu**: Video sequence overlap và pHash Hamming $< 5$ bit.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng xếp hạng Leaderboard 6 chiến lược phân chia*: `TBD`
- *Chỉ số CBS và các thành phần của từng chiến lược*: `TBD`
- *Báo cáo kiểm toán quét chống rò rỉ pHash (số cặp đã quét và số vi phạm)*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Chiến lược quán quân**: `TBD — Ghi nhận chiến lược đạt điểm CBS cao nhất.`
- **Lý do lựa chọn**:
  - `TBD — Phân tích sự hài hòa giữa độ bao phủ biên và tính đại diện mật độ cụm.`

---

## 9. Limitations — Hạn Chế
- Thuật toán k-Center có thể nhạy cảm với các điểm ngoại lai nhiễu cực đoan trong không gian đặc trưng.
- `TBD — Ghi nhận các điểm cần lưu ý thêm.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/03_shared_frozen_test_val_splits.ipynb
  ```
- **Artifacts đầu ra**:
  - `data/splits/splits_manifest.json` (Danh mục phân chia chính thức).
  - `data/splits/dataset_checksum.sha256` (Chữ ký niêm phong tệp manifest).
  - `results/phase_03/tables/` (Bảng số liệu đối chuẩn giải đấu).

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: Seed Baseline &rarr;](04_seed_baseline.md)
