# 04. Hướng Dẫn Tái Lập Thực Nghiệm (Reproduction Guide)

## 1. Yêu Cầu Môi Trường (System Requirements)

### 1.1. Phần Cứng Tối Thiểu (Hardware Requirements)
- **CPU**: Tối thiểu 8 cores (khuyến nghị cho các tác vụ pHash và tiền xử lý song song).
- **RAM**: Tối thiểu 16 GB (khuyến nghị 32 GB cho các ma trận khoảng cách lớn).
- **GPU**: NVIDIA GPU có hỗ trợ CUDA (khuyến nghị VRAM &ge; 12 GB cho huấn luyện YOLOv11n).
- **Ổ đĩa**: Tối thiểu 50 GB dung lượng trống để lưu trữ dữ liệu BDD10K gốc và artifacts.

### 1.2. Môi Trường Phần Mềm (Software Stack)
- **Hệ điều hành**: Linux (Ubuntu 20.04/22.04) hoặc macOS.
- **Python**: Phiên bản 3.9+ hoặc 3.10+.
- **Thư viện cốt lõi**: `torch`, `torchvision`, `ultralytics`, `opencv-python`, `scipy`, `scikit-learn`, `imagehash`, `pandas`, `numpy`, `matplotlib`.

---

## 2. Thiết Lập Môi Trường (Environment Setup)

```bash
# 1. Khởi tạo môi trường ảo Python
python3 -m venv venv
source venv/bin/activate

# 2. Cài đặt các gói phụ thuộc (TBD - requirements.txt)
pip install -r requirements.txt
```

---

## 3. Thứ Tự Thực Thi Notebooks (Notebook Execution Order)

Để tái lập chính xác toàn bộ quy trình từ dữ liệu thô đến mô hình hoàn tất, thực hiện tuần tự các notebook theo danh mục sau:

| Thứ Tự | Tên Notebook | Mục Tiêu Tái Lập | Artifacts Đầu Ra |
| :---: | :--- | :--- | :--- |
| **01** | `01_dual_stream_fastdedup_benchmark.ipynb` | Lọc trùng pHash + KMV trên tập dữ liệu thô | `unique_pool_manifest.json`, Symlinks |
| **02** | `02_automated_data_profiling_benchmark.ipynb` | Trích xuất hồ sơ quang học 5D không giám sát | `data_profiling_manifest.json` |
| **03** | `03_shared_frozen_test_val_splits.ipynb` | Phân chia bất biến tập Test/Val/Pool đóng băng | `splits_manifest.json`, Checksum |
| **04** | `04_seed_v0_training_ablation.ipynb` | Huấn luyện mô hình hạt giống V0 & so sánh lát cắt khó | Checkpoint `model_v0.pt` |
| **05** | `05_active_mining_tournament_and_hitl.ipynb` | Đấu trường khai phá chủ động C6 & mô phỏng HITL | `mined_batch_v1.json` |
| **06** | `06_model_v1_retraining_and_gold_benchmark.ipynb` | Huấn luyện lại mô hình với Replay Buffer & Cw Equalizer | Checkpoint `model_v1.pt` |
| **07** | `07_end_to_end_autonomous_active_loop.ipynb` | Chạy toàn trình chu kỳ vòng lặp V0 &rarr; V5 | Báo cáo tiến trình học tập |
| **08** | `08_production_hitl_and_safety_gates.ipynb` (TBD) | Kiểm định 5 tầng rào chắn dừng an toàn & lượng tử hóa | Model xuất bản Production |

---

## 4. Kiểm Tra Tính Toàn Vẹn & Checksum (Integrity Verification)
- Toàn bộ kết quả phân chia dữ liệu và artifacts quan trọng đều được niêm phong bằng chữ ký SHA-256.
- `TBD — Hướng dẫn chi tiết lệnh kiểm tra checksums sẽ được bổ sung tại đây.`

---

## 5. Liên Kết Tài Liệu Liên Quan
- [Kiến Trúc Pipeline](02_pipeline_architecture.md)
- [Tổng Hợp Kết Quả Thực Nghiệm](03_experiment_results.md)
- [Danh Mục Báo Cáo Thực Nghiệm Chi Tiết](experiments/README.md)
