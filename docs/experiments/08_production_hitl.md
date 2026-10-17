# Báo Cáo Thực Nghiệm 08: Rào Chắn Sản Xuất & Kiểm Định HITL (Production HITL)

> **Giai đoạn**: Phase 08 — Production HITL Safety Gates & Quantization Verification  
> **Notebook tham chiếu**: `notebooks/08_production_hitl_and_safety_gates.ipynb` *(TBD)*  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Thiết lập hệ thống 5 tầng rào chắn chất lượng (**5-Gate Quality Barrier**) để tự động kiểm duyệt mô hình trước khi bàn giao triển khai thực tế.
- Kiểm định độ bền mô hình dưới điều kiện nhiễu thực tế (Optical Perturbation & Domain Shift).
- Đánh giá tác động của lượng tử hóa mô hình (FP32 &rarr; INT8 Post-Training Quantization) đối với độ trễ suy luận và độ suy giảm mAP trên thiết bị biên xe tự hành.

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ8.1*: Các tiêu chuẩn rào chắn nào (độ chính xác, rò rỉ dữ liệu, độ tự tin trung bình, tỷ lệ bỏ sót) là bắt buộc để mô hình được xác nhận đạt chuẩn xuất xưởng (`VICTORY_CONFIRMED`)?
- *RQ8.2*: Lượng tử hóa INT8 có làm sụp đổ độ chính xác trên các lớp vật thể nhỏ và hiếm gặp không?
- *RQ8.3*: Mức giảm độ trễ suy luận thực tế (Latency Speedup) trên phần cứng mục tiêu là bao nhiêu ms?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Mô hình đầu vào**: Checkpoint tốt nhất thu được sau chuỗi vòng lặp Active Learning ($V_{\text{final}}$).
- **Bộ dữ liệu kiểm định chuyên dụng**: Frozen Test Set kết hợp với tập dữ liệu nhiễu quang học nhân tạo (mưa, sương mù, mờ nhòe giả lập).
- **Môi trường phần cứng kiểm thử độ trễ**: Nền tảng nhúng / GPU biên có hỗ trợ TensorRT INT8.

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Mô hình Gốc (FP32 Full Precision)**: Mô hình độ chính xác cao nhất làm mốc tham chiếu.
2. **Lượng tử hóa Nửa chính xác (FP16 Half Precision)**: Tối ưu hóa bộ nhớ không làm giảm độ chính xác.
3. **Lượng tử hóa Sau Huấn Luyện INT8 (PTQ - Post-Training Quantization)**:
   - INT8 chuẩn hóa phân vị
   - INT8 hiệu chuẩn entropy (KL-Divergence Calibration trên tập Val)

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Chạy toàn bộ 5 tầng rào chắn an toàn tự động:
  - *Gate 1 (Floor Barrier)*: mAP@50 vượt ngưỡng cơ sở tối thiểu.
  - *Gate 2 (Ceiling Barrier)*: Đánh bại trần lý thuyết 100% Target.
  - *Gate 3 (Leakage Barrier)*: Xác nhận 0 cặp vi phạm khoảng cách pHash.
  - *Gate 4 (Robustness Barrier)*: Độ suy giảm dưới nhiễu $\le \Delta_{\text{tol}}$.
  - *Gate 5 (Latency Barrier)*: Độ trễ suy luận đáp ứng thời gian thực $\le 10$ ms.
- Hiệu chuẩn bộ lượng tử hóa TensorRT INT8 trên 500 ảnh đại diện.
- `TBD — Ghi nhận bảng cấu hình quy trình kiểm định chi tiết.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **Trạng thái vượt rào**: Trạng thái PASS/FAIL trên từng rào chắn trong 5 tầng.
- **Độ trễ suy luận (Inference Latency)**: Thời gian đo bằng mili-giây (ms) trên mỗi khung hình.
- **Dung lượng mô hình (Model Checkpoint Size)**: Dung lượng MB lưu trữ.
- **Độ suy giảm chính xác do lượng tử hóa (&Delta; mAP@50 INT8 vs FP32)**.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng kết quả kiểm tra 5 tầng rào chắn an toàn*: `TBD`
- *So sánh độ trễ, dung lượng và mAP giữa FP32, FP16 và INT8*: `TBD`
- *Báo cáo kiểm định độ bền dưới 5 biến đổi quang học*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Cấu hình xuất bản mô hình**: `TBD — Ghi nhận phiên bản tối ưu để đóng gói triển khai.`
- **Lý do lựa chọn**:
  - `TBD — Đánh giá sự đánh đổi giữa độ trễ suy luận biên và mức suy giảm mAP có thể chấp nhận được.`

---

## 9. Limitations — Hạn Chế
- Thử nghiệm lượng tử hóa INT8 phụ thuộc vào tập mẫu hiệu chuẩn (Calibration Set); nếu tập hiệu chuẩn không đủ đa dạng có thể gây méo phân bố activation.
- `TBD — Các hạn chế phần cứng cụ thể.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/08_production_hitl_and_safety_gates.ipynb # (TBD)
  ```
- **Artifacts đầu ra**:
  - `models/production/yolov11n_int8.engine` (File model TensorRT).
  - `results/phase_08/tables/production_gates_audit_report.json`
  - `results/phase_08/figures/latency_vs_precision_tradeoff.png`

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Tổng Quan Dự Án &rarr;](../01_project_overview.md)
