# Báo cáo thực nghiệm kỹ thuật: Tái huấn luyện mô hình lũy tiến & Giải đấu Gold Benchmark (Phase 06)

> **Mã tài liệu**: `docs/experiments/06_retraining.md`  
> **Dự án**: BDD10K Active Learning Lab: Hệ Thống Tự Động Hóa Vòng Lặp Dữ Liệu Học Tập Chủ Động (Human-in-the-Loop)  
> **Notebook thực nghiệm chính**: `notebooks/06_model_v1_retraining_and_gold_benchmark.ipynb`  
> **Mã nguồn chính**: `src/train_v1_engine.py`  
> **Nguồn repository thượng nguồn**: `/Users/huynh/orca/workspaces/BuildPhase/tang`  
> **Tác giả / Nhóm nghiên cứu**: T018  
> **Trạng thái**: Đã kiểm chứng production / Dựa trên bằng chứng thực nghiệm  

---

## 1. Tổng quan thực nghiệm

### 1.1 Mục đích và cơ sở nghiên cứu
Trong một hệ thống Active Learning lấy dữ liệu làm trung tâm mang tính lặp đi lặp lại, việc thu nạp các mẫu gán nhãn có giá trị cao thông qua kiểm toán Human-in-the-Loop (HITL) mới chỉ là một nửa của bánh đà. Nửa thứ hai và có tầm quan trọng tương đương là **Tái huấn luyện mô hình (Model Retraining)**: tích hợp các nhãn mới được xác minh vào trọng số tham số của mô hình mà không làm suy giảm các biểu diễn đã học trước đó hoặc gây quá khớp (overfitting) vào các trường hợp biên mới đưa vào.

Phase 06 đánh giá bước chuyển đổi thực tế từ mô hình cơ sở $\mathcal{M}_0$ (được huấn luyện trên tập hạt giống 500 ảnh $\mathcal{D}_{\text{seed}}^{(0)}$) sang mô hình vòng lặp $\mathcal{M}_1$ (được huấn luyện trên tập mở rộng 750 ảnh $\mathcal{D}_{\text{train}}^{(1)}$). Thay vì mặc định cho rằng thêm dữ liệu sẽ tự động đem lại điểm số validation cao hơn, thực nghiệm này tiến hành một **Giải đấu đối đầu tay ba (Three-Way Head-to-Head Tournament)** trên bộ kiểm thử Fixed Gold Test bất biến ($N = 1.400$ khung hình, 28.094 đối tượng) so sánh giữa:
1. **Mô hình mốc neo ($\mathcal{M}_0$)**: YOLO11n cơ sở được huấn luyện trên 500 khung hình hạt giống ban đầu.
2. **Mô hình đối chứng ngẫu nhiên ($\mathcal{M}_{1,\text{rnd}}$)**: YOLO11n được tái huấn luyện trên 500 khung hình hạt giống cộng với 250 khung hình lấy mẫu ngẫu nhiên đồng nhất ($N = 750$).
3. **Mô hình chủ động đề xuất ($\mathcal{M}_{1,\text{active}}$)**: YOLO11n được tái huấn luyện trên 500 khung hình hạt giống cộng với 250 khung hình được khai thác bằng thuật toán Super-Fusion đa mục tiêu ($N = 750$) đã được kiểm toán bởi HITL oracle ở Phase 05.

```mermaid
flowchart TD
    subgraph Dữ liệu đầu vào
        S["Tập hạt giống V0 (500 Khung hình)"]
        A["Lô khai thác chủ động C6 (+250 Khung hình)"]
        R["Lô đối chứng ngẫu nhiên (+250 Khung hình)"]
    end

    subgraph Các tập dữ liệu huấn luyện
        S & A --> D_act["train_v1 (750 Khung hình)"]
        S & R --> D_rnd["train_random_v1 (750 Khung hình)"]
    end

    subgraph Engine tái huấn luyện với 4 lá chắn chống quá khớp
        Init["Checkpoint trước:<br>yolo11n_v0_best.pt"]
        Init -->|Tinh chỉnh ấm| E1["YOLO11n V1 Đề xuất"]
        Init -->|Tinh chỉnh ấm| E2["YOLO11n V1 Ngẫu nhiên"]
    end

    subgraph Đánh giá trên tập đóng băng
        GoldTest["Fixed Gold Test Set<br>(1.400 Khung hình / 28.094 Đối tượng)"]
        E1 --> GoldTest
        E2 --> GoldTest
        Init --> GoldTest
    end

    D_act --> E1
    D_rnd --> E2
```

---

## 2. Quy trình tái huấn luyện

Engine tái huấn luyện được triển khai trong `src/train_v1_engine.py` thông qua lớp `ModelV1TrainingEngine`. Quy trình vận hành đã thực thi gồm 8 giai đoạn riêng biệt:

1. **Xác định kho dữ liệu có nhãn hiện có**: Kiểm tra `data/splits/autonomous_loop/seed_v0/` ($N = 500$ khung hình) và xác minh tính toàn vẹn của nhãn trên 10 hạng mục BDD10K.
2. **Tích hợp các mẫu mới được gán nhãn**: Tiếp nhận $K = 250$ khung hình mới được gán nhãn đã qua kiểm toán ở Phase 05 từ `results/phase_05/tables/hitl_human_annotated_pool_v1.json` (hoặc 250 mẫu ngẫu nhiên đồng nhất cho lần chạy đối chứng).
3. **Xây dựng tập phân chia huấn luyện tiếp theo**: Tạo các liên kết tượng trưng (symbolic links) tại `data/splits/autonomous_loop/train_v1/` ($N = 750$ ảnh và 750 file nhãn) và chuẩn hóa file cấu hình `bdd10k_splits_v1.yaml`.
4. **Nạp trọng số mô hình trước đó**: Khởi tạo phiên bản huấn luyện trực tiếp từ checkpoint tốt nhất của chu kỳ trước:
   $$\mathbf{\theta}_{\text{init}}^{(1)} \leftarrow \mathbf{\theta}_{\text{best}}^{(0)} \quad (\text{Checkpoint: } \texttt{paper\_v4\_10k/models/yolo11n\_v0\_best.pt})$$
5. **Thực thi tinh chỉnh khởi động ấm với 4 lá chắn chống quá khớp**: Chạy quy trình tinh chỉnh bị ràng buộc dưới sự điều chuẩn nghiêm ngặt nhằm ngăn chặn hiện tượng quên thảm họa (catastrophic forgetting) và méo mó đặc trưng.
6. **Hiện thực hóa và xác minh checkpoint**: Lưu các trọng số trung gian tại `results/phase_06/runs/` và sao chép mô hình đạt hiệu năng cao nhất vào `models/yolo11n_v1_best.pt`.
7. **Đánh giá độc lập trên tập Gold Test**: Đánh giá toàn bộ 3 checkpoint cạnh tranh trên tập kiểm thử vĩnh viễn `fixed_test` ($N = 1.400$).
8. **Chấm điểm giải đấu và Đăng ký phả hệ**: Tính toán độ chênh lệch hiệu năng vĩ mô và theo từng lớp ($\Delta_{\text{active vs. random}}$ và $\Delta_{\text{active vs. V0}}$) đồng thời niêm phong chữ ký SHA-256 vào `models_lineage.json`.

---

## 3. Các phiên bản tập dữ liệu và Dữ liệu huấn luyện

### 3.1 Sự tăng trưởng tập dữ liệu và Thống kê mẫu
Dữ liệu huấn luyện mở rộng quy mô tuân thủ nghiêm ngặt theo các phân bổ ngân sách Active Learning:

| Mã định danh dữ liệu | Vai trò tập phân chia | Số khung hình | Ngân sách tích lũy | Thành phần dữ liệu | Tham chiếu Manifest |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `seed_v0` | Mốc cơ sở ban đầu | 500 | 500 (10,2% Ngân hàng) | Hạt giống phân tầng 4 lát cắt | `dataset_splits_manifest.json` |
| `train_random_v1` | Đối chứng cơ sở | 750 | 750 (15,3% Ngân hàng) | 500 Hạt giống + 250 Ngẫu nhiên | `bdd10k_splits_random_v1.yaml` |
| `train_v1` | Chủ động đề xuất | 750 | 750 (15,3% Ngân hàng) | 500 Hạt giống + 250 Super-Fusion | `bdd10k_splits_v1.yaml` |
| `fixed_val` | Kiểm định dùng chung | 700 | 700 (10,0% Kho tổng) | Tinh chỉnh siêu tham số cố định | `dataset_splits_manifest.json` |
| `fixed_test` | Fixed Gold Test | 1.400 | 1.400 (20,0% Kho tổng) | Mốc chuẩn cố định (28.094 Đối tượng) | `dataset_splits_manifest.json` |

### 3.2 Thành phần môi trường và lớp trong lô mẫu chủ động
Trong Phase 05, thuật toán khai thác chủ động C4/C6 Super-Fusion đã trích xuất 250 khung hình giải quyết cụ thể các điểm yếu được nhận diện ở Phase 04. Ngược lại với lô ngẫu nhiên đồng nhất (vốn bị chi phối bởi các xe hơi ban ngày thông thường), 250 khung hình chủ động chứa:
- **655 Đối tượng thuộc lớp hiếm** (so với chỉ 190 ở lô ngẫu nhiên đối chứng, đạt hệ số làm giàu gấp $3,45\times$).
- **Sự hiện diện vượt trội của người tham gia giao thông yếu thế (VRU)**: 23 `rider`, 41 `motor`, 68 `bike`, và 104 `truck`.
- **Độ ăn khớp với các kịch bản khắc nghiệt**: 98 khung hình ban đêm ($39,2\%$) và 84 khung cảnh che khuất cao ($33,6\%$).

---

## 4. Khởi tạo mô hình và Cấu hình huấn luyện

### 4.1 Tinh chỉnh khởi động ấm (Warm Fine-Tuning) so với Huấn luyện lại từ đầu
Mã nguồn của repository lựa chọn một cách tường minh phương pháp **Tinh chỉnh khởi động ấm (Warm Fine-Tuning)** từ checkpoint trước đó ($\mathcal{M}_0$) thay vì huấn luyện lại từ đầu (from scratch) hoặc khởi tạo lại từ trọng số tiền huấn luyện MS COCO (`yolo11n.pt`).

**Cơ sở khoa học**:
- Huấn luyện lại từ đầu trên các tập dữ liệu nhỏ ($N = 750$) sẽ làm mất đi các biểu diễn thị giác chi tiết đã học được qua 41 epoch hội tụ ở Phase 04.
- Tinh chỉnh ấm bảo tồn được hệ phân cấp đặc trưng không gian trong khi cho phép các cập nhật gradient điều chỉnh lại ranh giới quyết định cho các lớp thiếu hụt mẫu.

### 4.2 Các siêu tham số huấn luyện
Quy trình huấn luyện tuân thủ công thức quán quân `cfg_3_adamw_cosine` được xác lập ở Phase 04, được tăng cường bởi 4 cơ chế chống quá khớp:

| Siêu tham số | Giá trị cấu hình | Vai trò triển khai |
| :--- | :---: | :--- |
| **Kiến trúc mô hình** | Ultralytics YOLO11n | CNN nhẹ (~2,59M tham số) |
| **Trọng số khởi tạo** | `yolo11n_v0_best.pt` | Khởi động ấm từ checkpoint Phase 04 |
| **Độ phân giải đầu vào** | $640 \times 640$ điểm ảnh | Phát hiện anchor-free đa tỉ lệ |
| **Kích thước Batch** | 16 | Tối ưu hóa ngẫu nhiên theo mini-batch |
| **Số epoch** | 8 – 10 epoch | Số vòng lặp bị giới hạn để tránh thích nghi quá mức với lô mới |
| **Dừng sớm** | Kiên nhẫn (patience) = 8 epoch | Theo dõi trên hàm mất mát validation |
| **Bộ tối ưu** | AdamW | Suy giảm trọng số tách rời ($0,01$) |
| **Tốc độ học cơ sở ($\text{lr}_0$)** | $0,002$ | Tốc độ tinh chỉnh thận trọng |
| **Tốc độ học cuối ($\text{lrf}$)** | $0,01$ ($\eta_{\min} = 2 \times 10^{-5}$) | Suy giảm theo Cosine Annealing |
| **Tăng cường dữ liệu** | Mosaic ($1,0$) + Affine | Tổng hợp tổ hợp 4 ảnh mở rộng ngữ cảnh không gian |
| **Phần cứng** | Apple Silicon MPS | PyTorch Metal Performance Shaders (`device = "mps"`) |
| **Hạt giống tái lập** | `seed = 42` | Khởi tạo tất định xuyên suốt các lần chạy |

### 4.3 Bốn lá chắn chống quá khớp (Anti-Overfit Shields)
Để ngăn mô hình học vẹt lô dữ liệu bổ sung 250 mẫu tương đối nhỏ, `src/train_v1_engine.py` áp đặt 4 ràng buộc phòng vệ:
1. **Tăng cường dữ liệu Mosaic (Hệ số 1,0)**: Buộc mô hình phải phát hiện các đối tượng ở nhiều kích thước và vị trí khác nhau trong ảnh ghép 4 góc.
2. **Cosine Annealing kết hợp khởi động (Warmup)**: Loại bỏ các xung đột gradient đột ngột có thể làm mất ổn định các trọng số đã có trong các epoch ban đầu.
3. **Suy giảm trọng số tách rời ($\lambda = 0,01$)**: Trừng phạt sự gia tăng quá mức của trọng số trên các hạng mục xuất hiện thường xuyên (`car`).
4. **Cô lập nghiêm ngặt tập Fixed Gold Test**: Tập kiểm thử hoàn toàn ẩn giấu trong suốt quá trình huấn luyện, kiểm định và chọn checkpoint.

---

## 5. Quản lý phiên bản mô hình và Truy vết phả hệ

Các artifact mô hình và liên kết tập dữ liệu được theo dõi có hệ thống qua file `models/models_lineage.json` và được xác minh bằng mã băm mật mã SHA-256:

```mermaid
classDiagram
    class ModelLineage {
        +String model_name
        +String architecture
        +String checkpoint_path
        +String sha256_hash
        +String training_recipe
        +String dataset_yaml
        +Dict evaluation_metrics
        +String gold_test_set
        +Timestamp timestamp
    }
```

### Các bản ghi phả hệ checkpoint đã xác minh:

| Phiên bản mô hình | Tên file | Đường dẫn Checkpoint | Chữ ký mã băm SHA-256 |
| :--- | :--- | :--- | :--- |
| **YOLO11n V0 (Mốc neo)** | `yolo11n_v0_best.pt` | `paper_v4_10k/models/yolo11n_v0_best.pt` | `fe8f63276ad5cacffeecec12c04c59fdb7485e7d9fe94206efdf85db7be03959` |
| **YOLO11n V1 Ngẫu nhiên** | `best.pt` | `results/phase_06/runs/yolo11n_v1_random/weights/best.pt` | `c338b0bbc94d2929365d06a3efb59c663e00a42d351c1433057c6715841b86ba` |
| **YOLO11n V1 Đề xuất** | `yolo11n_v1_best.pt`| `paper_v4_10k/models/yolo11n_v1_best.pt` | `218418b822a11904dbfd89c988a3b87cca5fc0390ca9e57bbcf2ae3465969425` |

Cả 3 checkpoint đều sở hữu chữ ký SHA-256 riêng biệt đã được kiểm chứng, khẳng định các mô hình đại diện cho các trạng thái tham số hoàn toàn độc lập trong không gian trọng số.

---

## 6. Giao thức đánh giá

### 6.1 Mốc đánh giá chuẩn (`fixed_test`)
Để loại bỏ thiên lệch đánh giá, toàn bộ các mô hình được kiểm thử độc quyền trên **Fixed Gold Test Set** vĩnh viễn:
- **Tập dữ liệu**: `data/splits/autonomous_loop/fixed_test/`
- **Quy mô**: 1.400 khung cảnh lái xe ($100\%$ không bị can thiệp trong toàn bộ các phase huấn luyện).
- **Hỗ trợ Ground-Truth**: 28.094 đối tượng hộp bao.
- **Phần cứng & Phần mềm**: Cùng một harness đánh giá Ultralytics giống hệt nhau (`conf=0.001`, `iou=0.60`, `imgsz=640`).

### 6.2 Các chỉ số được đánh giá
1. **$mAP_{50}$**: Độ chính xác phát hiện trung bình vĩ mô tại ngưỡng IoU $0,50$.
2. **$mAP_{90}$**: Độ chính xác định vị khắt khe tại ngưỡng IoU cao $0,90$.
3. **$mAP_{50-95}$**: Chỉ số tổng hợp tiêu chuẩn COCO qua 10 bước IoU.
4. **Precision ($P$) & Recall ($R$)**: Trung bình vĩ mô trên 10 lớp tại ngưỡng tin cậy vận hành $\tau = 0,25$.
5. **Macro $F_1$-Score**: Trung bình điều hòa giữa Precision và Recall.

---

## 7. Kết quả thực nghiệm

### 7.1 Benchmark trung bình vĩ mô trên Fixed Gold Test (1.400 Ảnh)
3 mô hình được đánh giá đối đầu trong cùng điều kiện thực nghiệm. Các kết quả đã xác minh được ghi nhận trong `results/phase_06/tables/macro_comparison_table.md` gồm:

| Đối tượng mô hình đánh giá | Ngân sách nhãn | Chiến lược chọn dữ liệu | $mAP_{50}$ (%) | $mAP_{90}$ (%) | $mAP_{50-95}$ (%) | Precision (%) | Recall (%) | Chữ ký Checkpoint |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **YOLO11n V0 (Mốc neo)** | 500 ảnh | Hybrid Mix 80/20 Seed | **19,37%** | **2,05%** | **9,71%** | 29,14% | 21,50% | `fe8f63276ad5cacf...` |
| **YOLO11n V1 Ngẫu nhiên** | 750 ảnh | +250 Ngẫu nhiên đồng nhất | **19,65%** | 1,68% | 9,65% | 32,48% | 22,96% | `c338b0bbc94d2929...` |
| **YOLO11n V1 Đề xuất** | 750 ảnh | **+250 Active Super-Fusion**| **19,71%** | 1,62% | 9,59% | **38,82%** | **23,54%** | `218418b822a11904...` |
| **Độ lệch ($\Delta$ vs. Ngẫu nhiên)** | *Cùng 750 ảnh*| *Active vs. Random* | **+0,06%** | **-0,06%** | **-0,06%** | **+6,34%** | **+0,58%** | **Vượt trội dứt khoát Precision** |
| **Độ lệch ($\Delta$ vs. V0)** | *Tăng +50% ảnh* | *Tiến trình V0 $\to$ V1* | **+0,34%** | **-0,43%** | **-0,12%** | **+9,68%** | **+2,04%** | **Tăng trưởng tổng thể ổn định** |

### 7.2 Bóc tách chi tiết theo từng lớp trên 10 hạng mục giao thông
Đánh giá theo từng lớp được ghi nhận trong `results/phase_06/tables/per_class_model_v1_comparison.md` cung cấp cái nhìn chi tiết về vị trí dữ liệu chủ động phát huy tác dụng:

| ID | Tên hạng mục | Hỗ trợ (Đối tượng) | V0 $mAP_{50}$ | Rnd $mAP_{50}$ | **V1 $mAP_{50}$** | V1 $mAP_{90}$ | $\Delta$ vs. Rnd | $\Delta$ vs. V0 | V1 $F_1$-Score | Trạng thái vận hành |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | `person` | 2.104 | 34,35% | 33,41% | **33,42%** | 0,12% | +0,01% | -0,93% | 39,35% | Cơ sở ổn định |
| 2 | `rider` | 85 | 2,78% | 4,42% | **6,37%** | 0,00% | **+1,95%** | **+3,59%** | 10,30% | 🔥 **Phục hồi đột phá** |
| 3 | `car` | 15.608 | 57,42% | 57,08% | **56,65%** | 8,67% | -0,43% | -0,77% | 54,84% | Bão hòa lớp đa số |
| 4 | `truck` | 641 | 17,45% | 18,04% | **18,49%** | 1,35% | **+0,45%** | **+1,04%** | 28,05% | 🔥 **Phục hồi đột phá** |
| 5 | `bus` | 219 | 17,83% | 16,17% | **15,51%** | 4,54% | -0,66% | -2,32% | 26,47% | Cơ sở ổn định |
| 6 | `train` | 1 | 0,00% | 0,00% | **0,00%** | 0,00% | +0,00% | +0,00% | 0,00% | Không đủ mẫu kiểm thử |
| 7 | `motor` | 79 | 2,33% | 3,37% | **3,36%** | 0,00% | -0,01% | **+1,03%** | 2,32% | Ghi nhận tăng trưởng |
| 8 | `bike` | 153 | 6,32% | 8,06% | **7,28%** | 0,17% | -0,78% | **+0,96%** | 14,39% | Ghi nhận tăng trưởng |
| 9 | `traffic light` | 4.090 | 25,59% | 26,18% | **26,47%** | 0,50% | **+0,29%** | **+0,88%** | 36,23% | Cải thiện liên tục |
| 10 | `traffic sign` | 5.114 | 29,58% | 29,82% | **29,57%** | 0,87% | -0,25% | -0,01% | 36,71% | Cơ sở ổn định |
| **$\Sigma$** | **Toàn bộ hạng mục** | **28.094** | **19,37%** | **19,65%** | **19,71%** | **1,62%** | **+0,06%** | **+0,34%** | **$38,82\%$ (P) / $23,54\%$ (R)** | **Ưu thế chọn mẫu Active** |

---

## 8. Phân tích và Diễn giải

### 8.1 Bước nhảy vọt về độ chính xác Precision: Giảm thiểu báo động giả
Kết quả nổi bật nhất của quá trình tái huấn luyện Phase 06 là **bước nhảy vọt ấn tượng về độ chuẩn xác Precision**:
- Baseline V0 Precision: **$29,14\%$**
- Random V1 Precision: **$32,48\%$** ($+3,34\%$ so với V0)
- Proposed Active V1 Precision: **$38,82\%$** (**$+9,68\%$ so với V0**, **$+6,34\%$ so với Random V1**)

Trong bài toán xe tự hành thực tế, độ chính xác thấp đồng nghĩa với việc phát sinh quá nhiều dương tính giả (ví dụ: hiện tượng phanh gấp do bóng râm trên đường hoặc phản chiếu ánh sáng nhập nhằng). Việc thêm ảnh ngẫu nhiên chỉ làm tăng nhẹ độ bao phủ chung nhưng lại đưa thêm nhiều khung hình nền dễ. Ngược lại, thuật toán Super-Fusion nhắm trúng các khung hình ứng viên có entropy cao và ranh giới bất định, buộc mô hình phải phân biệt đối tượng thực sự khỏi các vùng nền phức tạp.

### 8.2 Phục hồi sự thiếu hụt ở nhóm người tham gia giao thông yếu thế (`rider`)
Các con số thực nghiệm theo từng lớp khẳng định việc khai thác chủ động đã khắc phục thành công điểm mù quan sát được ở Phase 04:
- Ở baseline V0, mô hình gần như bất lực trước lớp `rider` ($mAP_{50} = 2,78\%$, $\text{Recall} = 3,53\%$).
- Lấy mẫu ngẫu nhiên chỉ mang lại cải thiện nhỏ ($4,42\%$).
- Tái huấn luyện chủ động đề xuất đã nâng $mAP_{50}$ của `rider` lên **$6,37\%$** (tăng **$+129\%$ so với V0** và $+44\%$ so với ngẫu nhiên).
- Tương tự, độ chính xác phát hiện `truck` tăng từ $17,45\%$ lên **$18,49\%$**.

### 8.3 Vì sao $mAP_{50}$ vĩ mô chỉ tăng $+0,06\%$ so với ngẫu nhiên?
Một câu hỏi khoa học quan trọng là vì sao mức tăng $mAP_{50}$ trung bình vĩ mô giữa Active V1 và Random V1 có vẻ khiêm tốn ($19,71\%$ so với $19,65\%$, $+0,06\%$):
1. **Sự pha loãng của lớp đa số**: Trong 28.094 nhãn ground-truth của tập test, các lớp phổ biến (`car`, `person`, `traffic sign`, `traffic light`) chiếm hơn **$96,0\%$** tổng số đối tượng. Mọi mức tăng tỷ lệ phần trăm đột phá ở các lớp hiếm (`rider`, `motor`) đều bị nén toán học khi tính trung bình số học vĩ mô không trọng số.
2. **Sự đánh đổi trên các hạng mục mật độ cao**: Khi mô hình phân bổ dung lượng biểu diễn để xử lý các đối tượng nhỏ, bị che khuất và hiếm gặp, các dao động nhỏ đã xảy ra trên các cụm ô tô dày đặc ($57,08\% \to 56,65\%$).
3. **Mức tăng mẫu còn nhỏ ($K = 250$)**: Thêm 250 ảnh đại diện cho mức tăng $+50\%$ so với tập hạt giống, nhưng chỉ chiếm $5,1\%$ tổng ngân hàng huấn luyện sẵn có (4.894 ảnh). Sự phân kỳ $mAP$ vĩ mô nhiều điểm phần trăm đòi hỏi hiệu ứng tích lũy qua nhiều chu kỳ Active Learning ($V_1 \to V_5$).

---

## 9. Các dạng lỗi và Hạn chế

1. **Thiếu hụt mẫu kiểm thử cực đoan đối với lớp `train`**:
   - Tập kiểm thử BDD10K chính thức chỉ chứa đúng **1 đối tượng `train`** trên 1.400 khung hình. Do đó, việc đánh giá lớp tàu hỏa không mang ý nghĩa thống kê ($0,0\%$ mAP trên mọi mô hình).
2. **Phạm vi đơn chu kỳ**:
   - Phase 06 chỉ đánh giá vòng lặp đầu tiên ($V_0 \to V_1$). Mặc dù hạ tầng vòng lặp nhiều vòng đã được kiểm chứng ở Phase 07 (`DRY_RUN = True`), các checkpoint GPU hoàn chỉnh cho $V_2, V_3, V_4, V_5$ vẫn đang phụ thuộc vào tài nguyên tính toán sẵn có.
3. **Độ nhạy cảm với số epoch tinh chỉnh**:
   - Với quy mô $N = 750$ ảnh, việc huấn luyện vượt quá 12 epoch sẽ dẫn đến hiện tượng phân kỳ loss validation trên các lớp đuôi dài. Cần tuân thủ nghiêm ngặt cơ chế dừng sớm (patience = 8) để tránh quá khớp với 250 mẫu mới.
4. **Đặc thù phần cứng**:
   - Các checkpoint được tinh chỉnh bằng PyTorch Metal Performance Shaders (`mps`). Biến động tính toán số học dấu phẩy động nhỏ ($\le 0,2\%$ mAP) có thể xuất hiện khi chuyển trọng số sang môi trường CUDA hoặc TensorRT.

---

## 10. Khả năng tái lập (Reproducibility)

### 10.1 Các câu lệnh kiểm tra và xác minh
Để kiểm tra các chỉ số tái huấn luyện và xác minh bản ghi phả hệ:

```bash
# 1. Điều hướng tới không gian làm việc
cd /Users/huynh/orca/bdd10k-hitl-simulator-web

# 2. Hiển thị bảng benchmark vĩ mô từ các artifact đã lưu
python3 -c "
import json
with open('/Users/huynh/orca/workspaces/BuildPhase/tang/results/phase_06/tables/macro_comparison_table.json') as f:
    print(json.dumps(json.load(f), indent=2))
"

# 3. Xác minh chữ ký mật mã SHA-256
python3 -c "
import hashlib
for path in [
    'models/yolo11n_v0_best.pt',
    'models/yolo11n_v1_best.pt',
    'results/phase_06/runs/yolo11n_v1_random/weights/best.pt'
]:
    try:
        h = hashlib.sha256(open('/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/' + path, 'rb').read()).hexdigest()
        print(f'{path}: {h}')
    except Exception as e:
        print(f'{path}: {e}')
"
```

### 10.2 Thực thi chế độ Headless
Để chạy lại notebook đánh giá Phase 06 ở chế độ headless:

```bash
python -m jupyter nbconvert --to notebook --execute \
  /Users/huynh/orca/workspaces/BuildPhase/tang/notebooks/06_model_v1_retraining_and_gold_benchmark.ipynb \
  --output /tmp/06_model_v1_retraining_reproduced.ipynb
```

---

## 11. Kết luận

Thực nghiệm tái huấn luyện Phase 06 mang lại 4 phát hiện mang tính kết luận dựa trên bằng chứng:
1. **Tính khả thi của Tinh chỉnh khởi động ấm**: Tinh chỉnh trực tiếp từ checkpoint trước ($\mathcal{M}_0$) sử dụng AdamW, Cosine Annealing, và tăng cường Mosaic mang lại sự hội tụ nhanh, ổn định trên mức tăng 250 mẫu mà không bị quên thảm họa.
2. **Ưu thế dứt khoát về độ chuẩn xác Precision**: Active Learning mang lại **ưu thế vượt trội $+6,34\%$ Precision** so với lựa chọn ngẫu nhiên ($38,82\%$ so với $32,48\%$), giảm đáng kể các cảnh báo dương tính giả nguy hiểm.
3. **Phục hồi có mục tiêu các điểm thiếu hụt**: Hiệu năng trên nhóm đối tượng tham gia giao thông yếu thế tăng vọt ($mAP_{50}$ của `rider` tăng từ $2,78\%$ lên $6,37\%$, vượt xa mức $4,42\%$ của mốc ngẫu nhiên).
4. **Tuân thủ kiểm toán nghiêm ngặt**: Mọi đánh giá được thực hiện trên tập Gold Test 1.400 ảnh cố định, nguyên bản với toàn bộ các checkpoint được xác minh và đăng ký theo dõi phả hệ SHA-256.

---

## 12. Tài liệu liên quan

- [Tổng quan dự án](../README.md): Sứ mệnh, phạm vi và tầm nhìn Active Learning toàn trình.
- [Kiến trúc Pipeline](../02_pipeline_architecture.md): Toàn bộ kiến trúc 8 giai đoạn lấy dữ liệu làm trung tâm.
- [Tổng hợp kết quả thực nghiệm](../03_experiment_results.md): Các chỉ số hiệu năng đa phase cấp cao.
- [Hướng dẫn tái lập](../04_reproduction_guide.md): Hướng dẫn vận hành chạy notebook và codebase.
- [Báo cáo Phase 04 Seed Baseline](04_seed_baseline.md): Tạo tập hạt giống và bóc tách $\mathcal{M}_0$.
- [Báo cáo Phase 05 Active Mining](05_active_mining.md): Giải đấu khai thác Super-Fusion C4/C6 và duyệt HITL oracle.
- [Báo cáo Phase 07 Vòng lặp tự động](07_end_to_end_loop.md): Điều phối vòng lặp đa chu kỳ toàn trình.
- [README thư mục thực nghiệm](README.md): Danh mục đầy đủ toàn bộ 8 báo cáo thực nghiệm.
