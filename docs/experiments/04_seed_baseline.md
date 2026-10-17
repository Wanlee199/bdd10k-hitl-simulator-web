# Báo Cáo Thực Nghiệm 04: Tập Mầm Baseline & Phân Rã Lát Cắt Khó (Seed Baseline)

> **Giai đoạn**: Phase 04 — Seed V0 Baseline Training & Hard Slices Ablation Study  
> **Notebook tham chiếu**: `notebooks/04_seed_v0_training_ablation.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Khởi tạo tập mầm (**Seed Dataset V0**) với quy mô ngân sách tối thiểu để huấn luyện mô hình cơ sở đầu tiên.
- Thực hiện nghiên cứu phân rã (Ablation Study) giữa các phương án phân bổ lát cắt khó nhằm xác định cấu trúc hạt giống tối ưu cho mô hình Active Learning xuất phát.
- Đánh giá đường cơ sở (Baseline) của mô hình V0 trên tập kiểm thử độc lập Frozen Test Set.

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ4.1*: Việc ép tỷ lệ quota có chủ đích cho các lát cắt khó (ban đêm, vật thể nhỏ, che khuất cao) có giúp mô hình xuất phát tốt hơn so với lấy mẫu ngẫu nhiên từ pool?
- *RQ4.2*: Tỷ lệ phân bổ quota tối ưu giữa các lát cắt khó là bao nhiêu để không làm suy giảm hiệu năng trên các lát cắt thông thường (ban ngày, cảnh thoáng)?
- *RQ4.3*: Siêu tham số huấn luyện nào (optimizer, learning rate schedule, loss function) mang lại độ ổn định cao nhất cho mô hình V0 trên tập dữ liệu mầm có kích thước hạn chế?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Dữ liệu đầu vào**: Tập dữ liệu Unlabeled Pool và nhãn gán sẵn của các ứng viên hạt giống từ Phase 03.
- **Tập kiểm tra đối chuẩn**: Frozen Val Set và Frozen Test Set đã được niêm phong từ Phase 03.
- **Kiến trúc mô hình**: YOLOv11n khởi tạo từ trọng số pre-trained tiêu chuẩn.

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Phương án Seed 1 (Baseline)**: Lấy mẫu ngẫu nhiên đồng đều (Random Uniform Seed).
2. **Phương án Seed 2**: Chỉ tập trung vào lát cắt ban đêm (Night-Heavy Seed).
3. **Phương án Seed 3**: Phân bổ đồng đều giữa 4 lát cắt (Equal Split: 25% mỗi lát cắt).
4. **Phương án Seed 4 (Đề xuất)**: **Balanced Hard-Slice Quota**:
   - 35% Ban đêm (`is_night`)
   - 20% Vật thể nhỏ / che khuất cao (`is_high_occlusion`)
   - 20% Mật độ giao thông cao / thời tiết (`is_weather_degraded` / `is_dense`)
   - 25% Ban ngày tiêu chuẩn (`clear_day`)

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Giữ cố định kích thước tập mầm Seed V0 qua tất cả các cấu hình thử nghiệm.
- Huấn luyện cùng số lượng epochs, batch size, và cùng seed ngẫu nhiên để đảm bảo tính công bằng.
- Đánh giá toàn diện trên cả 10 lớp BDD10K và phân rã chi tiết mAP trên từng lát cắt môi trường.
- `TBD — Ghi nhận bảng siêu tham số huấn luyện chi tiết.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **mAP@50 và mAP@50:95** trên toàn bộ Frozen Test Set.
- **mAP phân rã theo từng lát cắt khó**: Night mAP, Small-Object mAP, Occluded mAP.
- **Thời gian huấn luyện hội tụ (Training Convergence Time)**.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng so sánh mAP@50 giữa các phương án cấu hình Seed V0*: `TBD`
- *Phân rã điểm số 10 lớp của mô hình V0*: `TBD`
- *Hiệu năng trên các lát cắt khó so với Random Baseline*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Cấu hình hạt giống được chọn**: `TBD — Ghi nhận phương án chiến thắng.`
- **Lý do lựa chọn**:
  - `TBD — Đánh giá sự cân bằng giữa độ bao phủ các trường hợp nguy hiểm và nền tảng lớp phổ biến.`

---

## 9. Limitations — Hạn Chế
- Kích thước tập mầm nhỏ khiến một số lớp cực hiếm (`train`, `motorcycle`) vẫn có ít mẫu xuất hiện trong V0.
- `TBD — Các giới hạn quan sát được từ checkpoint V0.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/04_seed_v0_training_ablation.ipynb
  ```
- **Artifacts đầu ra**:
  - `checkpoints/model_v0_best.pt` (Trọng số mô hình cơ sở V0).
  - `results/phase_04/tables/` (Bảng số liệu so sánh ablation).

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: Active Mining &rarr;](05_active_mining.md)
