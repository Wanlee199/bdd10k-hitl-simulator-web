# 04. Hướng Dẫn Tái Lập Thực Nghiệm & Tùy Biến (Reproduction Guide)

> **Mã tài liệu**: `docs/04_reproduction_guide.md`  
> **Dự án**: BDD10K Active Learning Lab (Động cơ thị giác xe tự hành Human-in-the-Loop)  
> **Tác giả / Nhóm nghiên cứu**: T018  
> **Notebook mục tiêu**: `notebooks/07_end_to_end_autonomous_active_loop.ipynb`  
> **Repository chính thức**: `https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab.git`  
> **Trạng thái**: Đã kiểm chứng thực tế / Dựa trên bằng chứng  

---

## 1. Tổng Quan

### 1.1 Mục Đích Của Hướng Dẫn Này
Tài liệu này cung cấp hướng dẫn từng bước dành cho các nhà nghiên cứu, kỹ sư thị giác máy tính và hội đồng đánh giá để độc lập tái lập, kiểm tra và tùy biến các kết quả thực nghiệm của **BDD10K Active Learning Lab**. Cụ thể, tài liệu hướng dẫn cách thực thi và đánh giá quy trình học tập chủ động khép kín được triển khai trong notebook `07_end_to_end_autonomous_active_loop.ipynb`.

### 1.2 Vai Trò Của Notebook 07 Trong Dự Án
Notebook `07` là giai đoạn điều phối tổng thể của toàn bộ hệ thống nghiên cứu. Nó tổng hợp tất cả các giai đoạn độc lập trước đó thành một vòng lặp phản hồi tự động, liên tục:
- Nạp các khung hình đã lọc trùng từ Phase 01 và metadata hồ sơ quang học 5D từ Phase 02.
- Thực thi cơ chế cách ly chuỗi video nghiêm ngặt để phân chia tập dữ liệu thành bốn tập con không rò rỉ.
- Triển khai động cơ tuyển chọn chủ động **C4 Super-Fusion** với vector phạt thâm hụt lớp thích ứng ($W_i$).
- Mô phỏng quy trình thẩm định oracle Human-in-the-Loop với kiểm soát chất lượng nhãn chân lý.
- Kiểm soát điểm dừng lặp mô hình thông qua bộ rào chắn dừng động 5 tầng (5-Tier StoppingGuard).
- Xuất các biểu đồ công bố khoa học chuẩn 300 DPI và manifest thực thi với cam kết không bịa đặt số liệu.

### 1.3 Những Gì Bạn Có Thể Kiểm Thử
Tùy thuộc vào mục tiêu, bạn có thể:
- **Kiểm toán tính toàn vẹn của pipeline**: Chạy kiểm toán logic toàn trình trong vài giây ở chế độ `DRY_RUN = True` để xác minh việc cách ly video, tạo manifest, điều kiện dừng và dọn sạch cache.
- **Kiểm tra mốc cơ sở benchmark**: Tải và xác minh các chỉ số trung bình vĩ mô 10 lớp ($mAP_{50}$, $mAP_{50:95}$, Precision, Recall, F1, CF-Score) của mô hình Seed V0 trên tập kiểm thử Frozen Gold Test gồm 1.400 ảnh.
- **Tái tạo biểu đồ công bố**: Vẽ lại các biểu đồ độ phân giải cao (Quỹ đạo tổng thể, Radar 10 lớp, Phân rã lát cắt khó và Động học dừng) từ các bản tóm tắt thực nghiệm đã được xác thực.
- **Thực thi huấn luyện lại sản xuất**: Tắt chế độ dry-run (`DRY_RUN = False`) để kích hoạt các chu kỳ học tập chủ động YOLOv11n thực tế trên phần cứng Apple Silicon MPS hoặc NVIDIA CUDA.

### 1.4 Các Chế Độ Thực Thi: Lựa Chọn A vs. Lựa Chọn B
- **Lựa chọn A (Chạy Notebook Hiện Có)**: Phù hợp cho việc kiểm tra nhanh, xác minh logic và kiểm toán kết quả bài báo mà không cần thay đổi kiến trúc mã nguồn.
- **Lựa chọn B (Clone & Tùy Biến Repository)**: Dành cho các nhà nghiên cứu muốn sửa đổi siêu tham số ($K$, tỷ lệ mầm, ngưỡng dừng), thay đổi tiêu chí chọn mẫu hoặc huấn luyện lại mô hình trên các tập dữ liệu ngoài.

---

## 2. Lựa Chọn A — Chạy Notebook Hiện Có

Làm theo các bước sau để kiểm tra và chạy notebook đã được cấu hình sẵn trong workspace hiện tại.

### 2.1 Vị Trí Tệp
Notebook điều phối chính nằm tại:
```text
notebooks/07_end_to_end_autonomous_active_loop.ipynb
```
Các phụ thuộc nội bộ của dự án được phân giải động thông qua `src/paths.py` tương đối so với thư mục gốc của dự án.

### 2.2 Điều Kiện Tiên Quyết Về Môi Trường & Dữ Liệu
Trước khi thực thi notebook, hãy đảm bảo các artifacts và môi trường sau đã sẵn sàng:

1. **Môi Trường Python**:
   - Python `3.9` hoặc `3.10` với các thư viện cốt lõi: `torch>=2.0.0`, `torchvision>=0.15.0`, `ultralytics>=8.3.0`, `imagehash>=4.3.0`, `opencv-python>=4.8.0`, `scikit-learn>=1.3.0`, `scipy>=1.10.0`, `matplotlib>=3.7.0`, `pandas>=2.0.0`, `pyyaml>=6.0`.
2. **Artifacts Đầu Vào Từ Phase 01 & Phase 02**:
   - `data/processed/unique_pool/`: Thư mục chứa 6.994 liên kết tượng trưng (symlinks) của ảnh sạch (dung lượng ổ đĩa 0 KB).
   - `data/processed/reports/data_profiling_manifest.json`: Manifest hồ sơ quang học và không gian 5D cho toàn bộ 6.994 ảnh trong pool.
   - `data/bdd10k/bdd10k_metadata.json`: Nhãn chân lý gốc BDD10K (tham chiếu chỉ đọc).
3. **Các Bảng Baseline Từ Phase 04** (để hiển thị metric):
   - `results/phase_07/tables/per_class_v0_baseline.json`: Metric baseline từng lớp chân thực.
   - `results/phase_07/tables/per_class_iterations_summary.json`: Dữ liệu đối chuẩn so sánh đa vòng lặp.

### 2.3 Mở Notebook
Mở notebook bằng Jupyter Lab, Jupyter Notebook cổ điển hoặc extension VS Code Interactive Python:
```bash
# Kích hoạt môi trường ảo hiện có
source .venv/bin/activate

# Khởi chạy Jupyter Lab từ thư mục gốc dự án
jupyter lab notebooks/07_end_to_end_autonomous_active_loop.ipynb
```
*Lưu ý: Luôn đảm bảo thư mục làm việc là thư mục gốc của dự án để `Path.cwd()` nhận diện chính xác `src/` và `data/`.*

### 2.4 Trình Tự Thực Thi Tuần Tự (16 Cells)
Thực thi các cell nghiêm ngặt theo thứ tự tuần tự (từ 0 đến 15):

| Cell # | Loại | Mô Tả & Thao Tác | Đầu Ra Kỳ Vọng Trên Console / Trực Quan |
| :---: | :---: | :--- | :--- |
| **0** | Markdown | Tiêu đề chính Phase 07 và đặc tả toán học | Tiêu đề văn bản định dạng đẹp |
| **1** | Code | Khởi tạo môi trường, tự phát hiện thư mục gốc, cấu hình thiết bị (`mps`/`cuda`/`cpu`), đặt `seed=42` | In đường dẫn; `Apple Silicon MPS Hardware Acceleration: ENABLED` (hoặc CUDA/CPU) |
| **2** | Markdown | Tổng quan kiến trúc pipeline 12 bước & phân bổ ngân sách | Bảng phân rã lý thuyết |
| **3** | Code | Nạp 6.994 symlinks của unique pool và manifest profiling 5D | In số lượng thống kê cho `is_night`, `is_small_slice`, `is_occluded`, `is_blur` |
| **4** | Code | Khởi tạo `AutonomousLoopConfig`, chia 4 tập qua `AutonomousLoopOrchestrator`, kiểm tra Zero Video Overlap | `🛡️ KIỂM TOÁN AN TOÀN ZERO VIDEO OVERLAP: PASSED (100% CÁCH LY TUYỆT ĐỐI)` |
| **5** | Markdown | Bộ chọn mẫu C4 Super-Fusion và các quy tắc rào chắn dừng động | Công thức toán học |
| **6** | Code | Chạy kiểm toán logic toàn trình (`DRY_RUN = True`) | Nhật ký lặp; `🏁 KẾT QUẢ THỰC THI HOÀN TẤT: [PASSED]` |
| **7** | Markdown | Quy chuẩn đo lường đánh giá 10 lớp (chuẩn IEEE/APA) | Định dạng phân mục |
| **8** | Code | Nạp và hiển thị bảng metric 10 lớp chuẩn APA/IEEE của baseline Seed V0 | Bảng ASCII/Markdown hiển thị đầy đủ 6 metrics |
| **9** | Markdown | Mô tả bốn biểu đồ khoa học 300 DPI xuất bản | Tóm tắt Hình 07a đến 07d |
| **10** | Code | Vẽ & hiển thị **Hình 07a**: Quỹ đạo Active vs. Random | `figure_07a_active_learning_curve.png` hiển thị trực tiếp |
| **11** | Code | Vẽ & hiển thị **Hình 07b**: Biểu đồ radar 10 lớp & mức tăng ròng | `figure_07b_per_class_radar_and_gain.png` hiển thị trực tiếp |
| **12** | Code | Vẽ & hiển thị **Hình 07c**: Phân rã chọn mẫu lát cắt khó ($K=250$) | `figure_07c_hard_slices_quota_evolution.png` hiển thị trực tiếp |
| **13** | Code | Vẽ & hiển thị **Hình 07d**: Động học rào chắn dừng & vòng xác nhận | `figure_07d_stopping_guard_delta_dynamics.png` hiển thị trực tiếp |
| **14** | Code | Kiểm toán Zero Stale Cache (`*.cache == 0`) và niêm phong manifest | `🔒 KIỂM TOÁN ZERO STALE CACHE BDD10K: PASSED (100% READ-ONLY BẤT BIẾN)` |
| **15** | Markdown | Kết luận khoa học, quy luật lợi ích giảm dần và bài học triển khai | Đoạn văn tổng kết phân tích |

### 2.5 Các Tham Số Quan Trọng Cần Kiểm Tra Trước Khi Chạy
Xem lại Cell 4 và Cell 6 trước khi bắt đầu:
- **`DRY_RUN` trong Cell 6**: Mặc định đặt là `True`. Lệnh này thực thi toàn bộ logic điều phối, xác thực các assertion, kiểm tra tính toàn vẹn của split và kiểm thử rào chắn dừng mà không khởi chạy quá trình huấn luyện kéo dài nhiều giờ.
- **`AutonomousLoopConfig` trong Cell 4**:
  - `initial_unlabeled_ratio = 0.20`: 20% ngân sách chưa gán nhãn ban đầu được cấp cho Seed V0 (979 ảnh).
  - `batch_size_k = 250`: Ngân sách $K=250$ khung hình được chọn cho mỗi vòng lặp.
  - `max_iterations = 5`: Tối đa 5 vòng lặp chủ động (V1 đến V5).
  - `seed = 42`: Random seed cố định để tái lập việc phân chia tập dữ liệu.

### 2.6 Đầu Ra & Artifacts Kỳ Vọng
Khi Cell 14 hoàn thành, các artifacts sau sẽ được xác nhận lưu trữ trên ổ đĩa:
- `results/phase_07/manifests/phase07_execution_manifest.json`: Metadata thực thi chi tiết bao gồm phần cứng, timestamp và số lượng ảnh.
- `results/phase_07/figures/`:
  - `figure_07a_active_learning_curve.png`
  - `figure_07b_per_class_radar_and_gain.png`
  - `figure_07c_hard_slices_quota_evolution.png`
  - `figure_07d_stopping_guard_delta_dynamics.png`

### 2.7 Cách Xác Minh Một Lần Chạy Thành Công
Một lần chạy thành công phải thỏa mãn cả ba tiêu chí:
1. **Tính Toàn Vẹn Của Assertion**: Không có ngoại lệ `AssertionError` nào xuất hiện trong Cell 4 (Zero Video Overlap) hoặc Cell 14 (Zero Stale Cache).
2. **Trạng Thái Dừng**: Đầu ra phán quyết thực thi trong Cell 6 báo cáo:
   ```text
   • Trạng thái : [PASSED] (hoặc TOURNAMENT_ALL_FRONT_VICTORY)
   • Thông điệp : All-front victory achieved. Early stopping confirmed.
   ```
3. **Không Rò Rỉ Cache**: Cell 14 xác nhận `File cache rò rỉ trong data/bdd10k/: 0`.

### 2.8 Ràng Buộc Phụ Thuộc
- Nếu thiếu `data/processed/unique_pool` hoặc `data/processed/reports/data_profiling_manifest.json`, Cell 3 sẽ báo lỗi `FileNotFoundError`. Các tệp đó phải được tạo thông qua Notebook 01 và 02 trước.
- Notebook phụ thuộc vào các module `src/` trong repository (`src.paths`, `src.autonomous_loop`, `src.utils`). Việc di chuyển notebook ra khỏi thư mục `notebooks/` mà không cập nhật `sys.path` sẽ gây ra lỗi `ModuleNotFoundError`.

---

## 3. Lựa Chọn B — Clone và Tùy Biến Repository

Làm theo hướng dẫn dưới đây để clone repository về máy trạm hoặc máy chủ cá nhân phục vụ nghiên cứu sâu hơn và khám phá tham số.

### 3.1 Đường Dẫn Repository Chính Thức
- **HTTPS**: `https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab.git`
- **SSH**: `git@github.com:nguyenhuynhdt37/autonomous-driving-active-learning-lab.git`

### 3.2 Cách Clone Repository
```bash
git clone https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab.git
cd autonomous-driving-active-learning-lab
```

### 3.3 Thiết Lập Môi Trường Phát Triển
Tạo một môi trường Python cô lập và cài đặt các dependencies chuẩn xác đã được xác minh:
```bash
# Tạo môi trường ảo
python3 -m venv .venv

# Kích hoạt môi trường
source .venv/bin/activate  # Trên Linux/macOS
# hoặc: .venv\Scripts\activate  # Trên Windows

# Nâng cấp công cụ cài đặt
pip install --upgrade pip setuptools wheel

# Cài đặt các gói phụ thuộc
pip install -r requirements.txt
```

Kiểm tra khả năng truy cập GPU / thiết bị tăng tốc:
```bash
python3 -c "import torch; print('CUDA:', torch.cuda.is_available(), '| MPS:', torch.backends.mps.is_available())"
```

### 3.4 Tạo Nhánh Thí Nghiệm & Bản Sao Notebook
Để bảo toàn kết quả gốc và theo dõi các thay đổi một cách rõ ràng, hãy tạo một nhánh thử nghiệm riêng và bản sao notebook:
```bash
# Tạo nhánh tính năng
git checkout -b experiment/custom-active-loop

# Sao chép notebook chính
cp notebooks/07_end_to_end_autonomous_active_loop.ipynb notebooks/07_custom_active_loop.ipynb
```

### 3.5 Các Thành Phần Có Thể Tùy Biến
Kiến trúc trong `src/autonomous_loop.py` hỗ trợ sửa đổi trực tiếp các cấu hình sau:

1. **Ngân Sách Chọn Mẫu Chủ Động ($K$)**:
   Sửa đổi `batch_size_k` trong `AutonomousLoopConfig`:
   ```python
   config = AutonomousLoopConfig(
       batch_size_k=100,  # Chọn mẫu với bước nhỏ hơn (mặc định: 250)
       max_iterations=8,
   )
   ```
2. **Tỷ Lệ Phân Bổ Mầm Seed V0**:
   Điều chỉnh `initial_unlabeled_ratio` (mặc định `0.20` = 979 ảnh; đặt `0.10` tạo tập mầm ban đầu gồm 489 ảnh).
3. **Độ Nhạy Của Rào Chắn Dừng Sớm**:
   Điều chỉnh `delta_plateau_threshold` (mặc định `0.3` điểm phần trăm của $mAP_{50}$) hoặc `uncertainty_depleted_threshold` (mặc định `0.15`).
4. **Lựa Chọn Phần Cứng**:
   Ghi đè `device="cpu"`, `device="cuda"`, hoặc `device="mps"` thay vì `"auto"`.
5. **Chế Độ Huấn Luyện Lại Mô Hình Thật**:
   Trong Cell 6, chuyển đổi cờ:
   ```python
   DRY_RUN = False
   ```
   *Cảnh báo: Việc đặt `DRY_RUN = False` sẽ kích hoạt quá trình huấn luyện YOLOv11n thực tế trong 20 epochs trên V0, tiếp theo là 8 epochs cho mỗi vòng lặp chủ động. Hãy đảm bảo có sẵn GPU chuyên dụng.*

### 3.6 Lưu Ý Về Dung Lượng Lưu Trữ, Checkpoint & Thời Gian Chạy
- **Dung Lượng Ổ Đĩa**: Các phân tập dựa trên symlink tiêu tốn **0 KB** dung lượng lưu trữ cho các bản sao ảnh. Tuy nhiên, việc lưu trọng số PyTorch trong quá trình huấn luyện thật (`DRY_RUN = False`) tạo ra các checkpoint `.pt` xấp xỉ 5.6 MB mỗi vòng (lưu trong `runs/detect/`).
- **Thời Gian Chạy Dự Kiến**:
  - `DRY_RUN = True`: ~15–30 giây tổng cộng trên CPU 8 nhân tiêu chuẩn hoặc Apple Silicon.
  - `DRY_RUN = False`: ~45–90 phút trên Apple M-series (MPS) hoặc NVIDIA RTX 3080/4090 (CUDA) cho toàn bộ 5 vòng lặp.

---

## 4. Bạn Có Thể Kiểm Thử Những Gì?

Dưới đây là ma trận các thử nghiệm đã được xác nhận có thể đánh giá trực tiếp trên codebase hiện có:

### Test 1: Kiểm Toán Logic Toàn Trình & Rò Rỉ Dữ Liệu
- **Mục đích**: Xác minh việc phân chia dữ liệu, cách ly chuỗi video, tạo manifest và dọn dẹp cache diễn ra sạch sẽ, không có lỗi.
- **Code cần sửa**: Cell 6 (`DRY_RUN = True`).
- **Điều kiện tiên quyết**: Đã có Phase 01 (`unique_pool`) và Phase 02 (`data_profiling_manifest.json`) trên đĩa.
- **Kết quả quan sát được**: Console xác nhận Zero Video Overlap, kiểm tra số lượng phân vùng và tạo tệp `phase07_execution_manifest.json`.
- **Phương pháp so sánh**: So sánh số lượng mẫu các phân tập với tổng kỳ vọng: Fixed Test (1.400), Fixed Val (700), Seed V0 (979), Unlabeled Pool (3.915).
- **Giới hạn phạm vi**: Không huấn luyện trọng số mô hình hoặc cập nhật metric kiểm thử thật.

### Test 2: Độ Nhạy Của Kích Thước Batch Tuyển Chọn ($K$)
- **Mục đích**: Đo lường tác động của kích thước cụm chọn mẫu lên tuổi thọ của pool và sự đa dạng hóa ứng viên.
- **Code cần sửa**: Đổi `batch_size_k=250` trong Cell 4 thành `100` hoặc `500`.
- **Điều kiện tiên quyết**: Môi trường đã thiết lập chuẩn.
- **Kết quả quan sát được**: Tổng số vòng lặp cho đến khi cạn pool sẽ tỷ lệ nghịch với $K$; số ảnh bổ sung mỗi vòng phản ánh ngân sách mới.
- **Phương pháp so sánh**: So sánh tổng số ảnh gán nhãn cần thiết để đạt điều kiện dừng.
- **Giới hạn phạm vi**: Nếu không huấn luyện thật (`DRY_RUN = False`), sự tiến hóa metric qua từng vòng không thể so sánh động.

### Test 3: Tỷ Lệ Ngân Sách Mầm Seed V0 ($10\%$ vs. $20\%$)
- **Mục đích**: Đánh giá tác động của kích thước mầm ban đầu đối với hiệu quả chọn mẫu phía sau.
- **Code cần sửa**: Đặt `initial_unlabeled_ratio=0.10` (489 ảnh) vs `0.20` (979 ảnh) trong `AutonomousLoopConfig`.
- **Điều kiện tiên quyết**: Thiết lập repo tiêu chuẩn.
- **Kết quả quan sát được**: Kích thước của Seed V0 và các phân tập pool còn lại cập nhật ngay lập tức trong Cell 4.
- **Phương pháp so sánh**: So sánh thống kê phân chia dữ liệu trên stdout.
- **Giới hạn phạm vi**: Sự sụt giảm $mAP_{50}$ thực tế của mầm $10\%$ vs $20\%$ đòi hỏi phải huấn luyện lại đầy đủ (`DRY_RUN = False`).

### Test 4: Độ Nhạy Của Rào Chắn Dừng Động
- **Mục đích**: Kiểm tra logic của rào chắn dừng khi thay đổi ngưỡng dung sai mức tăng biên.
- **Code cần sửa**: Sửa `delta_plateau_threshold=0.1` vs `delta_plateau_threshold=0.5` trong `AutonomousLoopConfig`.
- **Điều kiện tiên quyết**: Đã nạp notebook.
- **Kết quả quan sát được**: Thay đổi điểm kích hoạt phát hiện bão hòa khi mức tăng delta phẳng dần.
- **Phương pháp so sánh**: So sánh vòng lặp kết thúc được báo cáo trong `verdict.status`.
- **Giới hạn phạm vi**: Được đánh giá dựa trên các bản tóm tắt metric lịch sử trừ khi bật chế độ huấn luyện thật.

### Test 5: Huấn Luyện Mô Hình Thật Toàn Trình (`DRY_RUN = False`)
- **Mục đích**: Thực thi quá trình huấn luyện YOLOv11n thực tế qua tất cả các vòng lặp để tạo ra trọng số và metrics đo lường mới.
- **Code cần sửa**: Đặt `DRY_RUN = False` trong Cell 6.
- **Điều kiện tiên quyết**: NVIDIA GPU có CUDA hoặc Apple Silicon Mac có MPS; tối thiểu 16 GB unified/system RAM; ảnh dữ liệu thô BDD10K có thể truy cập được.
- **Kết quả quan sát được**: Thanh tiến trình huấn luyện PyTorch, đầu ra validation metrics trên 1.400 ảnh test, các checkpoint `.pt` mới sinh ra.
- **Phương pháp so sánh**: So sánh $mAP_{50}$ từng lớp sinh ra với tệp `results/phase_07/tables/per_class_iterations_summary.json`.
- **Giới hạn phạm vi**: Đòi hỏi năng lực tính toán cao; sai số dấu phẩy động ngẫu nhiên trên các kiến trúc GPU khác nhau có thể tạo ra dao động nhỏ ở phần thập phân ($\pm 0.1\text{--}0.3\%$).

### Test 6: Tùy Biến Trực Quan Hóa & Định Dạng Lại Biểu Đồ
- **Mục đích**: Điều chỉnh kiểu chữ, bảng màu hoặc độ phân giải của biểu đồ phục vụ công bố học thuật.
- **Code cần sửa**: Chỉnh sửa các tham số vẽ biểu đồ (`dpi=300`, màu sắc, kiểu đường nét) trong các Cell 10, 11, 12 và 13.
- **Điều kiện tiên quyết**: Đã cài đặt `matplotlib>=3.7.0`.
- **Kết quả quan sát được**: Các biểu đồ `.png` cập nhật được lưu trong `results/phase_07/figures/`.
- **Phương pháp so sánh**: Kiểm tra trực quan đối chiếu với các biểu đồ baseline dựng sẵn.
- **Giới hạn phạm vi**: Hoàn toàn thuộc về mặt hiển thị trực quan; không thay đổi các điểm dữ liệu cơ sở.

---

## 5. Tái Lập và So Sánh Kết Quả

Để đảm bảo việc so sánh khoa học chặt chẽ giữa các lần chạy:

### 5.1 Cấu Hình Tất Định (Deterministic Configuration)
- Luôn cố định random seed: `set_seed(42)` được gọi trong Cell 1 và được thiết lập trong `AutonomousLoopConfig(seed=42)`.
- Sử dụng cùng phiên bản các gói Python được ghi nhận trong `requirements.txt`.

### 5.2 Ghi Nhật Ký Metadata Lần Chạy
Khi Cell 14 chạy, nó tuần tự hóa các cấu hình lần chạy vào `phase07_execution_manifest.json`. Khi thực hiện các thử nghiệm tùy biến, hãy đổi tên hoặc lưu trữ manifest này cùng với cấu hình sửa đổi:
```bash
cp results/phase_07/manifests/phase07_execution_manifest.json \
   results/phase_07/manifests/manifest_experiment_k100.json
```

### 5.3 Tính Bất Biến Của Tập Dữ Liệu Kiểm Chuẩn
- **Kiểm Chuẩn Nhãn Chân Lý**: Tất cả các đánh giá bắt buộc phải thực hiện độc quyền trên **tập kiểm thử Frozen Gold Test gồm 1.400 ảnh** được tạo ra tại `data/splits/autonomous_loop/fixed_test/`.
- **Tuyệt Đối Không Đánh Giá Trên Pool**: Không bao giờ tính toán metrics đánh giá cuối cùng trên các ứng viên của unlabeled pool hoặc các tập con huấn luyện.
- **Zero Video Overlap**: Luôn kiểm tra để đảm bảo các video ID trong `test`, `val` và `bank` không bao giờ giao nhau.

### 5.4 Hiểu Rõ Về Phương Sai & Độ Lệch Số Liệu
Khi huấn luyện lại mô hình (`DRY_RUN = False`), các sai khác số học nhỏ so với các chỉ số công bố có thể phát sinh do:
- **Khác biệt về phần cứng tăng tốc**: Các phép tính nguyên tử (atomic operations) trong PyTorch trên Apple Silicon MPS so với NVIDIA CUDA kernels.
- **Phiên bản phụ của PyTorch / Torchvision**: Những thay đổi nhỏ trong việc triển khai phép tăng cường dữ liệu giữa các phiên bản.
- **Lập lịch luồng (Thread Scheduling)**: Quá trình vận hành đa luồng của DataLoader trong lúc huấn luyện.

Mọi độ lệch trong phạm vi $\pm 0.35\%$ $mAP_{50}$ đều nằm trong dung sai ngẫu nhiên chấp nhận được của GPU.

---

## 6. Xử Lý Sự Cố (Troubleshooting)

Các vấn đề thường gặp và biện pháp khắc phục đã được xác minh:

### 6.1 `RuntimeError: Không tìm thấy thư mục gốc dự án chứa src/ và data/!`
- **Nguyên nhân**: Thư mục làm việc của notebook không phải là thư mục gốc của repository hoặc các thư mục cha không chứa `src/` và `data/`.
- **Khắc phục**: Đảm bảo khởi chạy Jupyter từ thư mục gốc của dự án. Nếu chạy trong thư mục con, hãy thêm đường dẫn thư mục gốc thủ công:
  ```python
  import sys
  from pathlib import Path
  sys.path.insert(0, str(Path("/path/to/autonomous-driving-active-learning-lab").resolve()))
  ```

### 6.2 `FileNotFoundError: data/processed/unique_pool`
- **Nguyên nhân**: Quá trình lọc trùng Phase 01 chưa được thực thi, hoặc các symbolic links đã bị xóa.
- **Khắc phục**: Xác minh các artifacts Phase 01 tồn tại. Nếu thiếu, hãy chạy Notebook `01_dual_stream_fastdedup_benchmark.ipynb` hoặc khôi phục thư mục processed data.

### 6.3 `AssertionError: Lỗi rò rỉ video giữa test và val!`
- **Nguyên nhân**: Tên tệp khung hình bị thay đổi hoặc không tuân theo quy ước đặt tên chuẩn của BDD10K (`<video_id>-<frame_id>.jpg`).
- **Khắc phục**: Kiểm tra để các tệp ảnh trong `unique_pool` giữ nguyên quy ước đặt tên BDD10K gốc nhằm đảm bảo hàm `name.split("-")[0]` phân lập chính xác các chuỗi video.

### 6.4 `AssertionError: Phát hiện X cache rò rỉ vào data/bdd10k/!`
- **Nguyên nhân**: Thư viện Ultralytics YOLOv11n tự động tạo các tệp `*.cache` trong các thư mục dữ liệu khi duyệt qua dataset.
- **Khắc phục**: Chạy Cell 14 hoặc gọi hàm `clean_all_caches()` từ `src.autonomous_loop`. Lệnh này xóa toàn bộ các tệp `.cache` tạm thời để duy trì tính bất biến chỉ đọc của dataset.

### 6.5 Lỗi Tràn Bộ Nhớ (Out of Memory - OOM) Trên MPS Hoặc CUDA
- **Nguyên nhân**: Cạn kiệt VRAM của GPU khi chạy `DRY_RUN = False` với `batch_size=16` ở độ phân giải `imgsz=640`.
- **Khắc phục**: Giảm batch size trong Cell 4:
  ```python
  config = AutonomousLoopConfig(
      batch_size=8,  # Giảm từ 16 xuống 8
      imgsz=640,
  )
  ```

---

## 7. Các Giới Hạn Cần Lưu Ý

1. **Phụ Thuộc Vào Artifacts Thượng Nguồn**: Notebook 07 không phải là bộ nạp dữ liệu từ số 0; nó đòi hỏi bắt buộc phải có pool đã lọc trùng từ Phase 01 và hồ sơ quang học 5D từ Phase 02.
2. **Ràng Buộc Tính Toán Khi Huấn Luyện Thật**: Việc chạy toàn bộ vòng lặp chủ động với huấn luyện thật (`DRY_RUN = False`) qua nhiều vòng lặp là bất khả thi trên CPU thông thường. Cần có thiết bị tăng tốc phần cứng (Apple Silicon với MPS hoặc NVIDIA GPU với $\ge 8$ GB VRAM).
3. **Kiểm Toán Logic vs. Huấn Luyện Thực Nghiệm**: Chạy `DRY_RUN = True` xác minh tính đúng đắn của logic thuật toán, việc tạo các phân tập và các điều kiện dừng, nhưng không huấn luyện trọng số mới hay thiết lập các mốc thực nghiệm mới.
4. **Khả Năng Mở Rộng Thuật Toán**: Việc bổ sung các hàm chọn mẫu mới (ví dụ CoreSet, Badge hoặc Bayesian Active Learning) đòi hỏi phải mở rộng lớp `ActiveMiningSelector` trong `src/autonomous_loop.py`; điều này không thể thực hiện chỉ qua các tham số của notebook.

---

## 8. Tài Liệu Liên Quan

- [`docs/01_project_overview.md`](01_project_overview.md): Động lực nghiên cứu cấp cao, nghịch lý dữ liệu và mục tiêu dự án.
- [`docs/02_pipeline_architecture.md`](02_pipeline_architecture.md): Kiến trúc pipeline 12 bước chi tiết, công thức toán học và đặc tả luồng dữ liệu.
- [`docs/03_experiment_results.md`](03_experiment_results.md): Kết quả đối chuẩn định lượng toàn diện, phân rã 10 lớp và kiểm toán bằng chứng.
- [`docs/05_limitations_and_future_work.md`](05_limitations_and_future_work.md): Ranh giới lý thuyết, các giới hạn kỹ thuật hiện tại và lộ trình nghiên cứu tương lai.
- [`docs/README.md`](README.md): Mục lục và tổng quan cấu trúc của toàn bộ tài liệu kỹ thuật.
- [`README.md`](../README.md): Cổng thông tin mô phỏng chính và giao diện demo tương tác.
