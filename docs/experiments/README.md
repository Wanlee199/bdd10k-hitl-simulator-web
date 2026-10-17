# Danh Mục Báo Cáo Thực Nghiệm Chi Tiết (Experiment Reports)

Thư mục này chứa toàn bộ các báo cáo thực nghiệm kỹ thuật chi tiết theo từng giai đoạn của quy trình **BDD10K Active Learning Lab**.

Mỗi giai đoạn phản ánh một bài toán kỹ thuật độc lập đã được thực nghiệm qua các Jupyter Notebook, so sánh đối đầu giữa nhiều thuật toán ứng viên trước khi lựa chọn phương án tối ưu để ghi nhận vào hệ thống.

---

## 📋 Danh Sách Các Giai Đoạn Thực Nghiệm

| Giai Đoạn | Tên File Báo Cáo | Bài Toán Nghiên Cứu | Notebook Tương Ứng | Trạng Thái |
| :---: | :--- | :--- | :--- | :---: |
| **01** | [01_fast_dedup.md](01_fast_dedup.md) | Lọc trùng băm tri giác pHash & bảo tồn đối tượng KMV | `01_dual_stream_fastdedup_benchmark.ipynb` | `VERIFIED` |
| **02** | [02_data_profiling.md](02_data_profiling.md) | Trích xuất hồ sơ quang học 5D không giám sát | `02_automated_data_profiling_benchmark.ipynb` | `VERIFIED` |
| **AL** | [02_active_learning.md](02_active_learning.md) | Báo cáo chuyên đề: Học tập chủ động & Tái huấn luyện | `05_active_mining` + `06_retraining` + `07_loop` | `VERIFIED` |
| **03** | [03_frozen_splits.md](03_frozen_splits.md) | Phân chia tập Test/Val đóng băng & chống rò rỉ kép | `03_shared_frozen_test_val_splits.ipynb` | `VERIFIED` |
| **04** | [04_seed_baseline.md](04_seed_baseline.md) | Huấn luyện mô hình hạt giống V0 & kiểm chuẩn lát cắt khó | `04_seed_v0_training_ablation.ipynb` | `VERIFIED` |
| **05** | [05_active_mining.md](05_active_mining.md) | Đấu trường khai phá chủ động C6 & điều hướng HITL | `05_active_mining_tournament_and_hitl.ipynb` | `VERIFIED` |
| **06** | [06_retraining.md](06_retraining.md) | Huấn luyện lại với Replay Buffer & cân bằng thâm hụt lớp | `06_model_v1_retraining_and_gold_benchmark.ipynb` | `VERIFIED` |
| **07** | [07_end_to_end_loop.md](07_end_to_end_loop.md) | Vòng lặp học tập toàn trình tự động V0 &rarr; V5 | `07_end_to_end_autonomous_active_loop.ipynb` | `AUDIT_PASSED` |
| **08** | [08_production_hitl.md](08_production_hitl.md) | Rào chắn sản xuất, kiểm định HITL & Lộ trình kiến trúc | `08_production_hitl_and_safety_gates.ipynb` (Roadmap) | `RESEARCH_SPEC` |

---

## 📐 Quy Chuẩn Cấu Trúc 10 Mục Bắt Buộc Của Mỗi Báo Cáo

Mỗi tài liệu trong thư mục này đều tuân thủ cấu trúc chuẩn mực khoa học gồm 10 phần:

1. **Objective — Mục tiêu**: Xác định mục tiêu kỹ thuật cụ thể của giai đoạn.
2. **Research Question — Câu hỏi nghiên cứu**: Các câu hỏi cốt lõi cần giải quyết bằng thực nghiệm.
3. **Inputs and Preconditions — Đầu vào và điều kiện tiên quyết**: Dữ liệu nạp vào, checkpoint tiền đề và các ràng buộc hệ thống.
4. **Candidate Methods — Các phương pháp đã thực nghiệm**: Danh sách và cơ chế hoạt động của các thuật toán tham gia đối đầu.
5. **Experimental Protocol — Thiết lập và quy trình thực nghiệm**: Cấu hình phần cứng, tham số thực nghiệm, môi trường và quy trình đo lường.
6. **Metrics — Các chỉ số đánh giá**: Các thước đo định lượng (Accuracy, Precision, Recall, F1, mAP, FPS, RAM, Disk).
7. **Results — Kết quả thực tế**: Bảng biểu và số liệu ghi nhận thực tế từ notebook.
8. **Decision and Rationale — Phương án được chọn và lý do**: Thuật toán quán quân được trao quyền và phân tích nguyên nhân khoa học.
9. **Limitations — Hạn chế**: Các góc khuất hoặc trường hợp biên thuật toán chưa giải quyết triệt để.
10. **Reproducibility and Artifacts — Khả năng tái lập và sản phẩm đầu ra**: Lệnh chạy tái lập và danh sách tệp artifacts sinh ra.

---

## 🔗 Liên Kết Ngược
- [Quay lại Tài liệu Tổng quan](../README.md)
- [Kiến Trúc Pipeline](../02_pipeline_architecture.md)
- [Tổng Hợp Kết Quả Toàn Hệ Thống](../03_experiment_results.md)
