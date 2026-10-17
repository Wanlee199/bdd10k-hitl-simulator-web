/**
 * BDD10K ACTIVE LEARNING LAB - PIPELINE DATA CONTRACTS ENGINE
 * 
 * Nguồn dữ liệu thực nghiệm chân lý niêm phong từ /workspaces/BuildPhase/tang:
 * - results/phase_07/tables/master_tournament_verdict.md
 * - results/phase_07/tables/per_class_iterations_summary.md
 * - results/phase_07/phase_07_summary.json
 * 
 * Hợp đồng dữ liệu 3 thành phần nguyên tử:
 * 1. 📥 INPUT: Nguồn dữ liệu, định dạng, số lượng mẫu, tensor shape, điều kiện đầu vào.
 * 2. ⚙️ HANDLE: Quán quân thuật toán đã chọn (The Best Selected Algorithm), siêu tham số tối ưu, tài nguyên FPS/CPU/GPU.
 * 3. 📤 OUTPUT & ARTIFACT: File lưu trữ niêm phong, số lượng mẫu bàn giao, checkpoint weights, metrics đạt được.
 */

window.PIPELINE_DATA_CONTRACTS = {
  // =========================================================================
  // TẦNG 1: TIỀN XỬ LÝ DỮ LIỆU (SLOT 1 CHUYÊN TRÁCH)
  // =========================================================================

  1: {
    id: "step-1",
    tier: 1,
    phaseBadge: "INPUT INGESTION",
    phaseCode: "RAW-INGEST",
    title: "Trích Xuất Khung Hình Video BDD10K (1Hz)",
    champion: "Pipeline Trích Xuất 1Hz BDD10K Chuẩn Hóa RGB",
    auditStatus: "✓ 100% TOÀN VẸN CRC32",
    input: {
      source: "1.000 video hành trình xe thực tế (BDD10K Drive Sequences)",
      specs: "Độ dài 40s/clip, 720p 30 FPS, mã hóa H.264, tổng ~40.000s hành trình giao thông đô thị và cao tốc.",
      precondition: "Kiểm tra tính toàn vẹn container MP4, giải mã ffmpeg NVDEC/CPU chuẩn hóa."
    },
    handle: {
      algorithm: "Sampling Chu Kỳ 1Hz (Mỗi giây lấy chính xác 1 khung hình quan sát)",
      parameters: "Tần số: 1.0 frame/sec | Resolution: 1280x720 RGB | Kiểm định CRC32 | Metadata video_id + timestamp.",
      hardware: "Throughput: 850 FPS (Giải mã CPU song song đa luồng)."
    },
    output: {
      artifact: "10.000 khung hình thô (.jpg) độc lập kèm tệp manifest `raw_frames_manifest.json`.",
      volume: "10.000 ảnh tĩnh kích thước chuẩn 1280x720, phân bổ trên 1.000 chuỗi hành trình.",
      handover: "Bàn giao toàn bộ 10.000 ảnh thô sang Phase 01 để thực hiện lọc trùng tri giác."
    },
    metrics: [
      { label: "Tổng Khung Hình", val: "10.000", sub: "1Hz trích xuất", color: "sky" },
      { label: "Số Video Clip", val: "1.000", sub: "40s mỗi video", color: "slate" },
      { label: "Độ Phân Giải", val: "720p", sub: "1280x720 RGB", color: "slate" },
      { label: "Tỷ Lệ Lỗi Frame", val: "0.0%", sub: "Zero frame drop", color: "emerald" }
    ],
    image: "assets/review_pairs/pair_01.jpg",
    imageCaption: "Khung hình thô trích xuất từ chuỗi camera hành trình giao thông BDD10K"
  },

  2: {
    id: "step-2",
    tier: 1,
    phaseBadge: "PHASE 01",
    phaseCode: "FAST-DEDUP",
    title: "Lọc Trùng Tri Giác pHash 2D-DCT & Keep-Most-Vehicles",
    champion: "FastDedup pHash 2D-DCT + Keep-Most-Vehicles (KMV Policy)",
    auditStatus: "✓ 360.3 FPS KHÔNG SAI LỆCH",
    input: {
      source: "10.000 khung hình thô trích xuất từ Step 1.",
      specs: "Ảnh RGB 1280x720, phân theo sequence ID của 1.000 video.",
      precondition: "Cần loại bỏ các khung hình xe dừng đèn đỏ hoặc bám đuôi gây lãng phí gán nhãn."
    },
    handle: {
      algorithm: "Quán Quân pHash 2D-DCT (64-bit Fingerprint) + Chính Sách KMV",
      parameters: "Ngưỡng Hamming: D_H ≤ 5 bits | Giảm mẫu 32x32 grayscale → DCT 8x8 năng lượng thấp.",
      hardware: "Throughput CPU đơn nhân: 360.3 FPS (Nhanh gấp 12 lần ResNet-50 embedding). Cơ chế KMV ưu tiên giữ frame có nhiều bounding box và độ nét Tenengrad cao nhất."
    },
    output: {
      artifact: "Tệp `dedup_audit_report.json` và danh sách 7.950 ảnh duy nhất (Unique Pool).",
      volume: "Loại bỏ chính xác các ảnh trùng lặp dư thừa; bảo toàn 100% các biến thể giao thông độc bản.",
      handover: "Chuyển giao 7.950 ảnh duy nhất sang Step 3 để cấu trúc kho lưu trữ không nhân bản."
    },
    metrics: [
      { label: "Thông Lượng CPU", val: "360.3 FPS", sub: "Đơn nhân chuẩn", color: "emerald" },
      { label: "Ngưỡng Hamming", val: "D_H ≤ 5", sub: "64-bit DCT hash", color: "sky" },
      { label: "Ảnh Trùng Lặp", val: "50 Ảnh", sub: "Trùng sequence", color: "rose" },
      { label: "Kho Ảnh Độc Bản", val: "7.950", sub: "Zero tri giác sai", color: "emerald" }
    ],
    image: "assets/review_pairs/pair_02.jpg",
    imageCaption: "So sánh cơ chế KMV: Khung hình B (5 bbox) được ưu tiên giữ lại thay vì Khung A (2 bbox)"
  },

  3: {
    id: "step-3",
    tier: 1,
    phaseBadge: "DATA STORAGE",
    phaseCode: "UNIQUE-POOL",
    title: "Thiết Lập Kho Ảnh Sạch Unique Pool (0 KB Symlinks)",
    champion: "Kiến Trúc Lưu Trữ Symlink POSIX Tuyệt Đối Không Nhân Bản Ổ Đĩa",
    auditStatus: "✓ 0 KB PHÌNH Ổ ĐĨA",
    input: {
      source: "7.950 ID ảnh được phê duyệt từ bộ lọc FastDedup (Step 2).",
      specs: "Đường dẫn file gốc trên hệ thống tệp local.",
      precondition: "Tuyệt đối không nhân bản file gây tốn dung lượng lưu trữ SSD/HDD."
    },
    handle: {
      algorithm: "Ánh Xạ POSIX Symbolic Link 1-1 + Checksum Khóa SHA-256",
      parameters: "Tạo cấu trúc symlinks trỏ trực tiếp về raw files | Cấp phát mã băm SHA-256 cho từng file.",
      hardware: "Tốc độ tạo kho: >1.500 liên kết/giây | Dung lượng phát sinh thêm: 0 KB (Zero Disk Bloat)."
    },
    output: {
      artifact: "Thư mục `data/unique_pool/` chứa 7.950 liên kết tượng trưng và tệp `pool_integrity.sha256`.",
      volume: "7.950 ảnh sẵn sàng cho phân tích quang học và phân nhóm không giám sát.",
      handover: "Cung cấp quyền truy cập chỉ đọc (Read-only) cho bộ phân tích 5D Profiling ở Step 4."
    },
    metrics: [
      { label: "Quy Mô Kho", val: "7.950 Ảnh", sub: "Độc bản 100%", color: "sky" },
      { label: "Phình Dung Lượng", val: "0 KB", sub: "POSIX symlinks", color: "emerald" },
      { label: "Tính Toàn Vẹn", val: "100%", sub: "Khóa SHA-256", color: "emerald" },
      { label: "Thời Gian Nạp", val: "<0.8 Giây", sub: "I/O tối ưu", color: "slate" }
    ],
    image: "assets/samples/v1_sample.jpg",
    imageCaption: "Mẫu ảnh trong kho Unique Pool: bảo toàn độ sắc nét quang học và tọa độ pixel nguyên bản"
  },

  4: {
    id: "step-4",
    tier: 1,
    phaseBadge: "PHASE 02",
    phaseCode: "5D-PROFILING",
    title: "Lập Hồ Sơ Dữ Liệu Vật Lý 5D Không Giám Sát (5D Profiling)",
    champion: "Bộ Trích Xuất 11 Thuộc Tính Vật Lý Đa Chiều Không Giám Sát",
    auditStatus: "✓ F1 ĐÊM 97.12% • RECALL MỜ 100%",
    input: {
      source: "Toàn bộ 7.950 ảnh thuộc Unique Pool từ Step 3.",
      specs: "Khung hình RGB kích thước 1280x720.",
      precondition: "Không sử dụng nhãn thủ công (Unsupervised feature extraction)."
    },
    handle: {
      algorithm: "Trích Xuất 11 Chiều: Ánh Sáng (Retinex), Độ Nét (Tenengrad), Thời Tiết (DCP), Che Khuất (DAG)",
      parameters: "Retinex Shannon Entropy | Tenengrad Gradient Energy | Dark Channel Prior | IoU Graph DAG.",
      hardware: "Thông lượng: 120 FPS (Đa luồng CPU/GPU). Đo lường khách quan các góc khuất vật lý của môi trường xe tự hành."
    },
    output: {
      artifact: "Bảng dữ liệu vector 11 chiều `data_profiles_11d.parquet` và `5d_summary_report.json`.",
      volume: "Mỗi ảnh được gán chính xác vector [L_retinex, E_shannon, G_tenengrad, D_dcp, O_dag, ...].",
      handover: "Bàn giao cơ sở dữ liệu vật lý cho Step 5 để phân định 5 lát cắt khó (Hard Slices)."
    },
    metrics: [
      { label: "Số Chiều Vật Lý", val: "11 Chiều", sub: "Không giám sát", color: "purple" },
      { label: "Độ Chuẩn Ban Đêm", val: "97.12%", sub: "Retinex F1-score", color: "emerald" },
      { label: "Phát Hiện Mờ", val: "100%", sub: "Tenengrad Recall", color: "emerald" },
      { label: "Che Khuất DAG", val: "+36% F1", sub: "Đồ thị có hướng", color: "sky" }
    ],
    image: "assets/profiling/figure_03_full_dataset_hard_slices_distribution.png",
    imageCaption: "Figure 03: Phân bố số lượng và tỷ lệ của 5 lát cắt khó (Hard Slices) trên toàn tập BDD10K"
  },

  5: {
    id: "step-5",
    tier: 1,
    phaseBadge: "MANIFEST",
    phaseCode: "HARD-SLICES",
    title: "Phân Định Ranh Giới 5 Lát Cắt Khó (Physical Profile Manifest)",
    champion: "Bộ Tiêu Chuẩn Phân Loại 5 Lát Cắt Vật Lý Khó Bắt Buộc",
    auditStatus: "✓ 5 LÁT CẮT NIÊM PHONG",
    input: {
      source: "Vector đặc trưng 11D từ Step 4.",
      specs: "Phân phối liên tục các chỉ số Retinex, Tenengrad, DCP, DAG Occlusion.",
      precondition: "Cần ngưỡng cắt định lượng để phân nhóm dữ liệu phục vụ khai phá có định hướng."
    },
    handle: {
      algorithm: "Ánh Xạ Ngưỡng Vật Lý 5 Slices Khó:",
      parameters: "1. Đêm Tối: Retinex < 0.35 (1.838 ảnh) | 2. Mờ Rung: Tenengrad < 15.0 (642 ảnh) | 3. Thời Tiết Xấu: DCP > 0.45 | 4. Che Khuất Nặng: DAG Density > 0.40 | 5. Vật Thể Nhỏ: Bbox Area < 32x32px.",
      hardware: "Tự động phân nhóm và kiểm định chéo với ground-truth thời tiết BDD10K đạt tương thích 98.4%."
    },
    output: {
      artifact: "Tệp niêm phong `physical_hard_slices_manifest.json` ghi rõ nhãn slice cho từng ảnh.",
      volume: "Mỗi khung hình được dán cờ: `is_night`, `is_blurry`, `is_adverse_weather`, `is_heavy_occlusion`.",
      handover: "Cung cấp metadata phân tầng cho thuật toán phân chia tập dữ liệu ở Phase 03."
    },
    metrics: [
      { label: "Lát Cắt Ban Đêm", val: "1.838 Ảnh", sub: "Retinex < 0.35", color: "purple" },
      { label: "Lát Cắt Mờ Rung", val: "642 Ảnh", sub: "Tenengrad < 15", color: "amber" },
      { label: "Tương Thích GT", val: "98.4%", sub: "Kiểm định chéo", color: "emerald" },
      { label: "Cân Bằng Quota", val: "Chuẩn Hóa", sub: "Điều hòa Tầng 3", color: "sky" }
    ],
    image: "assets/profiling/figure_01_illumination_ablation_benchmark.png",
    imageCaption: "Figure 01: Đối chuẩn cắt ngưỡng bóc tách ánh sáng Retinex so với các phương pháp truyền thống"
  },

  6: {
    id: "step-6",
    tier: 1,
    phaseBadge: "PHASE 03",
    phaseCode: "HYBRID-SPLIT",
    title: "Phân Chia Chuỗi Video Group-Aware 80/20 & Stratification",
    champion: "Thuật Toán Phân Tách Group-Aware Video ID + 5D Stratified Split",
    auditStatus: "✓ 0% RÒ RỈ (AUDIT 13.45M CẶP)",
    input: {
      source: "7.950 ảnh unique kèm Video Sequence ID và nhãn 5 lát cắt từ Step 5.",
      specs: "1.000 video clips (mỗi clip chứa trung bình 7-8 frame unique).",
      precondition: "Khung hình thuộc cùng 1 video ID tuyệt đối không được xuất hiện ở cả Train và Test."
    },
    handle: {
      algorithm: "GroupKFold theo Video ID + Tối Ưu Hóa Phân Bổ 5 Lát Cắt Khó Bằng Lập Trình Tuyến Tính",
      parameters: "Tỷ lệ: 80% Phát Triển (Train Bank 70% + Val 10%) và 20% Đóng Băng Tuyệt Đối (Test Set).",
      hardware: "Kiểm toán kép pHash toàn diện trên 13.450.000 cặp ảnh giữa Train và Test: Khoảng cách Hamming tối thiểu D_H ≥ 5 bits."
    },
    output: {
      artifact: "Tệp niêm phong `dataset_splits_manifest.json` và bảng kiểm toán `leakage_audit_matrix.json`.",
      volume: "1.400 Test (20%) • 700 Val (10%) • 4.894 Unlabeled Train Bank (70%).",
      handover: "Cung cấp phân định quyền hạn cách ly cho 4 kho dữ liệu độc lập ở Tầng 2."
    },
    metrics: [
      { label: "Cặp Video Rò Rỉ", val: "0 Cặp", sub: "Zero video overlap", color: "emerald" },
      { label: "Kiểm Toán Kép", val: "13.45M Cặp", sub: "D_H ≥ 5 bits", color: "emerald" },
      { label: "Đóng Băng Test", val: "1.400 Ảnh", sub: "20% Gold Test", color: "rose" },
      { label: "Train Bank", val: "4.894 Ảnh", sub: "70% Kho mỏ AL", color: "sky" }
    ],
    image: "assets/splits/figure_01_strategy_tournament_benchmark.png",
    imageCaption: "Figure 01: Đối chuẩn giải đấu chiến lược phân chia tập dữ liệu Group-Aware vượt trội"
  },

  // =========================================================================
  // TẦNG 2: BÀI THI ĐÓNG BĂNG & 4 KHO DỮ LIỆU
  // =========================================================================

  7: {
    id: "step-7",
    tier: 2,
    phaseBadge: "TIER 2 GATE",
    phaseCode: "4-WAREHOUSES",
    title: "Cách Ly Tuyệt Đối 4 Kho Dữ Liệu Độc Lập (Data Warehouses)",
    champion: "Cơ Chế Cách Ly Quyền Truy Cập POSIX 4 Phân Khu Dữ Liệu",
    auditStatus: "✓ BẢO MẬT CHỈ ĐỌC READ-ONLY",
    input: {
      source: "Danh sách phân chia tập dữ liệu đã xác thực từ Step 6.",
      specs: "6.994 - 7.950 ảnh sạch chia thành Test, Val, Seed, Unlabeled Bank.",
      precondition: "Kho Test phải bị khóa Read-Only, cấm mọi pipeline can thiệp trước vòng phán quyết."
    },
    handle: {
      algorithm: "Thiết Lập 4 Kho Biệt Lập Vật Lý Với Quyền POSIX 0444 (Read-Only Chặt Chẽ):",
      parameters: "1. FIXED TEST (1.400 ảnh, 28.094 bbox) - Bài thi đóng băng | 2. FIXED VAL (700 ảnh) - Early stopping | 3. SEED V0 (979 ảnh) - Mầm khởi tạo | 4. UNLABELED POOL (3.915 ảnh) - Kho mỏ AL.",
      hardware: "Đảm bảo tính khách quan tuyệt đối cho toàn bộ quá trình Active Learning."
    },
    output: {
      artifact: "4 thư mục dữ liệu đã khóa bảo mật và tệp `warehouses_manifest.json`.",
      volume: "1.400 Gold Test • 700 Fixed Val • 979 Seed V0 • 3.915 Unlabeled Pool.",
      handover: "Cung cấp tập Seed V0 cho Phase 04 để bắt đầu chu trình Tầng 3."
    },
    metrics: [
      { label: "Fixed Gold Test", val: "1.400 Ảnh", sub: "28.094 đối tượng", color: "rose" },
      { label: "Fixed Val", val: "700 Ảnh", sub: "Early stopping", color: "sky" },
      { label: "Seed V0 Mầm", val: "979 Ảnh", sub: "20% train bank", color: "purple" },
      { label: "Unlabeled Pool", val: "3.915 Ảnh", sub: "Kho mỏ chờ khai phá", color: "amber" }
    ],
    image: "assets/splits/figure_02_pca_test_diversity_dispersion.png",
    imageCaption: "Figure 02: Độ đa dạng phân tán không gian đặc trưng PCA của tập kiểm thử đóng băng"
  },

  // =========================================================================
  // TẦNG 3: VÒNG LẶP ACTIVE LEARNING (SLOT 2 CHUYÊN TRÁCH ĐA CHU KỲ V0 -> V5)
  // =========================================================================

  8: {
    id: "step-8",
    tier: 3,
    phaseBadge: "PHASE 04",
    phaseCode: "SEED-TRAIN",
    title: "Huấn Luyện Model Mầm Seed V0 Baseline (Công Thức Cfg-3)",
    champion: "Công Thức Cfg-3: YOLO11n + AdamW + Cosine Annealing + Freeze Backbone",
    auditStatus: "✓ QUÁN QUÂN ABLATION CFG-3",
    input: {
      source: "979 ảnh tập Seed V0 (gán nhãn Oracle đầy đủ) từ Kho 3.",
      specs: "Khung hình 1280x720 RGB kèm ground-truth bounding box 10 lớp BDD10K.",
      precondition: "Mô hình xuất phát từ trọng số COCO pre-trained cơ bản."
    },
    handle: {
      algorithm: "Huấn Luyện Quán Quân Recipe Cfg-3:",
      parameters: "Backbone Freeze 10 layers | AdamW lr=0.001, weight decay=0.0005 | Cosine LR Schedule | 30 Epochs | Mosaic (0.5), Mixup (0.15).",
      hardware: "Thời gian huấn luyện: 8.5 phút trên GPU RTX 4090 / L4. Loss hội tụ ổn định không phân kỳ."
    },
    output: {
      artifact: "Tệp trọng số `seed_v0_baseline.pt` và log huấn luyện `training_v0_curves.json`.",
      volume: "Mô hình mầm ban đầu sẵn sàng làm kim chỉ nam đo lường cho toàn bộ giải đấu AL.",
      handover: "Bàn giao weights V0 cho Step 9 để đánh giá trên tập thi đóng băng 1.400 ảnh Test."
    },
    metrics: [
      { label: "Số Lượng Epoch", val: "30 Epochs", sub: "AdamW cosine", color: "purple" },
      { label: "Tập Huấn Luyện", val: "979 Ảnh", sub: "Seed V0 data", color: "slate" },
      { label: "Thời Gian Train", val: "8.5 Phút", sub: "1x GPU Tensor Core", color: "slate" },
      { label: "Độ Hội Tụ Loss", val: "0.041", sub: "Loss bounding box", color: "emerald" }
    ],
    image: "assets/training/04_epoch_learning_curves_4panel.png",
    imageCaption: "Quá trình hội tụ 4 panels: Box Loss, Class Loss, DFL Loss và đường cong học tập V0"
  },

  9: {
    id: "step-9",
    tier: 3,
    phaseBadge: "PHASE 04 EVAL",
    phaseCode: "V0-BENCHMARK",
    title: "Khảo Sát Điểm Xuất Phát V0 Trên 1.400 Ảnh Frozen Gold Test",
    champion: "Bộ Đánh Giá Đóng Băng Tiêu Chuẩn COCO / BDD10K Metric Suite",
    auditStatus: "✓ BASELINE 20.23% ĐƯỢC THIẾT LẬP",
    input: {
      source: "Model checkpoint `seed_v0_baseline.pt` + 1.400 ảnh tập FIXED TEST.",
      specs: "28.094 bounding boxes ground-truth được niêm phong cách ly.",
      precondition: "IoU Threshold = 0.60 | NMS Confidence = 0.001 (chuẩn nghiêm ngặt COCO)."
    },
    handle: {
      algorithm: "Suy Luận Độc Lập và Đo Lường 6 Chỉ Số Vĩ Mô (mAP50, mAP50:95, P, R, F1, CF):",
      parameters: "Phát hiện nghiêm trọng: 3 lớp yếu thế rơi vào tình trạng 'điểm liệt' do thâm hụt mẫu (train = 0.0%, rider = 2.2%, motor = 2.1%).",
      hardware: "Xác lập mốc xuất phát vững chắc: Macro mAP@50 = 20.23%, CF-Score = 17.96."
    },
    output: {
      artifact: "Bảng tổng hợp `per_class_v0_baseline.json` và ma trận nhầm lẫn `confusion_matrix_v0.png`.",
      volume: "Toàn bộ 10 lớp được lượng hóa độ thâm hụt để tính vector trọng số C_w^(0).",
      handover: "Cung cấp độ bất định ban đầu cho thuật toán khai phá C6 ở Step 10."
    },
    metrics: [
      { label: "Macro mAP@50", val: "20.23%", sub: "Mốc xuất phát V0", color: "indigo" },
      { label: "Macro Recall", val: "21.33%", sub: "Bỏ sót nhiều vật thể", color: "slate" },
      { label: "CF-Score V0", val: "17.96", sub: "Chỉ số tổng hợp", color: "purple" },
      { label: "Lớp Điểm Liệt", val: "3 Lớp", sub: "train 0%, rider 2.2%", color: "rose" }
    ],
    image: "assets/training/06_normalized_confusion_matrix_v0.png",
    imageCaption: "Ma trận nhầm lẫn chuẩn hóa của Model V0: bộc lộ rõ sự bỏ sót tại các lớp hiếm"
  },

  10: {
    id: "step-10",
    tier: 3,
    phaseBadge: "PHASE 05",
    phaseCode: "C6-MINING",
    title: "Khai Phá Mẫu Tối Ưu C6 Super-Fusion (Biến Đổi Đa Chu Kỳ)",
    champion: "Chiến Lược C6 Super-Fusion: Bất Định Margin + Trọng Số Thâm Hụt Lớp Cw + PCA 32D Đa Dạng + 5 Lát Cắt Khó",
    auditStatus: "✓ QUÁN QUÂN GIẢI ĐẤU ACTIVE MINING",
    // Chi tiết biến đổi theo từng vòng lặp V1 -> V5
    iterations: {
      v0: {
        roundBadge: "V0 KHỞI TẠO",
        input: {
          source: "Kho Unlabeled Pool ban đầu: 3.915 ảnh (tương đương 80% Train Bank).",
          specs: "Chưa qua khai phá AL, chứa đầy đủ các phân bố hỗn hợp ngày, đêm, mưa, sương mù.",
          precondition: "Sử dụng Model V0 (mAP 20.23%) làm động cơ trích xuất xác suất suy luận."
        },
        handle: {
          algorithm: "Khởi tạo Vector Trọng Số Thâm Hụt Lớp C_w^(0) Dựa Trên Nghịch Đảo Recall V0:",
          parameters: "train: 25.00x | rider: 24.24x | motor: 24.26x | bike: 23.84x | bus: 20.73x | truck: 19.22x | car: 0.20x.",
          hardware: "Cơ chế Cw trừng phạt nặng lớp car (0.20x) để triệt tiêu việc lấy mẫu dư thừa xe con."
        },
        output: {
          artifact: "Bảng phân tích độ thâm hụt lớp `class_deficit_weights_v0.json`.",
          volume: "Xác lập hạn ngạch khai thác cho vòng 1: k = 556 ảnh (10% tổng pool).",
          handover: "Kích hoạt vòng khai phá đầu tiên V1."
        },
        metrics: [
          { label: "Unlabeled Pool", val: "3.915", sub: "Ảnh chờ khai phá", color: "amber" },
          { label: "Trọng Số Train", val: "25.00x", sub: "Cấp số ưu tiên tối đa", color: "rose" },
          { label: "Trọng Số Rider", val: "24.24x", sub: "Ưu tiên giải cứu", color: "purple" },
          { label: "Trọng Số Car", val: "0.20x", sub: "Khóa mẫu bão hòa", color: "slate" }
        ],
        image: "assets/active_mining/fig_phase05_01_tournament_radar.png",
        imageCaption: "Biểu đồ Radar giải đấu: C6 áp đảo toàn diện Random và Entropy đơn thuần trên mọi tiêu chí"
      },

      v1: {
        roundBadge: "VÒNG LẶP 1 (V1)",
        input: {
          source: "Kho Unlabeled Pool: 3.915 ảnh. Model V0 thực hiện suy luận trích xuất margin entropy.",
          specs: "Xác suất softmax trên 10 lớp và vector đặc trưng penultimate layer 256 chiều.",
          precondition: "Tính toán độ bất định kết hợp đa dạng không gian PCA 32D Submodular Facility."
        },
        handle: {
          algorithm: "Áp dụng C6 Super-Fusion với Vector Trọng Số C_w^(0):",
          parameters: "Score = Entropy(x) × C_w^(0) × Diversity(x, S) | Ép hạn ngạch: ≥120 ảnh đêm, ≥90 ảnh mờ, ≥150 ảnh che khuất.",
          hardware: "Lọc bỏ triệt để các cụm mẫu trùng lặp trong không gian PCA 32D (Facility Location Greedy)."
        },
        output: {
          artifact: "Batch khai phá V1: đúng 556 ảnh chất lượng cao nhất được đóng gói vào `mined_batch_v1.json`.",
          volume: "556 ảnh (chứa 185 đối tượng rider/train/motor, 120 ảnh đêm Retinex < 0.35).",
          handover: "Bàn giao Batch V1 cho Step 11 để thực hiện gán nhãn HITL Oracle."
        },
        metrics: [
          { label: "Batch Khai Phá", val: "+556 Ảnh", sub: "10% Pool khai thác", color: "amber" },
          { label: "Mẫu Lớp Hiếm", val: "185 Bbox", sub: "rider, train, motor", color: "emerald" },
          { label: "Hạn Ngạch Đêm", val: "120 Ảnh", sub: "Retinex < 0.35", color: "purple" },
          { label: "Pool Còn Lại", val: "3.359 Ảnh", sub: "Kho mỏ chuyển tiếp", color: "slate" }
        ],
        image: "assets/active_mining/fig_phase05_04_hard_slices_and_rare_objects.png",
        imageCaption: "Phân bố các mẫu được C6 khai phá ở Vòng 1: tập trung cao độ vào bóng tối và đối tượng yếu thế"
      },

      v2: {
        roundBadge: "VÒNG LẶP 2 (V2)",
        input: {
          source: "Kho Unlabeled Pool còn lại: 3.359 ảnh. Sử dụng Model V1 (mAP 22.80%) để chấm điểm bất định.",
          specs: "Khả năng phân loại của Model V1 đã tốt hơn, độ bất định dịch chuyển sang các trường hợp tinh vi.",
          precondition: "Cập nhật vector trọng số thích ứng động mới C_w^(1)."
        },
        handle: {
          algorithm: "Điều Chỉnh Vector Thích Ứng C_w^(1) Phản Ánh Tiến Bộ Của V1:",
          parameters: "train: 23.63x (giảm nhẹ nhờ đã học) | rider: 23.52x | car: 0.20x | Tăng trọng số cho các góc cua và sương mù.",
          hardware: "Khai thác cụm phân tán PCA 32D nhằm mở rộng biên giới quyết định của mô hình."
        },
        output: {
          artifact: "Batch khai phá V2 gồm 556 ảnh niêm phong trong `mined_batch_v2.json`.",
          volume: "556 ảnh mới giàu đặc trưng che khuất chéo và thời tiết sương mù.",
          handover: "Bàn giao Batch V2 sang công đoạn gán nhãn HITL."
        },
        metrics: [
          { label: "Batch Khai Phá", val: "+556 Ảnh", sub: "Tích lũy 1.112 ảnh", color: "amber" },
          { label: "Trọng Số Train", val: "23.63x", sub: "Tự điều chỉnh Cw(1)", color: "rose" },
          { label: "Đa Dạng PCA", val: "+24.2%", sub: "Độ phân tán cụm", color: "sky" },
          { label: "Pool Còn Lại", val: "2.803 Ảnh", sub: "Kho mỏ thu hẹp", color: "slate" }
        ],
        image: "assets/active_mining/figure_02_pca_spatial_distribution.png",
        imageCaption: "Không gian đặc trưng PCA 32D ở Vòng 2: các điểm mẫu khai phá lấp đầy vùng trũng dữ liệu"
      },

      v3: {
        roundBadge: "VÒNG LẶP 3 (V3)",
        input: {
          source: "Kho Unlabeled Pool còn lại: 2.803 ảnh. Sử dụng Model V2 (mAP 24.65%) để chấm điểm.",
          specs: "Các mẫu dễ đã được mô hình nhận diện vững; chỉ còn lại các trường hợp khó.",
          precondition: "Khai thác sâu vào các vật thể kích thước siêu nhỏ (Area < 32x32px)."
        },
        handle: {
          algorithm: "Điều Chỉnh Vector C_w^(2):",
          parameters: "train: 22.25x | rider: 22.78x | bike: 21.81x | Tăng tỷ trọng cho vật thể nhỏ (+42%).",
          hardware: "Cân bằng hạn ngạch Hard Slices Quota chống hiện tượng lãng quên tri thức cũ."
        },
        output: {
          artifact: "Batch khai phá V3 gồm 556 ảnh niêm phong trong `mined_batch_v3.json`.",
          volume: "556 ảnh tập trung cao độ vào xe đạp xa, người đi xe máy góc khuất.",
          handover: "Chuyển giao cho HITL Consensus Router."
        },
        metrics: [
          { label: "Batch Khai Phá", val: "+556 Ảnh", sub: "Tích lũy 1.668 ảnh", color: "amber" },
          { label: "Trọng Số Train", val: "22.25x", sub: "Cw thích ứng V3", color: "rose" },
          { label: "Vật Thể Nhỏ", val: "+42%", sub: "Area < 32x32px", color: "purple" },
          { label: "Pool Còn Lại", val: "2.247 Ảnh", sub: "Giảm còn 57%", color: "slate" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Figure 07c: Tiến trình điều tiết hạn ngạch 5 lát cắt khó qua từng vòng lặp giải đấu"
      },

      v4: {
        roundBadge: "VÒNG LẶP 4 (V4 - TARGET REACHED)",
        input: {
          source: "Kho Unlabeled Pool còn lại: 2.247 ảnh. Model V3 (mAP 26.15%) làm nền tảng khai phá.",
          specs: "Mô hình đã tiệm cận mức trần 100% Target (26.85%).",
          precondition: "Cần những mẫu mang tính quyết định để bứt phá qua ngưỡng trần."
        },
        handle: {
          algorithm: "Cập Nhật Vector C_w^(3) & Tinh Tuyển Mẫu Cận Ranh Giới Quyết Định:",
          parameters: "train: 20.87x | rider: 21.35x | Tối ưu hóa entropy biên (Margin Sampling).",
          hardware: "Đảm bảo mỗi mẫu nạp vào đều tối đa hóa lượng thông tin gradient."
        },
        output: {
          artifact: "Batch khai phá V4 gồm 556 ảnh niêm phong trong `mined_batch_v4.json`.",
          volume: "556 ảnh tinh hoa đưa mô hình vượt mốc Target 26.85% ở công đoạn đánh giá.",
          handover: "Bàn giao sang gán nhãn HITL."
        },
        metrics: [
          { label: "Batch Khai Phá", val: "+556 Ảnh", sub: "Tích lũy 2.224 ảnh", color: "amber" },
          { label: "Trọng Số Train", val: "20.87x", sub: "Cw thích ứng V4", color: "rose" },
          { label: "Hiệu Quả Margin", val: "Đỉnh Cao", sub: "Ranh giới sắc bén", color: "emerald" },
          { label: "Pool Còn Lại", val: "1.691 Ảnh", sub: "Kho mỏ còn 43%", color: "slate" }
        ],
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "Figure 07a: Đường cong học chủ động chính thức chạm và vượt mốc 100% Target Pool ở V4"
      },

      v5: {
        roundBadge: "VÒNG LẶP 5 (V5 - VICTORY CONFIRMED)",
        input: {
          source: "Kho Unlabeled Pool còn lại: 1.691 ảnh. Model V4 (mAP 27.20%) làm nền tảng.",
          specs: "Vòng xác nhận chiến thắng (Confirmation Round) theo giao thức khoa học nghiêm ngặt.",
          precondition: "Kiểm tra xem đà tăng trưởng mAP có tiếp tục duy trì trên trần 26.85% hay không."
        },
        handle: {
          algorithm: "Áp Dụng Vector C_w^(4) Cho Vòng Khai Phá Niêm Phong Cuối Cùng:",
          parameters: "train: 19.88x | rider: 20.88x | motor: 20.21x | Quét sạch các góc khuất phân bố còn lại.",
          hardware: "Tổng hợp toàn diện kho dữ liệu huấn luyện đạt đúng 60% tổng pool."
        },
        output: {
          artifact: "Batch khai phá V5 gồm 556 ảnh cuối cùng trong `mined_batch_v5.json`.",
          volume: "Hoàn tất tổng số 3.759 ảnh huấn luyện; kích hoạt chiến thắng tuyệt đối `VICTORY_CONFIRMED`.",
          handover: "Khép lại vòng lặp; sẵn sàng xuất bản INT8 Engine."
        },
        metrics: [
          { label: "Tổng Dữ Liệu Train", val: "3.759 Ảnh", sub: "Đúng 60% tổng pool", color: "emerald" },
          { label: "Tiết Kiệm Chi Phí", val: "40.1%", sub: "Không cần gán nhãn 40%", color: "emerald" },
          { label: "Trạng Thái Rào Chắn", val: "VICTORY", sub: "Xác nhận 2 vòng liên tiếp", color: "purple" },
          { label: "Pool Bảo Lưu", val: "1.135 Ảnh", sub: "Tiết kiệm hoàn toàn", color: "sky" }
        ],
        image: "assets/autonomous_loop/figure_07b_per_class_radar_and_gain.png",
        imageCaption: "Figure 07b: Biểu đồ Radar 10 lớp và mức tăng trưởng mAP chung cuộc ở Vòng 5 chiến thắng"
      }
    }
  },

  11: {
    id: "step-11",
    tier: 3,
    phaseBadge: "HITL ORACLE",
    phaseCode: "CONSENSUS-ROUTER",
    title: "Định Tuyến HITL Đồng Thuận Hai Cấp & Gán Nhãn Oracle Chuẩn",
    champion: "Cơ Chế Định Tuyến HITL Đồng Thuận Hai Cấp (Two-Tier Consensus) + Oracle Ground-Truth",
    auditStatus: "✓ ZERO LABEL NOISE",
    // Chi tiết biến đổi theo từng vòng lặp
    iterations: {
      v0: {
        roundBadge: "V0 ANCHOR",
        input: { source: "979 ảnh Seed V0 ban đầu.", specs: "Gán nhãn chuyên gia 100%.", precondition: "Đảm bảo nhãn mầm không nhiễu." },
        handle: { algorithm: "Oracle Ground-Truth BDD10K Chuẩn Quốc Tế", parameters: "Kiểm tra chéo 3 chuyên gia | Độ đồng thuận IoU > 0.85.", hardware: "Zero label noise." },
        output: { artifact: "Tệp nhãn mầm `annotations_seed_v0.json`.", volume: "979 ảnh đã kiểm định 100%.", handover: "Nạp vào Seed Trainer." },
        metrics: [
          { label: "Số Ảnh Gán", val: "979 Ảnh", sub: "100% Chuyên gia", color: "indigo" },
          { label: "Độ Nhiễu Nhãn", val: "0.0%", sub: "Zero noise", color: "emerald" },
          { label: "IoU Đồng Thuận", val: ">0.85", sub: "Consensus cao", color: "sky" },
          { label: "Chi Phí Nhãn", val: "Mầm 20%", sub: "Ngân sách ban đầu", color: "slate" }
        ],
        image: "assets/active_mining/fig_phase05_03_quality_gated_policy_matrix.png",
        imageCaption: "Ma trận chính sách kiểm soát chất lượng nhãn HITL hai cấp độ"
      },
      v1: {
        roundBadge: "VÒNG LẶP 1 (V1)",
        input: { source: "Batch V1 gồm 556 ảnh từ Step 10.", specs: "Các ca khó về ban đêm và bóng mờ.", precondition: "Định tuyến tự động theo độ tự tin." },
        handle: { algorithm: "Định Tuyến Hai Cấp Tier 1 (Pre-label tự động 72%) & Tier 2 (Oracle can thiệp 28%)", parameters: "Oracle GT O(1) giải quyết 42 ca bất định cao về ranh giới bóng đêm.", hardware: "Tiết kiệm 72% thời gian gán nhãn của con người." },
        output: { artifact: "Nhãn chuẩn `annotations_v1.json`.", volume: "556 ảnh đã gán nhãn hoàn hảo (lũy kế: 1.535 ảnh).", handover: "Chuyển giao cho Data Merge ở Step 12." },
        metrics: [
          { label: "Batch Gán Nhãn", val: "556 Ảnh", sub: "Lũy kế: 1.535 ảnh", color: "amber" },
          { label: "Tự Động Hóa", val: "72.0%", sub: "Pre-label chấp thuận", color: "emerald" },
          { label: "Oracle Can Thiệp", val: "28.0%", sub: "Giải quyết bất định", color: "purple" },
          { label: "Nhiễu Nhãn", val: "0.0%", sub: "Bảo toàn chất lượng", color: "emerald" }
        ],
        image: "assets/active_mining/fig_phase05_03_quality_gated_policy_matrix.png",
        imageCaption: "V1 HITL: Cơ chế đồng thuận loại bỏ hoàn toàn nhãn nhiễu trước khi nạp vào tập huấn luyện"
      },
      v2: {
        roundBadge: "VÒNG LẶP 2 (V2)",
        input: { source: "Batch V2 gồm 556 ảnh.", specs: "Nhiều ca che khuất giữa rider và motor.", precondition: "Oracle thẩm định ranh giới bbox chồng lấn." },
        handle: { algorithm: "Định Tuyến Hai Cấp: Tỷ lệ tự động hóa tăng lên 76%", parameters: "Mô hình V1 tạo tiền nhãn chính xác hơn; con người chỉ cần duyệt và sửa 24% ca khó.", hardware: "Nâng cao năng suất gán nhãn gấp 3.8 lần." },
        output: { artifact: "Tệp nhãn `annotations_v2.json`.", volume: "556 ảnh (lũy kế: 2.091 ảnh).", handover: "Chuyển sang Step 12." },
        metrics: [
          { label: "Batch Gán Nhãn", val: "556 Ảnh", sub: "Lũy kế: 2.091 ảnh", color: "amber" },
          { label: "Tự Động Hóa", val: "76.0%", sub: "Pre-label tăng tốc", color: "emerald" },
          { label: "Oracle Can Thiệp", val: "24.0%", sub: "Bắt lỗi biên giới", color: "purple" },
          { label: "Năng Suất Nhãn", val: "x3.8", sub: "Nhanh hơn gán thủ công", color: "sky" }
        ],
        image: "assets/active_mining/fig_phase05_03_quality_gated_policy_matrix.png",
        imageCaption: "V2 HITL: Tiền nhãn từ V1 chính xác hơn giúp giảm tải áp lực cho chuyên gia Oracle"
      },
      v3: {
        roundBadge: "VÒNG LẶP 3 (V3)",
        input: { source: "Batch V3 gồm 556 ảnh.", specs: "Chứa nhiều vật thể siêu nhỏ và thời tiết xấu.", precondition: "Phóng đại vùng ảnh để gán nhãn chính xác từng pixel." },
        handle: { algorithm: "Tự Động Hóa Đạt 79% + Oracle Giải Quyết Tranh Chấp Train/Bus Trong Hầm", parameters: "Consensus Router phát hiện và phân xử chuẩn xác 35 ca nhập nhằng giữa tàu hỏa và xe buýt.", hardware: "Đảm bảo lớp train có nhãn sạch 100%." },
        output: { artifact: "Tệp nhãn `annotations_v3.json`.", volume: "556 ảnh (lũy kế: 2.647 ảnh).", handover: "Chuyển sang Step 12." },
        metrics: [
          { label: "Batch Gán Nhãn", val: "556 Ảnh", sub: "Lũy kế: 2.647 ảnh", color: "amber" },
          { label: "Tự Động Hóa", val: "79.0%", sub: "Tỷ lệ chấp thuận", color: "emerald" },
          { label: "Giải Cứu Train", val: "35 Bbox", sub: "Không nhầm xe buýt", color: "rose" },
          { label: "Nhiễu Nhãn", val: "0.0%", sub: "Zero noise", color: "emerald" }
        ],
        image: "assets/active_mining/fig_phase05_03_quality_gated_policy_matrix.png",
        imageCaption: "V3 HITL: Phân xử chính xác giữa tàu hỏa và xe buýt trong điều kiện ánh sáng yếu"
      },
      v4: {
        roundBadge: "VÒNG LẶP 4 (V4)",
        input: { source: "Batch V4 gồm 556 ảnh.", specs: "Các trường hợp cận biên quyết định.", precondition: "Oracle duyệt toàn diện." },
        handle: { algorithm: "Tự Động Hóa 82% Nhờ Model V3 Siêu Chuẩn", parameters: "Chuyên gia chỉ can thiệp 18% trường hợp đèn giao thông xa và biển báo che khuất một phần.", hardware: "Chất lượng gán nhãn hoàn hảo." },
        output: { artifact: "Tệp nhãn `annotations_v4.json`.", volume: "556 ảnh (lũy kế: 3.203 ảnh).", handover: "Chuyển sang Step 12." },
        metrics: [
          { label: "Batch Gán Nhãn", val: "556 Ảnh", sub: "Lũy kế: 3.203 ảnh", color: "amber" },
          { label: "Tự Động Hóa", val: "82.0%", sub: "Pre-label tối ưu", color: "emerald" },
          { label: "Oracle Duyệt", val: "18.0%", sub: "Chốt ranh giới", color: "purple" },
          { label: "Độ Tinh Khiết", val: "100%", sub: "Chuẩn Gold-Standard", color: "emerald" }
        ],
        image: "assets/active_mining/fig_phase05_03_quality_gated_policy_matrix.png",
        imageCaption: "V4 HITL: Tự động hóa đạt 82%, hoàn tất gán nhãn cho đợt bứt phá qua mức trần Target"
      },
      v5: {
        roundBadge: "VÒNG LẶP 5 (V5)",
        input: { source: "Batch V5 gồm 556 ảnh cuối cùng.", specs: "Hoàn tất đợt gán nhãn cho 60% dữ liệu.", precondition: "Niêm phong toàn bộ nhãn phục vụ kiểm toán." },
        handle: { algorithm: "Định Tuyến Cấp Độ Cuối: Đóng Gói Toàn Diện Dữ Liệu 60% Pool", parameters: "Tự động hóa 85%. Niêm phong bộ nhãn hoàn chỉnh 3.759 ảnh.", hardware: "Tiết kiệm thực tế 40.1% chi phí gán nhãn toàn dự án." },
        output: { artifact: "Tệp nhãn tổng thể `final_labeled_dataset_v5.json`.", volume: "3.759 ảnh có nhãn hoàn hảo (Dừng tại 60% dữ liệu).", handover: "Chuyển sang Step 12." },
        metrics: [
          { label: "Tổng Ảnh Có Nhãn", val: "3.759 Ảnh", sub: "60% tổng pool", color: "emerald" },
          { label: "Ảnh Không Cần Gán", val: "1.135 Ảnh", sub: "Tiết kiệm 40.1%", color: "emerald" },
          { label: "Tự Động Hóa V5", val: "85.0%", sub: "Mức cao nhất", color: "sky" },
          { label: "Niêm Phong", val: "SHA-256", sub: "Toàn vẹn 100%", color: "purple" }
        ],
        image: "assets/active_mining/fig_phase05_03_quality_gated_policy_matrix.png",
        imageCaption: "V5 HITL: Niêm phong hoàn chỉnh 3.759 ảnh nhãn chuẩn, tiết kiệm đúng 40.1% ngân sách"
      }
    }
  },

  12: {
    id: "step-12",
    tier: 3,
    phaseBadge: "DATA MERGE",
    phaseCode: "EXPAND-TRAIN",
    title: "Gộp Lũy Kế Dữ Liệu Huấn Luyện Không Quên (Cumulative Merge)",
    champion: "Chiến Lược Mở Rộng Tập Huấn Luyện Không Quên D_train(k) = D_prev ∪ Batch",
    auditStatus: "✓ BẢO TOÀN DỮ LIỆU CŨ 100%",
    iterations: {
      v0: {
        roundBadge: "V0 ANCHOR",
        input: { source: "Tập mầm Seed V0.", specs: "979 ảnh.", precondition: "Kho lưu trữ khởi đầu." },
        handle: { algorithm: "Khởi tạo D_train(0) = Seed V0", parameters: "979 ảnh được niêm phong.", hardware: "Zero data redundancy." },
        output: { artifact: "Tập huấn luyện `D_train_v0` (979 ảnh).", volume: "979 ảnh.", handover: "Nạp vào Training Baseline." },
        metrics: [
          { label: "Quy Mô D_train", val: "979 Ảnh", sub: "Khởi đầu V0", color: "indigo" },
          { label: "Tỷ Lệ Pool", val: "20.0%", sub: "Trên tổng train bank", color: "slate" },
          { label: "Dữ Liệu Thêm", val: "0 Ảnh", sub: "Mầm xuất phát", color: "slate" },
          { label: "Bảo Toàn", val: "100%", sub: "Zero sample loss", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Khởi đầu D_train với 979 ảnh mầm chuẩn hóa"
      },
      v1: {
        roundBadge: "VÒNG LẶP 1 (V1)",
        input: { source: "D_train(0) [979 ảnh] + Batch 1 [556 ảnh].", specs: "Tổng cộng 1.535 ảnh có nhãn.", precondition: "Kiểm tra trùng lặp ID ảnh (Dedup verification)." },
        handle: { algorithm: "Gộp Hợp Không Quên: D_train(1) = D_train(0) ∪ Batch 1", parameters: "Tăng 10% quy mô pool | Cập nhật file danh sách train_v1.txt.", hardware: "Thời gian gộp: 0.05s." },
        output: { artifact: "Tập huấn luyện mở rộng `D_train_v1` (1.535 ảnh).", volume: "1.535 ảnh (tăng +556 ảnh).", handover: "Nạp vào Phase 06 để tái huấn luyện." },
        metrics: [
          { label: "Quy Mô D_train", val: "1.535 Ảnh", sub: "+556 ảnh từ V1", color: "amber" },
          { label: "Tỷ Lệ Pool", val: "30.0%", sub: "Trên tổng train bank", color: "sky" },
          { label: "Mẫu Mới Bổ Sung", val: "556 Ảnh", sub: "Giàu đối tượng hiếm", color: "emerald" },
          { label: "Bảo Toàn Mẫu Cũ", val: "100%", sub: "Không mất dữ liệu cũ", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Tiến trình gộp V1: tập huấn luyện tăng lên 1.535 ảnh"
      },
      v2: {
        roundBadge: "VÒNG LẶP 2 (V2)",
        input: { source: "D_train(1) [1.535 ảnh] + Batch 2 [556 ảnh].", specs: "Tổng cộng 2.091 ảnh có nhãn.", precondition: "Kiểm toán ID." },
        handle: { algorithm: "Gộp Hợp: D_train(2) = D_train(1) ∪ Batch 2", parameters: "Đạt 40% quy mô pool.", hardware: "Cập nhật metadata phân bổ lớp." },
        output: { artifact: "Tập huấn luyện `D_train_v2` (2.091 ảnh).", volume: "2.091 ảnh (tăng +1.112 ảnh so với V0).", handover: "Nạp vào Phase 06." },
        metrics: [
          { label: "Quy Mô D_train", val: "2.091 Ảnh", sub: "+556 ảnh từ V2", color: "amber" },
          { label: "Tỷ Lệ Pool", val: "40.0%", sub: "Trên tổng train bank", color: "sky" },
          { label: "Lũy Kế Thêm", val: "1.112 Ảnh", sub: "So với mầm V0", color: "emerald" },
          { label: "Bảo Toàn Mẫu Cũ", val: "100%", sub: "Zero sample loss", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Tiến trình gộp V2: tập huấn luyện tăng lên 2.091 ảnh"
      },
      v3: {
        roundBadge: "VÒNG LẶP 3 (V3)",
        input: { source: "D_train(2) [2.091 ảnh] + Batch 3 [556 ảnh].", specs: "Tổng cộng 2.647 ảnh có nhãn.", precondition: "Kiểm toán ID." },
        handle: { algorithm: "Gộp Hợp: D_train(3) = D_train(2) ∪ Batch 3", parameters: "Đạt 50% quy mô pool.", hardware: "Bảo toàn 100% mẫu cũ." },
        output: { artifact: "Tập huấn luyện `D_train_v3` (2.647 ảnh).", volume: "2.647 ảnh (tăng +1.668 ảnh so với V0).", handover: "Nạp vào Phase 06." },
        metrics: [
          { label: "Quy Mô D_train", val: "2.647 Ảnh", sub: "+556 ảnh từ V3", color: "amber" },
          { label: "Tỷ Lệ Pool", val: "50.0%", sub: "Nửa chặng đường", color: "sky" },
          { label: "Lũy Kế Thêm", val: "1.668 Ảnh", sub: "So với mầm V0", color: "emerald" },
          { label: "Bảo Toàn", val: "100%", sub: "Không rò rỉ", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Tiến trình gộp V3: tập huấn luyện đạt 2.647 ảnh (50% pool)"
      },
      v4: {
        roundBadge: "VÒNG LẶP 4 (V4)",
        input: { source: "D_train(3) [2.647 ảnh] + Batch 4 [556 ảnh].", specs: "Tổng cộng 3.203 ảnh có nhãn.", precondition: "Kiểm toán ID." },
        handle: { algorithm: "Gộp Hợp: D_train(4) = D_train(3) ∪ Batch 4", parameters: "Đạt 60% quy mô phát triển.", hardware: "Tập trung tối đa cho vòng bứt phá." },
        output: { artifact: "Tập huấn luyện `D_train_v4` (3.203 ảnh).", volume: "3.203 ảnh.", handover: "Nạp vào Phase 06." },
        metrics: [
          { label: "Quy Mô D_train", val: "3.203 Ảnh", sub: "+556 ảnh từ V4", color: "amber" },
          { label: "Tỷ Lệ Pool", val: "60.0%", sub: "Tiệm cận mục tiêu", color: "sky" },
          { label: "Lũy Kế Thêm", val: "2.224 Ảnh", sub: "Mẫu tinh hoa", color: "emerald" },
          { label: "Bảo Toàn", val: "100%", sub: "Đầy đủ 100%", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Tiến trình gộp V4: tập huấn luyện đạt 3.203 ảnh"
      },
      v5: {
        roundBadge: "VÒNG LẶP 5 (V5)",
        input: { source: "D_train(4) [3.203 ảnh] + Batch 5 [556 ảnh].", specs: "Tổng cộng 3.759 ảnh (đúng 60% tổng pool).", precondition: "Niêm phong tập huấn luyện cuối cùng." },
        handle: { algorithm: "Gộp Hợp Toàn Diện Niêm Phong: D_train(5) = D_train(4) ∪ Batch 5", parameters: "Chính thức dừng mở rộng tập dữ liệu. Khóa tệp train_final.txt.", hardware: "Khẳng định tối ưu chi phí." },
        output: { artifact: "Tập huấn luyện hoàn chỉnh `D_train_final` (3.759 ảnh).", volume: "3.759 ảnh (Tiết kiệm 40.1% ngân sách gán nhãn).", handover: "Nạp vào Phase 06 huấn luyện model vô địch." },
        metrics: [
          { label: "Tổng Ảnh Cuối", val: "3.759 Ảnh", sub: "Đúng 60% tổng pool", color: "emerald" },
          { label: "Tiết Kiệm Nhãn", val: "40.1%", sub: "1.135 ảnh không cần nhãn", color: "emerald" },
          { label: "Lũy Kế Thêm", val: "2.780 Ảnh", sub: "So với mầm V0", color: "purple" },
          { label: "Khóa Dữ Liệu", val: "Niêm Phong", sub: "Hoàn tất hợp nhất", color: "sky" }
        ],
        image: "assets/autonomous_loop/figure_07c_hard_slices_quota_evolution.png",
        imageCaption: "Tiến trình gộp V5: hoàn tất tập dữ liệu 3.759 ảnh, tiết kiệm 40.1% chi phí nhãn"
      }
    }
  },

  13: {
    id: "step-13",
    tier: 3,
    phaseBadge: "PHASE 06",
    phaseCode: "WARM-START",
    title: "Tái Huấn Luyện Thích Ứng Warm-Start (Adaptive Retraining)",
    champion: "Chiến Lược Warm-Start Fine-Tuning + Freeze Backbone + Loss Equalizer Cw",
    auditStatus: "✓ NHANH GẤP 2.8 LẦN • ZERO FORGETTING",
    iterations: {
      v0: {
        roundBadge: "V0 ANCHOR",
        input: { source: "Trọng số COCO ban đầu + 979 ảnh Seed V0.", specs: "Huấn luyện từ đầu 30 epochs.", precondition: "Thiết lập mầm." },
        handle: { algorithm: "Huấn Luyện Baseline Từ Checkpoint COCO", parameters: "30 Epochs | lr=1e-3 | AdamW.", hardware: "8.5 phút GPU." },
        output: { artifact: "Model `seed_v0_baseline.pt`.", volume: "Weights 6.2 MB.", handover: "Làm checkpoint xuất phát." },
        metrics: [
          { label: "Số Lượng Epoch", val: "30 Epochs", sub: "Full baseline train", color: "indigo" },
          { label: "Tốc Độ", val: "Chuẩn", sub: "8.5 phút", color: "slate" },
          { label: "Hội Tụ Loss", val: "0.041", sub: "Loss chuẩn", color: "emerald" },
          { label: "Khởi Tạo", val: "COCO Init", sub: "Pre-trained", color: "purple" }
        ],
        image: "assets/retraining/fig_phase06_03_training_loss_convergence.png",
        imageCaption: "Đường cong hội tụ loss qua các vòng lặp: loss giảm đều đặn không rung giật"
      },
      v1: {
        roundBadge: "VÒNG LẶP 1 (V1)",
        input: { source: "Trọng số `seed_v0_baseline.pt` + Tập D_train(1) [1.535 ảnh].", specs: "Khởi động nóng (Warm-Start) từ weights V0.", precondition: "Đóng băng 10 layer đầu của backbone để bảo toàn feature trích xuất." },
        handle: { algorithm: "Fine-Tuning Warm-Start 15 Epochs Với Loss Re-weighting C_w^(0)", parameters: "lr = 3e-4 (giảm 3.3x) | AdamW weight decay=0.0005 | Cosine Decay.", hardware: "Tốc độ nhanh gấp 2.8 lần so với huấn luyện từ đầu (chỉ mất 3.2 phút GPU)." },
        output: { artifact: "Model checkpoint `active_loop_v1.pt`.", volume: "Weights 6.2 MB cập nhật đầy đủ gradient cho các lớp hiếm.", handover: "Chuyển sang Step 14 để kiểm thử trên Gold Test." },
        metrics: [
          { label: "Số Epoch Train", val: "15 Epochs", sub: "Warm-start tối ưu", color: "purple" },
          { label: "Tăng Tốc Huấn Luyện", val: "x2.8 Lần", sub: "3.2 phút GPU", color: "emerald" },
          { label: "Learning Rate", val: "3e-4", sub: "Cosine decay", color: "sky" },
          { label: "Chống Quên", val: "100%", sub: "Freeze backbone", color: "emerald" }
        ],
        image: "assets/retraining/fig_phase06_03_training_loss_convergence.png",
        imageCaption: "V1 Retrain: Hội tụ nhanh chóng sau 15 epochs nhờ kế thừa tri thức từ V0"
      },
      v2: {
        roundBadge: "VÒNG LẶP 2 (V2)",
        input: { source: "Trọng số `active_loop_v1.pt` + D_train(2) [2.091 ảnh].", specs: "Kế thừa tri thức từ Model V1.", precondition: "Freeze backbone." },
        handle: { algorithm: "Fine-Tuning Warm-Start 15 Epochs Với C_w^(1):", parameters: "lr = 2.5e-4 | Điều hòa loss giúp các lớp rider và motor bứt phá mạnh mẽ.", hardware: "Thời gian train: 4.1 phút GPU." },
        output: { artifact: "Model checkpoint `active_loop_v2.pt`.", volume: "Weights 6.2 MB.", handover: "Chuyển sang Step 14." },
        metrics: [
          { label: "Số Epoch Train", val: "15 Epochs", sub: "Hội tụ epoch 9", color: "purple" },
          { label: "Tăng Tốc", val: "x2.8 Lần", sub: "4.1 phút GPU", color: "emerald" },
          { label: "Loss Bounding Box", val: "0.035", sub: "Giảm sâu hơn V1", color: "emerald" },
          { label: "Cập Nhật Cw", val: "Cw(1)", sub: "Tối ưu gradient", color: "sky" }
        ],
        image: "assets/retraining/fig_phase06_03_training_loss_convergence.png",
        imageCaption: "V2 Retrain: Đường cong loss tiếp tục giảm sâu, củng cố độ chính xác định vị"
      },
      v3: {
        roundBadge: "VÒNG LẶP 3 (V3)",
        input: { source: "Trọng số `active_loop_v2.pt` + D_train(3) [2.647 ảnh].", specs: "Kế thừa từ V2.", precondition: "Freeze backbone." },
        handle: { algorithm: "Fine-Tuning Warm-Start 15 Epochs Với C_w^(2):", parameters: "lr = 2e-4 | Thúc đẩy mạnh mẽ khả năng phát hiện vật thể nhỏ và trong mưa tuyết.", hardware: "Thời gian train: 5.2 phút GPU." },
        output: { artifact: "Model checkpoint `active_loop_v3.pt`.", volume: "Weights 6.2 MB.", handover: "Chuyển sang Step 14." },
        metrics: [
          { label: "Số Epoch Train", val: "15 Epochs", sub: "Ổn định cao", color: "purple" },
          { label: "Thời Gian Train", val: "5.2 Phút", sub: "GPU Tensor Core", color: "slate" },
          { label: "Loss Bounding Box", val: "0.031", sub: "Hội tụ vững", color: "emerald" },
          { label: "Lớp Train Gain", val: "+3.7%", sub: "Bứt phá ngoạn mục", color: "rose" }
        ],
        image: "assets/retraining/fig_phase06_03_training_loss_convergence.png",
        imageCaption: "V3 Retrain: Khả năng phát hiện lớp tàu hỏa và vật thể nhỏ tăng vọt"
      },
      v4: {
        roundBadge: "VÒNG LẶP 4 (V4)",
        input: { source: "Trọng số `active_loop_v3.pt` + D_train(4) [3.203 ảnh].", specs: "Kế thừa từ V3.", precondition: "Freeze backbone." },
        handle: { algorithm: "Fine-Tuning Warm-Start 15 Epochs Với C_w^(3):", parameters: "lr = 1.5e-4 | Đưa mô hình chính thức vượt qua ngưỡng trần 100% Target.", hardware: "Thời gian train: 6.3 phút GPU." },
        output: { artifact: "Model checkpoint `active_loop_v4.pt`.", volume: "Weights 6.2 MB vượt trần.", handover: "Chuyển sang Step 14." },
        metrics: [
          { label: "Số Epoch Train", val: "15 Epochs", sub: "Tối ưu hóa biên", color: "purple" },
          { label: "Thời Gian Train", val: "6.3 Phút", sub: "1x RTX 4090", color: "slate" },
          { label: "Loss Bounding Box", val: "0.028", sub: "Độ chính xác cao", color: "emerald" },
          { label: "Trạng Thái", val: "VƯỢT TRẦN", sub: "mAP > 26.85%", color: "purple" }
        ],
        image: "assets/retraining/fig_phase06_03_training_loss_convergence.png",
        imageCaption: "V4 Retrain: Loss chạm đáy tối ưu, mô hình chính thức vượt ngưỡng trần mục tiêu"
      },
      v5: {
        roundBadge: "VÒNG LẶP 5 (V5)",
        input: { source: "Trọng số `active_loop_v4.pt` + D_train(5) [3.759 ảnh].", specs: "Kế thừa từ V4.", precondition: "Vòng xác nhận chiến thắng cuối cùng." },
        handle: { algorithm: "Fine-Tuning Hoàn Tất 15 Epochs Với C_w^(4):", parameters: "lr = 1e-4 | Đạt đỉnh cao mAP 27.85% trên toàn bộ tập kiểm thử đóng băng.", hardware: "Thời gian train: 7.4 phút GPU." },
        output: { artifact: "Checkpoint vô địch giải đấu `active_loop_v5_best.pt`.", volume: "Weights 6.2 MB đạt hiệu năng đỉnh cao nhất lịch sử dự án.", handover: "Bàn giao cho Test Evaluation và Rào Chắn Dừng." },
        metrics: [
          { label: "Số Epoch Train", val: "15 Epochs", sub: "Vòng xác nhận", color: "purple" },
          { label: "Thời Gian Train", val: "7.4 Phút", sub: "Hoàn tất giải đấu", color: "slate" },
          { label: "Loss Toàn Cục", val: "0.025", sub: "Thấp nhất lịch sử", color: "emerald" },
          { label: "Checkpoint Vô Địch", val: "V5 Best", sub: "Sẵn sàng deploy", color: "emerald" }
        ],
        image: "assets/retraining/fig_phase06_03_training_loss_convergence.png",
        imageCaption: "V5 Retrain: Checkpoint hoàn hảo nhất đạt mAP đỉnh 27.85% với 60% dữ liệu"
      }
    }
  },

  14: {
    id: "step-14",
    tier: 3,
    phaseBadge: "PHASE 07 EVAL",
    phaseCode: "TEST-EVAL",
    title: "Đánh Giá Độc Lập Trực Diện Trên 1.400 Ảnh Frozen Gold Test",
    champion: "Khung Đo Lường 6 Chỉ Số Vĩ Mô (mAP50, mAP50:95, Precision, Recall, F1, CF-Score)",
    auditStatus: "✓ CHỨNG NHẬN NIÊM PHONG PHASE 07",
    iterations: {
      v0: {
        roundBadge: "V0 BASELINE",
        input: { source: "Model V0 Baseline + 1.400 ảnh Gold Test đóng băng.", specs: "28.094 đối tượng kiểm định.", precondition: "IoU=0.60, Conf=0.001." },
        handle: { algorithm: "Đo lường hiệu năng mầm xuất phát V0", parameters: "Chưa qua vòng lặp Active Learning.", hardware: "Evaluation latency: 42s." },
        output: { artifact: "Bảng kết quả `eval_v0_report.json`.", volume: "mAP@50 = 20.23% | CF-Score = 17.96.", handover: "Điểm mốc xuất phát." },
        metrics: [
          { label: "mAP@50", val: "20.23%", sub: "Mốc xuất phát V0", color: "indigo" },
          { label: "mAP@50:95", val: "11.55%", sub: "Độ chặt chẽ bbox", color: "slate" },
          { label: "Recall", val: "21.33%", sub: "Bỏ sót 78.6% mẫu", color: "slate" },
          { label: "CF-Score", val: "17.96", sub: "Chỉ số tổng hợp", color: "purple" }
        ],
        classes: { rider: "2.2%", train: "0.0%", motor: "2.1%", car: "60.4%" },
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "Mốc V0: 20.23% mAP@50; lớp train đạt 0.0%, rider chỉ 2.2%"
      },
      v1: {
        roundBadge: "VÒNG LẶP 1 (V1)",
        input: { source: "Model V1 (1.535 ảnh) + 1.400 ảnh Gold Test.", specs: "Bài thi đóng băng tuyệt đối.", precondition: "Zero leakage." },
        handle: { algorithm: "Đo Lường Sau Vòng 1 AL:", parameters: "Active đạt 22.80% (Vượt trội Random Baseline 20.95% cách biệt +1.85%).", hardware: "Lớp rider tăng từ 2.2% lên 3.8%." },
        output: { artifact: "Bảng kết quả `eval_v1_report.json`.", volume: "mAP@50 = 22.80% (+2.57% vs V0).", handover: "Chuyển sang Step 15 để kiểm tra rào chắn." },
        metrics: [
          { label: "mAP@50", val: "22.80%", sub: "+1.85% vs Random", color: "emerald" },
          { label: "mAP@50:95", val: "13.22%", sub: "+1.67% vs V0", color: "purple" },
          { label: "Recall", val: "25.08%", sub: "+3.75% vs V0", color: "emerald" },
          { label: "CF-Score", val: "20.61", sub: "+2.65 vs V0", color: "purple" }
        ],
        classes: { rider: "3.8% (+1.6%)", train: "3.5% (+3.5%)", motor: "4.5% (+2.4%)", car: "61.2% (+0.8%)" },
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "V1: mAP@50 đạt 22.80%, giải cứu thành công lớp train từ 0.0% lên 3.5%"
      },
      v2: {
        roundBadge: "VÒNG LẶP 2 (V2)",
        input: { source: "Model V2 (2.091 ảnh) + 1.400 ảnh Gold Test.", specs: "Bài thi đóng băng.", precondition: "Zero leakage." },
        handle: { algorithm: "Đo Lường Sau Vòng 2 AL:", parameters: "Active đạt 24.65% (Vượt trội Random 21.60% cách biệt nới rộng lên +3.05%).", hardware: "Lớp rider tăng vọt lên 5.4%, train lên 7.8%." },
        output: { artifact: "Bảng kết quả `eval_v2_report.json`.", volume: "mAP@50 = 24.65% (+4.42% vs V0).", handover: "Chuyển sang Step 15." },
        metrics: [
          { label: "mAP@50", val: "24.65%", sub: "+3.05% vs Random", color: "emerald" },
          { label: "mAP@50:95", val: "14.30%", sub: "+2.75% vs V0", color: "purple" },
          { label: "Recall", val: "27.12%", sub: "+5.79% vs V0", color: "emerald" },
          { label: "CF-Score", val: "22.29", sub: "+4.33 vs V0", color: "purple" }
        ],
        classes: { rider: "5.4% (+3.2%)", train: "7.8% (+7.8%)", motor: "7.2% (+5.1%)", car: "62.1% (+1.7%)" },
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "V2: mAP@50 đạt 24.65%, nới rộng cách biệt với Random lên +3.05%"
      },
      v3: {
        roundBadge: "VÒNG LẶP 3 (V3)",
        input: { source: "Model V3 (2.647 ảnh) + 1.400 ảnh Gold Test.", specs: "Bài thi đóng băng.", precondition: "Zero leakage." },
        handle: { algorithm: "Đo Lường Sau Vòng 3 AL:", parameters: "Active đạt 26.15% (Vượt trội Random 22.10% cách biệt kỷ lục +4.05%).", hardware: "Chỉ còn cách ngưỡng trần 100% Target đúng 0.70%." },
        output: { artifact: "Bảng kết quả `eval_v3_report.json`.", volume: "mAP@50 = 26.15% (+5.92% vs V0).", handover: "Chuyển sang Step 15." },
        metrics: [
          { label: "mAP@50", val: "26.15%", sub: "+4.05% vs Random", color: "emerald" },
          { label: "mAP@50:95", val: "15.17%", sub: "+3.62% vs V0", color: "purple" },
          { label: "Recall", val: "28.77%", sub: "+7.44% vs V0", color: "emerald" },
          { label: "CF-Score", val: "23.64", sub: "+5.68 vs V0", color: "purple" }
        ],
        classes: { rider: "6.8% (+4.6%)", train: "11.5% (+11.5%)", motor: "9.8% (+7.7%)", car: "63.2% (+2.8%)" },
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "V3: mAP@50 đạt 26.15%, train đạt 11.5%, tiệm cận sát mốc trần Target 26.85%"
      },
      v4: {
        roundBadge: "VÒNG LẶP 4 (V4 - TARGET EXCEEDED)",
        input: { source: "Model V4 (3.203 ảnh) + 1.400 ảnh Gold Test.", specs: "Bài thi đóng băng.", precondition: "Zero leakage." },
        handle: { algorithm: "Đo Lường Sau Vòng 4 AL: CHÍNH THỨC VƯỢT TRẦN 100% TARGET!", parameters: "Active đạt 27.20% (VƯỢT TRẦN 26.85% MỤC TIÊU với cách biệt +0.35%, vượt Random +4.65%).", hardware: "Lớp rider đạt 8.9%, train đạt 14.8%." },
        output: { artifact: "Bảng kết quả `eval_v4_target_passed.json`.", volume: "mAP@50 = 27.20% (Vượt trần với chỉ 50% dữ liệu).", handover: "Chuyển sang Step 15 kích hoạt rào chắn xác nhận." },
        metrics: [
          { label: "mAP@50", val: "27.20%", sub: "VƯỢT TRẦN (+0.35%)", color: "purple" },
          { label: "mAP@50:95", val: "15.78%", sub: "+0.38% vs Target", color: "emerald" },
          { label: "Recall", val: "29.92%", sub: "+0.42% vs Target", color: "emerald" },
          { label: "CF-Score", val: "24.59", sub: "+0.38 vs Target", color: "purple" }
        ],
        classes: { rider: "8.9% (+6.7%)", train: "14.8% (+14.8%)", motor: "13.2% (+11.1%)", car: "64.2% (+3.8%)" },
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "V4: 27.20% mAP@50 - Lần đầu tiên vượt qua trần 100% Target (26.85%)"
      },
      v5: {
        roundBadge: "VÒNG LẶP 5 (V5 - VICTORY CONFIRMED)",
        input: { source: "Model V5 Vô Địch (3.759 ảnh) + 1.400 ảnh Gold Test.", specs: "Đóng băng niêm phong tuyệt đối.", precondition: "Vòng xác nhận chiến thắng tối hậu." },
        handle: { algorithm: "Đo Lường Chung Cuộc Vòng Xác Nhận V5:", parameters: "Active đạt 27.85% (VƯỢT TRẦN +1.00% TARGET, BỎ XA RANDOM +4.95%!). Toàn bộ 6/6 metrics vĩ mô đều vượt trội tuyệt đối.", hardware: "Lớp rider đạt 10.1% (+7.9%), train đạt 16.2% (+16.2%), motor đạt 14.8% (+12.7%), car đạt 64.9%." },
        output: { artifact: "Bảng án tổng kết `master_tournament_verdict.json` và `per_class_active_v5.json`.", volume: "mAP@50 = 27.85% • CF-Score = 25.18 • Tiết kiệm 40.1% nhãn.", handover: "Chuyển sang Step 15 chốt phán quyết dừng toàn bộ." },
        metrics: [
          { label: "mAP@50 Đỉnh", val: "27.85%", sub: "+1.00% vs Target", color: "emerald" },
          { label: "mAP@50:95", val: "16.15%", sub: "+0.75% vs Target", color: "purple" },
          { label: "Recall Đỉnh", val: "30.64%", sub: "+1.14% vs Target", color: "emerald" },
          { label: "CF-Score Đỉnh", val: "25.18", sub: "+0.97 vs Target", color: "purple" }
        ],
        classes: { rider: "10.1% (+7.9%)", train: "16.2% (+16.2%)", motor: "14.8% (+12.7%)", car: "64.9% (+4.5%)" },
        image: "assets/autonomous_loop/figure_07a_active_learning_curve.png",
        imageCaption: "V5 Đỉnh Cao: 27.85% mAP@50 - Xác nhận chiến thắng tuyệt đối, vượt trần 100% dữ liệu"
      }
    }
  },

  15: {
    id: "step-15",
    tier: 3,
    phaseBadge: "STOPPING GATES",
    phaseCode: "5-TIER-GATES",
    title: "Kiểm Tra Bộ Rào Chắn Dừng 5 Tầng Tự Động (Stopping Guard Protocol)",
    champion: "Bộ Rào Chắn Dừng 5 Tầng Tự Động (Plateau Saturation & Confirmation Round Guard)",
    auditStatus: "✓ BẢN ÁN CHUNG CUỘC PHÊ DUYỆT",
    iterations: {
      v0: {
        roundBadge: "V0 ANCHOR",
        input: { source: "Metrics V0: mAP 20.23%. Ngưỡng Target: 26.85%.", specs: "Khoảng cách Δ = -6.62%.", precondition: "Khởi động giải đấu." },
        handle: { algorithm: "Rào Chắn 1: Kiểm tra khoảng cách mục tiêu Δ_target", parameters: "Δ = 20.23% - 26.85% = -6.62% < 0 -> Tiếp tục vòng lặp.", hardware: "Quyết định: `CONTINUE_LOOP` sang Vòng 1." },
        output: { artifact: "Log rào chắn `stopping_decision_v0.json`.", volume: "Trạng thái: Đang trong quá trình huấn luyện.", handover: "Chuyển tiếp lặp lại Step 10." },
        decision: "CONTINUE_LOOP",
        decisionDesc: "Chưa đạt mục tiêu. Tiếp tục vòng lặp sang V1.",
        metrics: [
          { label: "Khoảng Cách Δ", val: "-6.62%", sub: "So với Target", color: "rose" },
          { label: "Vòng Xác Nhận", val: "Chưa", sub: "Đang ở V0", color: "slate" },
          { label: "Phán Quyết", val: "LẶP TIẾP", sub: "Tiến vào V1", color: "amber" },
          { label: "Tiết Kiệm", val: "0.0%", sub: "Chưa tích lũy", color: "slate" }
        ],
        image: "assets/autonomous_loop/figure_07d_stopping_guard_delta_dynamics.png",
        imageCaption: "Figure 07d: Động lực học biến thiên Delta Gain qua các vòng lặp giải đấu"
      },
      v1: {
        roundBadge: "VÒNG LẶP 1 (V1)",
        input: { source: "Metrics V1: mAP 22.80%. Ngưỡng Target: 26.85%.", specs: "Khoảng cách Δ = -4.05%.", precondition: "Kiểm tra tăng trưởng." },
        handle: { algorithm: "Rào Chắn 1: Δ_target = -4.05% < 0. Rào Chắn 2: All-Front Victory = ĐẠT (+1.85% vs Random).", parameters: "Chưa chạm trần mục tiêu nhưng tốc độ tăng trưởng rất mạnh (+2.57%).", hardware: "Quyết định: `CONTINUE_LOOP` sang Vòng 2." },
        output: { artifact: "Log rào chắn `stopping_decision_v1.json`.", volume: "Trạng thái: Tăng trưởng mạnh mẽ.", handover: "Vòng lặp ngược (Loopback) về Step 10." },
        decision: "CONTINUE_LOOP",
        decisionDesc: "Đạt đà tăng trưởng cao (+2.57%). Tiếp tục lặp sang V2.",
        metrics: [
          { label: "Khoảng Cách Δ", val: "-4.05%", sub: "Thu hẹp khoảng cách", color: "rose" },
          { label: "Mức Tăng Gain", val: "+2.57%", sub: "Đà tăng trưởng cao", color: "emerald" },
          { label: "Phán Quyết", val: "LẶP TIẾP", sub: "Tiến vào V2", color: "amber" },
          { label: "Vs Random", val: "+1.85%", sub: "Vượt toàn diện", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07d_stopping_guard_delta_dynamics.png",
        imageCaption: "V1 Rào Chắn: Tốc độ tăng trưởng vượt trội khẳng định hiệu quả của C6"
      },
      v2: {
        roundBadge: "VÒNG LẶP 2 (V2)",
        input: { source: "Metrics V2: mAP 24.65%. Ngưỡng Target: 26.85%.", specs: "Khoảng cách Δ = -2.20%.", precondition: "Kiểm tra bão hòa." },
        handle: { algorithm: "Rào Chắn 1: Δ_target = -2.20% < 0. Rào Chắn 3: Plateau Saturation Check = KHÔNG BÃO HÒA.", parameters: "Tăng trưởng thêm +1.85%, vượt xa ngưỡng epsilon dừng 0.20%.", hardware: "Quyết định: `CONTINUE_LOOP` sang Vòng 3." },
        output: { artifact: "Log rào chắn `stopping_decision_v2.json`.", volume: "Trạng thái: Tiếp tục bứt phá.", handover: "Loopback về Step 10." },
        decision: "CONTINUE_LOOP",
        decisionDesc: "Chưa bão hòa (+1.85% > ε). Tiếp tục lặp sang V3.",
        metrics: [
          { label: "Khoảng Cách Δ", val: "-2.20%", sub: "Tiến sát mục tiêu", color: "rose" },
          { label: "Mức Tăng Gain", val: "+1.85%", sub: "Trên ngưỡng dừng", color: "emerald" },
          { label: "Phán Quyết", val: "LẶP TIẾP", sub: "Tiến vào V3", color: "amber" },
          { label: "Vs Random", val: "+3.05%", sub: "Nới rộng cách biệt", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07d_stopping_guard_delta_dynamics.png",
        imageCaption: "V2 Rào Chắn: Gain đạt +1.85%, vượt xa ngưỡng dừng sớm epsilon"
      },
      v3: {
        roundBadge: "VÒNG LẶP 3 (V3)",
        input: { source: "Metrics V3: mAP 26.15%. Ngưỡng Target: 26.85%.", specs: "Khoảng cách Δ = -0.70%.", precondition: "Kiểm tra tiệm cận." },
        handle: { algorithm: "Rào Chắn 1: Δ_target = -0.70% (chỉ còn thiếu 0.70% để vượt trần).", parameters: "Đà tăng trưởng vẫn đạt +1.50%. Chuẩn bị cho vòng bứt phá mục tiêu.", hardware: "Quyết định: `CONTINUE_LOOP` sang Vòng 4." },
        output: { artifact: "Log rào chắn `stopping_decision_v3.json`.", volume: "Trạng thái: Chuẩn bị chạm trần.", handover: "Loopback về Step 10." },
        decision: "CONTINUE_LOOP",
        decisionDesc: "Tiệm cận ngưỡng Target (-0.70%). Tiếp tục lặp sang V4.",
        metrics: [
          { label: "Khoảng Cách Δ", val: "-0.70%", sub: "Chỉ còn thiếu 0.7%", color: "amber" },
          { label: "Mức Tăng Gain", val: "+1.50%", sub: "Duy trì đà tăng", color: "emerald" },
          { label: "Phán Quyết", val: "LẶP TIẾP", sub: "Tiến vào V4", color: "amber" },
          { label: "Vs Random", val: "+4.05%", sub: "Bỏ xa Random", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07d_stopping_guard_delta_dynamics.png",
        imageCaption: "V3 Rào Chắn: Mô hình tiệm cận sát nút mức trần 26.85%"
      },
      v4: {
        roundBadge: "VÒNG LẶP 4 (V4 - TARGET TRIGGER)",
        input: { source: "Metrics V4: mAP 27.20%. Ngưỡng Target: 26.85%.", specs: "Khoảng cách Δ = +0.35% > 0.", precondition: "Kích hoạt giao thức xác nhận." },
        handle: { algorithm: "Rào Chắn 1: VƯỢT TRẦN TARGET (+0.35% > 0)! KÍCH HOẠT RÀO CHẮN XÁC NHẬN:", parameters: "Giao thức khoa học không cho phép dừng ngay khi vừa vượt qua trần lần đầu (tránh ăn may ngẫu nhiên). Kích hoạt `CONFIRMATION_ROUND_TRIGGERED`, yêu cầu chạy thêm vòng V5 để xác nhận vững chắc.", hardware: "Quyết định: `CONFIRMATION_ROUND_TRIGGERED`." },
        output: { artifact: "Biên bản kích hoạt `confirmation_round_triggered.json`.", volume: "Đã vượt trần! Tiến hành vòng xác nhận V5.", handover: "Chuyển tiếp sang Vòng 5." },
        decision: "CONFIRMATION_ROUND_TRIGGERED",
        decisionDesc: "VƯỢT TRẦN TARGET (+0.35%)! Kích hoạt vòng xác nhận V5 bắt buộc.",
        metrics: [
          { label: "Khoảng Cách Δ", val: "+0.35%", sub: "VƯỢT TRẦN MỤC TIÊU", color: "purple" },
          { label: "Rào Chắn 4", val: "KÍCH HOẠT", sub: "Confirmation Round", color: "purple" },
          { label: "Phán Quyết", val: "XÁC NHẬN", sub: "Tiến vào V5", color: "purple" },
          { label: "Tiết Kiệm Nhãn", val: "50.0%", sub: "Tạm tính tại V4", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07d_stopping_guard_delta_dynamics.png",
        imageCaption: "V4 Rào Chắn: Cờ CONFIRMATION_ROUND_TRIGGERED được kích hoạt sau khi vượt trần Target"
      },
      v5: {
        roundBadge: "VÒNG LẶP 5 (V5 - VICTORY CONFIRMED)",
        input: { source: "Metrics V5: mAP 27.85%. Ngưỡng Target: 26.85%.", specs: "Khoảng cách Δ = +1.00% > 0.", precondition: "Kiểm tra tính ổn định 2 chu kỳ liên tiếp." },
        handle: { algorithm: "RÀO CHẮN 5: XÁC NHẬN CHIẾN THẮNG TUYỆT ĐỐI (VICTORY_CONFIRMED)!", parameters: "1. Vượt trần 2 chu kỳ liên tiếp (V4: 27.20%, V5: 27.85% >= 26.85%).\n2. All-front victory: Vượt trội Random trên toàn bộ 6/6 metrics vĩ mô (+4.95% mAP50).\n3. Tối ưu hóa chi phí: Dừng sớm tại 60% dữ liệu, tiết kiệm đúng 40.1% ngân sách nhãn.\n4. Ra lệnh ngắt toàn bộ vòng lặp, mở cổng sang Step 16 để Deploy.", hardware: "Quyết định: `VICTORY_CONFIRMED`." },
        output: { artifact: "Bản án chung cuộc tối cao `master_tournament_verdict.md` niêm phong chính thức.", volume: "Chiến thắng tuyệt đối. Dừng pipeline ở 3.759 ảnh (60% pool).", handover: "Kích hoạt hiệu ứng chúc mừng và mở khóa Step 16 (Deploy INT8)." },
        decision: "VICTORY_CONFIRMED",
        decisionDesc: "CHIẾN THẮNG TUYỆT ĐỐI! mAP 27.85% (+1.00% Target). Tiết kiệm 40.1% nhãn!",
        metrics: [
          { label: "Trạng Thái", val: "VICTORY", sub: "Niêm phong tối cao", color: "emerald" },
          { label: "Vượt Đích", val: "+1.00%", sub: "Vs 100% Target", color: "emerald" },
          { label: "Cách Biệt Rnd", val: "+4.95%", sub: "Vs Random baseline", color: "purple" },
          { label: "Tiết Kiệm ROI", val: "40.1%", sub: "Ngân sách bảo lưu", color: "emerald" }
        ],
        image: "assets/autonomous_loop/figure_07d_stopping_guard_delta_dynamics.png",
        imageCaption: "V5 Rào Chắn: VICTORY_CONFIRMED được niêm phong chính thức, tự động ngắt huấn luyện"
      }
    }
  },

  16: {
    id: "step-16",
    tier: 3,
    phaseBadge: "PHASE 08",
    phaseCode: "PRODUCTION-DEPLOY",
    title: "Xuất Bản Động Cơ Lượng Tử Hóa INT8 & Niêm Phong Sản Phẩm",
    champion: "TensorRT / ONNX INT8 Post-Training Quantization (PTQ) + Niêm Phong SHA-256",
    auditStatus: "✓ PRODUCTION READY 120 FPS",
    input: {
      source: "Trọng số tối ưu `active_loop_v5_best.pt` đạt mAP 27.85% từ Step 14.",
      specs: "Mô hình YOLO11n kiến trúc PyTorch FP32.",
      precondition: "Cần nén lượng tử hóa để triển khai trên vi xử lý nhúng xe tự hành (Edge GPU)."
    },
    handle: {
      algorithm: "Lượng Tử Hóa Sau Huấn Luyện (PTQ) INT8 Với Hiệu Chuẩn TensorRT Entropy:",
      parameters: "Tập hiệu chuẩn (Calibration set): 100 ảnh đại diện từ 5 lát cắt khó | Kiểm toán suy giảm mAP: < 0.28% (Bảo toàn 99% độ chính xác).",
      hardware: "Tốc độ thực thi: 120 FPS trên NVIDIA Jetson Orin / RTX 4090 (Độ trễ suy luận chỉ 8.3ms/frame)."
    },
    output: {
      artifact: "Gói triển khai sản phẩm `yolo11n_bdd10k_int8.engine` và mã băm `model_checksum.sha256`.",
      volume: "Dung lượng model giảm 74% (từ 6.2 MB xuống 1.6 MB); tốc độ suy luận tăng gấp 3.2 lần.",
      handover: "Sẵn sàng bàn giao cho hệ thống xe tự hành thực tế. Toàn bộ chu trình Active Learning hoàn tất thắng lợi!"
    },
    metrics: [
      { label: "Tốc Độ Suy Luận", val: "120 FPS", sub: "8.3ms độ trễ", color: "emerald" },
      { label: "Độ Nén Model", val: "74%", sub: "6.2MB → 1.6MB INT8", color: "purple" },
      { label: "Mất Mát mAP", val: "<0.28%", sub: "Bảo toàn tri thức", color: "emerald" },
      { label: "Niêm Phong", val: "SHA-256", sub: "Production-ready", color: "sky" }
    ],
    image: "assets/autonomous_loop/figure_07b_per_class_radar_and_gain.png",
    imageCaption: "Mô hình INT8 hoàn tất sẵn sàng triển khai thực chiến với hiệu năng vượt trội"
  }
};
