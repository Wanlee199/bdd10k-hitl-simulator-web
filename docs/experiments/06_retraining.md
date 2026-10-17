# Báo Cáo Thực Nghiệm 06: Huấn Luyện Lại & Cân Bằng Thâm Hụt Lớp (Retraining)

> **Giai đoạn**: Phase 06 — Model Retraining & Class Deficit Weight Equalization  
> **Notebook tham chiếu**: `notebooks/06_model_v1_retraining_and_gold_benchmark.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Huấn luyện lại mô hình thị giác sau khi nhận được batch dữ liệu vàng mới từ quy trình HITL.
- Ngăn chặn hiện tượng quên tri thức cũ (**Catastrophic Forgetting**) đối với các lớp đã học tốt ở các vòng trước.
- Áp dụng bộ cân bằng trọng số thâm hụt lớp (**$C_w$ Deficit Weight Equalizer**) và hàm mất mát thích ứng (Focal Loss) để thúc đẩy các lớp hiếm.

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ6.1*: Cơ chế lưu trữ mẫu mỏ neo (**Replay Buffer**) với tỷ lệ bao nhiêu % là tối ưu để duy trì hiệu năng các lớp cũ mà không làm loãng dữ liệu mới?
- *RQ6.2*: Cấu hình hàm mất mát nào (Standard Cross-Entropy vs Focal Loss vs Class-Weighted Loss) xử lý tốt nhất bài toán mất cân bằng phân bố lớp cực đoan của BDD10K?
- *RQ6.3*: Chiến lược điều chỉnh tốc độ học (Learning Rate Schedule: Warmup + Cosine Annealing) có giúp mô hình ổn định nhanh trong các epoch đầu của vòng lặp mới không?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Trọng số khởi tạo**: Checkpoint mô hình của vòng lặp trước ($V_{k-1}$).
- **Dữ liệu huấn luyện tích lũy**: Tập dữ liệu Seed ban đầu kết hợp với các batch dữ liệu mới đã được chuyên gia thẩm định và Replay Buffer.
- **Tập kiểm tra đối chuẩn**: Frozen Val Set và Frozen Test Set cố định.

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Cấu hình 1 (Naive Retraining)**: Huấn luyện lại chỉ trên batch mới (dễ bị quên tri thức).
2. **Cấu hình 2 (Full Cumulative)**: Gộp toàn bộ dữ liệu từ đầu với trọng số mất mát đồng đều.
3. **Cấu hình 3 (Ablation Replay)**: Thử nghiệm các tỷ lệ Replay Buffer khác nhau (10%, 20%, 30%).
4. **Cấu hình 4 (Đề xuất)**: **Tri-Factor Adaptation System**:
   - Replay Buffer tỷ lệ mỏ neo 20%
   - Focal Loss kết hợp bộ cân bằng trọng số động $C_w$ (ghìm sàn an toàn cho `car` ở $0.20\times$ để dồn gradient cho các lớp yếu)
   - Optimizer AdamW kết hợp Cosine Learning Rate Decay

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Giữ cố định cấu hình phần cứng GPU và seed ngẫu nhiên cho tất cả các lượt thử nghiệm.
- Ghi nhận diễn biến loss (box loss, cls loss, dfl loss) và mAP@50 qua từng epoch huấn luyện.
- Đánh giá kiểm tra toàn diện sau khi hoàn thành epoch cuối cùng trên tập Test đóng băng.
- `TBD — Ghi nhận bảng tham số siêu tham số huấn luyện chi tiết.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **mAP@50 và mAP@50:95 tổng hợp** trên Frozen Test Set.
- **Tỷ lệ suy giảm hiệu năng trên lớp cũ (Forgetting Rate &Delta; mAP)**.
- **Mức tăng trưởng trên các lớp hiếm (Rare-Class Gain &Delta; mAP)**: `train`, `rider`, `motorcycle`.
- **Tốc độ hội tụ (Epochs to convergence)**.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng so sánh hiệu năng giữa các cấu hình hàm mất mát và replay buffer*: `TBD`
- *Diễn biến mAP@50 của từng lớp đối tượng trước và sau khi huấn luyện lại*: `TBD`
- *Tốc độ và đồ thị hội tụ loss*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Cấu hình huấn luyện tối ưu**: `TBD — Ghi nhận phương án quán quân.`
- **Lý do lựa chọn**:
  - `TBD — Phân tích cơ chế ghìm trọng số lớp bão hòa và tác động của Focal Loss.`

---

## 9. Limitations — Hạn Chế
- Chi phí huấn luyện tích lũy tăng dần khi số lượng vòng lặp tăng lên.
- `TBD — Các hiện tượng dao động gradient ghi nhận được.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/06_model_v1_retraining_and_gold_benchmark.ipynb
  ```
- **Artifacts đầu ra**:
  - `checkpoints/model_v{k}_retrained.pt`
  - `results/phase_06/tables/` (Bảng số liệu đối chuẩn huấn luyện lại).

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: End-to-End Loop &rarr;](07_end_to_end_loop.md)
