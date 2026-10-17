# Báo Cáo Thực Nghiệm 07: Vòng Lặp Học Tập Toàn Trình Tự Động (End-to-End Loop)

> **Giai đoạn**: Phase 07 — Autonomous End-to-End Active Learning Flywheel (V0 &rarr; V5)  
> **Notebook tham chiếu**: `notebooks/07_end_to_end_autonomous_active_loop.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Kết nối toàn bộ các giai đoạn đơn lẻ thành một chuỗi vòng lặp bánh đà khép kín (**Closed-Loop Active Flywheel**) vận hành tự động qua 5 vòng lặp liên tiếp (V0 &rarr; V5).
- Kiểm chứng giả thuyết rằng hệ thống Proposed Active Mining đạt được độ chính xác mục tiêu nhanh hơn và tốn ít mẫu hơn đáng kể so với Random Baseline.
- Đối chuẩn đường cong học tập thực tế với đường trần lý thuyết của toàn bộ tập dữ liệu (100% Target Ceiling).

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ7.1*: Sau bao nhiêu vòng lặp thì mô hình Active Learning bắt đầu vượt trội rõ rệt (&ge; 3.0% mAP) so với Random Baseline?
- *RQ7.2*: Mức độ tiết kiệm ngân sách gán nhãn thực tế đạt được là bao nhiêu % khi đạt cùng một mốc mAP mục tiêu?
- *RQ7.3*: Có xảy ra hiện tượng bão hòa hiệu năng (Diminishing Returns) ở các vòng lặp muộn (V4, V5) không, và hệ thống cần cơ chế nào để tự động kích hoạt điều kiện dừng?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Trạng thái xuất phát**: Checkpoint mô hình hạt giống V0 và tập Test/Val đóng băng.
- **Ngân sách vòng lặp**: Định mức số lượng ảnh cho mỗi vòng lặp được quy định nghiêm ngặt.
- **Tập Unlabeled Pool**: Kho ảnh còn lại sau khi trừ đi tập Test, Val và Seed V0.

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Quy trình Đối chứng (Baseline Pipeline)**:
   - Random Sampling qua 5 chu kỳ
   - Huấn luyện chuẩn không có bộ cân bằng $C_w$
2. **Quy trình Đề xuất (Proposed Active Flywheel)**:
   - C6 Super-Fusion Mining + HITL Consensus Router
   - Retraining thích ứng với Replay Buffer và $C_w$ Deficit Weight Equalizer

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Chạy song song cả hai quy trình với cùng điều kiện khởi tạo, cùng kích thước batch ở mỗi vòng lặp.
- Sau mỗi vòng lặp, tự động ghi nhận checkpoint, tính toán ma trận nhầm lẫn (Confusion Matrix) và lưu trữ hồ sơ chẩn đoán hạt giống.
- Đánh giá trên cùng một tập Frozen Test Set cố định để loại trừ yếu tố ngẫu nhiên từ dữ liệu kiểm thử.
- `TBD — Ghi nhận bảng tham số toàn trình 5 vòng lặp.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **Đường cong mAP@50 qua các vòng lặp**: So sánh trực tiếp giữa Proposed và Random.
- **Tỷ lệ mẫu gán nhãn cần thiết để đạt mAP trần**: Số lượng ảnh cần dùng.
- **Hiệu năng bứt phá trên các lớp yếu thế**: Điểm số của `train`, `rider`, `motorcycle` qua từng vòng.
- **Tỷ lệ lỗi bỏ sót (False Negative Rate)**: Đo lường lỗ hổng tri thức được vá qua từng chu kỳ.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng tiến trình điểm số mAP@50 qua 5 vòng lặp*: `TBD`
- *Biểu đồ so sánh đường cong học tập*: `TBD`
- *Số liệu phân rã chi tiết 10 lớp tại mốc kết thúc V5*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Kết luận thực nghiệm toàn trình**: `TBD — Đánh giá tổng kết về tính ưu việt của quy trình đề xuất.`
- **Lý do lựa chọn**:
  - `TBD — Phân tích sự cộng hưởng giữa khai phá đa tiêu chí và cân bằng thâm hụt lớp.`

---

## 9. Limitations — Hạn Chế
- Độ phức tạp trong việc quản lý trạng thái và đồng bộ dữ liệu giữa các vòng lặp tự động.
- `TBD — Ghi nhận các điểm nghẽn tài nguyên phần cứng.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/07_end_to_end_autonomous_active_loop.ipynb
  ```
- **Artifacts đầu ra**:
  - `checkpoints/model_v{0..5}.pt` (Toàn bộ chuỗi checkpoint qua 5 vòng).
  - `results/phase_07/tables/end_to_end_learning_curve.json`
  - `results/phase_07/figures/learning_curve_comparison.png`

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: Production HITL &rarr;](08_production_hitl.md)
