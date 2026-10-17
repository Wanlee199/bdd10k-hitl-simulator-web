# Tài Liệu Kỹ Thuật BDD10K Active Learning Lab

Chào mừng bạn đến với hệ thống tài liệu kỹ thuật của dự án nghiên cứu **BDD10K Active Learning Lab (Autonomous Driving Human-in-the-Loop Vision Engine)**.

Hệ thống tài liệu này ghi nhận chi tiết kiến trúc toàn trình, phương pháp luận thực nghiệm qua các Jupyter Notebook, các chỉ số đo lường, kết quả thực tế và cơ sở lý luận cho từng quyết định thuật toán.

---

## 🗂️ Cấu Trúc Tài Liệu

Tài liệu được phân chia thành hai tầng chính:

### 1. Tài Liệu Toàn Cảnh (System-Level Documentation)
- [01. Tổng Quan Dự Án (Project Overview)](01_project_overview.md) — Bối cảnh bài toán xe tự hành, dữ liệu BDD10K, mục tiêu nghiên cứu và câu hỏi cốt lõi.
- [02. Kiến Trúc Pipeline (Pipeline Architecture)](02_pipeline_architecture.md) — Sơ đồ luồng dữ liệu toàn trình từ nạp dữ liệu thô, lọc trùng, phân tầng, khai phá, gán nhãn HITL đến huấn luyện và đánh giá.
- [03. Tổng Hợp Kết Quả Thực Nghiệm (Experiment Results)](03_experiment_results.md) — Tổng kết đối chuẩn hiệu năng học tập chủ động, đường cong mAP@50, phân tích 10 lớp và hiệu quả tối ưu ngân sách.
- [04. Hướng Dẫn Tái Lập (Reproduction Guide)](04_reproduction_guide.md) — Yêu cầu môi trường, dependencies, quy trình chạy thực nghiệm và danh mục notebook.
- [05. Hạn Chế & Hướng Phát Triển (Limitations and Future Work)](05_limitations_and_future_work.md) — Các ranh giới giả định, hạn chế kỹ thuật hiện tại và lộ trình mở rộng nghiên cứu.

### 2. Báo Cáo Thực Nghiệm Chi Tiết Theo Từng Giai Đoạn (Stage-by-Stage Experiments)
Mục lục chi tiết và quy chuẩn báo cáo thực nghiệm được lưu trữ tại [docs/experiments/README.md](experiments/README.md):
- [Giai đoạn 01: Lọc Trùng Băm Tri Giác (Fast Deduplication)](experiments/01_fast_dedup.md)
- [Giai đoạn 02: Hồ Sơ Dữ Liệu Quang Học & Không Gian (Data Profiling)](experiments/02_data_profiling.md)
- [Giai đoạn 03: Phân Chia Tập Đóng Băng & Chống Rò Rỉ (Frozen Splits)](experiments/03_frozen_splits.md)
- [Giai đoạn 04: Tập Mầm Baseline & Phân Rã Lát Cắt Khó (Seed Baseline)](experiments/04_seed_baseline.md)
- [Giai đoạn 05: Khai Phá Chủ Động & Điều Hướng Đồng Thuận HITL (Active Mining)](experiments/05_active_mining.md)
- [Giai đoạn 06: Huấn Luyện Lại & Cân Bằng Thâm Hụt Lớp (Retraining)](experiments/06_retraining.md)
- [Giai đoạn 07: Vòng Lặp Học Tập Toàn Trình Tự Động (End-to-End Loop)](experiments/07_end_to_end_loop.md)
- [Giai đoạn 08: Rào Chắn Sản Xuất & Kiểm Định HITL (Production HITL)](experiments/08_production_hitl.md)

---

## 🧭 Hướng Dẫn Điều Hướng Nhanh

| Đối Tượng Đọc | Tài Liệu Ưu Tiên |
| :--- | :--- |
| **Nhà Nghiên Cứu / Reviewer** | [01_project_overview.md](01_project_overview.md) &rarr; [03_experiment_results.md](03_experiment_results.md) &rarr; [experiments/](experiments/README.md) |
| **Kỹ Sư MLOps / Pipeline** | [02_pipeline_architecture.md](02_pipeline_architecture.md) &rarr; [04_reproduction_guide.md](04_reproduction_guide.md) |
| **Chuyên Gia Gán Nhãn / Annotation Lead** | [experiments/05_active_mining.md](experiments/05_active_mining.md) &rarr; [experiments/08_production_hitl.md](experiments/08_production_hitl.md) |

---
*Ghi chú: Bộ tài liệu đang trong quá trình hoàn thiện nội dung chi tiết theo từng notebook thực nghiệm tương ứng.*
