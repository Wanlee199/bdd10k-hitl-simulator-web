# Bảng Xếp Hạng Đấu Trường Cắt Bỏ Công Thức Huấn Luyện (Phase 04 - Full Convergence)

Đánh giá đối đầu 5 công thức huấn luyện trên tập kiểm định đóng băng `fixed_val` (700 ảnh, 13.508 objects) với tập mầm 500 ảnh (`seed_v0`).

| Hạng | Cấu Hình | Mô Tả Kỹ Thuật | mAP@50 (%) | mAP@50-95 (%) | Recall (%) | Precision (%) | Điểm CBS | Thời Gian Huấn Luyện | Checkpoint |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **#1** (Winner) | `cfg_3_adamw_cosine` | AdamW + Cosine Annealing LR (Smooth Multi-scale Convergence) | **20.89%** | 10.51% | 22.20% | **53.09%** | **27.72** | 23m 56.6s | `paper_v4_10k/models/yolo11n_v0_best.pt` |
| **#2** | `cfg_0_naive` | Naive Baseline (SGD, Linear LR, No Freeze, No Class-weights) | 21.85% | **10.97%** | **22.92%** | 45.68% | 26.94 | 1h 15m 56.8s | `results/phase_04/runs/cfg_0_naive/weights/best.pt` |
| **#3** | `cfg_1_freeze` | Backbone Freezing 10L Warmup 5 epochs (Gradient Shock Prevention) | 20.52% | 10.65% | 21.66% | 50.29% | 26.82 | 30m 23.9s | `results/phase_04/runs/cfg_1_freeze/weights/best.pt` |
| **#4** | `cfg_2_class_weights` | Class-Weighted Loss (Rare Classes Heavy Penalty) | 19.87% | 10.12% | 22.07% | 39.85% | 24.53 | 1h 07m 14.4s | `results/phase_04/runs/cfg_2_class_weights/weights/best.pt` |
| **#5** | `cfg_4_proposed` | Full Proposed Recipe (Freeze 10L + AdamW Cosine + Class-weights) | 19.55% | 10.21% | 21.68% | 39.14% | 24.11 | 25m 13.2s | `results/phase_04/runs/cfg_4_proposed/weights/best.pt` |

*Ghi chú*: Điểm Composite Benchmark Score (CBS) = $0.5 \times \text{mAP50} + 0.3 \times \text{Recall} + 0.2 \times \text{Precision}$.
Quán quân chính thức được niêm phong vào `paper_v4_10k/models/yolo11n_v0_best.pt` (SHA-256: `fe8f632...`).
