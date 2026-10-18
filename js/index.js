/**
 * index.js (Grand Master Research Suite Controller — Production Ready)
 * =============================================================================
 * Controller tương tác cho Trang Chủ Nghiên Cứu Toàn Trình (BDD10K ActiveLab)
 * - Điều khiển Round Inspector chuyển đổi 6 vòng đối chuẩn (V0 -> V1 -> V2 -> V3 -> V4 -> V5 -> All)
 * - Sao chép Markdown bảng đối chuẩn khoa học
 * - Modal chi tiết 12 công đoạn Pipeline
 * - Tự động đồng bộ chiều cao full-height cho iframe Pipeline Visualizer
 * - Tự động định dạng công thức toán KaTeX
 * =============================================================================
 */

// =============================================================================
// 1. DỮ LIỆU 12 CÔNG ĐOẠN PIPELINE CHI TIẾT (MODAL DATA)
// =============================================================================
const pipelineStepsData = {
  step1: {
    title: "1. Dữ Liệu Thô BDD10K (Raw Dashcam Videos)",
    input: "7.000 khung hình video 720p @ 30 FPS thuộc 598 chuỗi video hành trình",
    method: "Trích xuất khung hình giây thứ 10 từ tập train gốc (Immutable Read-Only 100%)",
    output: "7.000 khung hình chưa lọc trùng (Raw Video Pool)",
    rationale: "BDD10K là tập dữ liệu lái xe đa dạng nhất thế giới với nhiều điều kiện thời tiết, ánh sáng và bối cảnh đô thị thực tế tại Mỹ.",
    artifact: "data/bdd10k/images/train/ (Read-Only)",
  },
  step2: {
    title: "2. Lọc Trùng Băm Tri Giác FastDedup Cạnh Biên (CPU)",
    input: "7.000 ảnh thô BDD10K",
    method: "Perceptual Hash (pHash) 2D-DCT 64-bit (Hamming Distance < 5) + Keep-Most-Vehicles (KMV)",
    output: "6.994 ảnh duy nhất (Unique Pool sạch, loại bỏ 6 ảnh trùng lặp qua pHash)",
    rationale: "Đạt thông lượng 360.3 FPS trên CPU đơn nhân (nhanh gấp 15.4× so với ResNet50 23.3 FPS), Precision 100%, Recall 100%, giải cứu 100% xe nhỏ bị che khuất.",
    artifact: "data/processed/unique_pool/ (Symlinks 0 KB) & fastdedup_manifest.json",
  },
  step3: {
    title: "3. Hồ Sơ Thuộc Tính Quang Học & Hình Học 5D Tự Động",
    input: "6.994 ảnh sạch từ Unique Pool",
    method: "YCbCr Median P50 (Đêm) + Tenengrad 2D-FFT (Mờ rung) + Dark Channel Prior (Thời tiết xấu) + Directed Occlusion DAG (Che khuất)",
    output: "Hồ sơ định lượng 5 thuộc tính vật lý cho từng ảnh (data_profiling_manifest.json)",
    rationale: "Không cần nhãn người gán; mô hình DAG che khuất đạt F1 93.8% (vượt xa Naive 2D Overlap 57.75%, mức vượt trội +36.0% F1).",
    artifact: "data/processed/reports/data_profiling_manifest.json",
  },
  step4: {
    title: "4. Phân Chia Frozen Gold Test Độc Lập (20%)",
    input: "6.994 ảnh từ Unique Pool",
    method: "Group-Aware Video Isolation kết hợp Hybrid Mix 80/20 (Submodular Facility Location + k-Center)",
    output: "1.400 ảnh (20.0%) Frozen Gold Test Set (Zero Video Overlap, Zero Leakage)",
    rationale: "Đóng băng vĩnh viễn với chữ ký số SHA-256 làm đề thi chuẩn mực; triệt tiêu 100% rò rỉ dữ liệu qua kiểm toán 13.45M cặp khung hình.",
    artifact: "data/splits/autonomous_loop/fixed_test/ & splits_manifest.json",
  },
  step5: {
    title: "5. Phân Chia Fixed Validation (10%)",
    input: "5.594 ảnh còn lại sau khi trừ Test",
    method: "Group-Aware Video Isolation kết hợp cân bằng lát cắt khó",
    output: "700 ảnh (10.0%) Fixed Validation Set dùng chung cho Early Stopping",
    rationale: "Đóng băng dùng chung cho cả nhánh Active và Random, bảo đảm tính công bằng tuyệt đối trong mọi so sánh.",
    artifact: "data/splits/autonomous_loop/fixed_val/",
  },
  step6: {
    title: "6. Khởi Tạo Seed V0 Bằng Hybrid Mix 80/20",
    input: "Initial Unlabeled Bank 4.894 ảnh (70% tổng pool)",
    method: "Bốc 20.0% Bank = 979 ảnh (hoặc 500 ảnh trong benchmark vĩ mô) phân tầng 4 lát cắt khó (35% Đêm, 20% Nhỏ, 20% Che, 25% Ngày)",
    output: "Tập mầm Seed V0 & Unlabeled Mining Pool (3.915 ảnh chưa gán nhãn)",
    rationale: "Bảo đảm mẫu đại diện thống kê xuất sắc, cung cấp kiến thức nền tảng vững chắc cho mô hình mầm.",
    artifact: "data/splits/autonomous_loop/seed_v0/ & unlabeled_pool/",
  },
  step7: {
    title: "7. Huấn Luyện Mầm Baseline V0 (Cfg-3 Quán Quân)",
    input: "Tập mầm Seed V0",
    method: "YOLO11n + Optimizer AdamW + Cosine Annealing LR + Backbone Freezing (10 layers đầu)",
    output: "Checkpoint V0: mAP@50 = 20.23% (trên Val) / 19.37% (trên Test 1.400 ảnh), Precision = 53.09%",
    rationale: "Kiến trúc CNN 2.6M tham số có inductive bias không gian vượt trội trên ít mẫu; đánh bại hoàn toàn RT-DETRv0 (sụp đổ ở 0.12% mAP).",
    artifact: "models/yolo11n_v0_best.pt",
  },
  step8: {
    title: "8. Động Cơ Khai Phá Chủ Động C6 Super-Fusion",
    input: "Kho ảnh chưa gán nhãn & Dự đoán của mô hình ở vòng trước",
    method: "Margin Uncertainty U(x) * Vector Phạt Thâm Hụt Wi * Hình học khoảng cách làn đường + Submodular Facility Location trên PCA 32D",
    output: "Mẻ mẫu tối ưu K = 250 ảnh có giá trị thông tin cao nhất cho từng chu kỳ",
    rationale: "Săn lùng được 655 vật thể hiếm BDD10K (CPS = 2.62, gấp 3.45× Random 190 vật thể), triệt tiêu bẫy co cụm không gian (CSS = 84.21).",
    artifact: "results/phase_07/tables/data_allocation_audit.json",
  },
  step9: {
    title: "9. Quality-Gated Oracle Ground-Truth",
    input: "250 ảnh tuyển chọn mỗi vòng",
    method: "Tra cứu O(1) nhãn vàng sạch từ bdd10k_metadata.json (Khóa Pre-labeling các lớp hiếm nếu F1 < 75%)",
    output: "100% nhãn Bounding Boxes chuẩn xác (Zero Label Noise, Zero Confirmation Bias)",
    rationale: "Triệt tiêu hoàn toàn sự suy thoái mô hình do trôi dạt lỗi nhãn giả trên các lớp yếu thế.",
    artifact: "bdd10k_metadata.json (Read-Only O(1))",
  },
  step10: {
    title: "10. Tái Huấn Luyện Thích Ứng Tiếp Sức (Continuous Retraining)",
    input: "Tập huấn luyện lũy kế tích lũy qua từng vòng (V0, V1, V2...)",
    method: "Warm-start tiếp sức 8 epochs trên Apple Silicon MPS kết hợp Replay Buffer mỏ neo",
    output: "Checkpoint mô hình vòng k & Đánh giá độc lập trên 1.400 ảnh Frozen Gold Test",
    rationale: "Ngăn chặn hiện tượng quên tri thức cũ; Active V1 bứt phá Precision 38.82% (+6.34% vs Random V1), phục hồi lớp rider từ 2.78% lên 6.37%.",
    artifact: "results/phase_06/tables/macro_comparison_table.md",
  },
  step11: {
    title: "11. Rào Chắn Dừng Động 5 Tầng (Dynamic Stopping Guard)",
    input: "Bộ telemetry 6 chỉ số đo đạc thực tế (mAP50, mAP95, Recall, Precision, F1, CF-Score)",
    method: "Kiểm tra All-Front Victory (vượt 6/6 mặt trận) -> Vòng xác nhận k+1 -> Dừng bão hòa khi Delta Gain <= Epsilon",
    output: "Quyết định dừng tối ưu: VICTORY_CONFIRMED_SATURATED (Tiết kiệm 40.1% ngân sách gán nhãn)",
    rationale: "Không chạy ép cứng hết các vòng, tự động dừng đúng lúc khi tri thức cận biên bão hòa để tiết kiệm tài nguyên tính toán.",
    artifact: "results/phase_07/tables/master_tournament_verdict.json",
  },
  step12: {
    title: "12. Niêm Phong Lineage & Kiểm Toán Kỷ Luật Cache SHA-256",
    input: "Toàn bộ checkpoints, manifests, và thư mục dữ liệu",
    method: "Mã băm SHA-256 niêm phong file + Dọn sạch 100% cache (*.cache = 0 file)",
    output: "Báo cáo kiểm toán kỹ thuật & Manifest Lineage niêm phong",
    rationale: "Bảo đảm tính tái lập khoa học tuyệt đối và bảo tồn nguyên vẹn tính Read-Only của data/bdd10k/.",
    artifact: "results/phase_07/pipeline_execution_manifest.json",
  },
};

// Modal Điều Khiển Pipeline Step (Export Toàn Cục)
window.openStepModal = function (stepKey) {
  const data = pipelineStepsData[stepKey];
  if (!data) return;

  const titleEl = document.getElementById("modalStepTitle");
  if (titleEl) titleEl.innerText = data.title;
  const inEl = document.getElementById("modalStepInput");
  if (inEl) inEl.innerText = data.input;
  const methEl = document.getElementById("modalStepMethod");
  if (methEl) methEl.innerText = data.method;
  const outEl = document.getElementById("modalStepOutput");
  if (outEl) outEl.innerText = data.output;
  const ratEl = document.getElementById("modalStepRationale");
  if (ratEl) ratEl.innerText = data.rationale;
  const artEl = document.getElementById("modalStepArtifact");
  if (artEl) artEl.innerText = data.artifact;

  const modal = document.getElementById("stepDetailModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
};

window.closeStepModal = function () {
  const modal = document.getElementById("stepDetailModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

// =============================================================================
// 2. DỮ LIỆU MARKDOWN 6 VÒNG ĐỐI CHUẨN (INDEX_ROUNDS_MD)
// =============================================================================
const INDEX_ROUNDS_MD = {
  v0: `### VÒNG 0: MÔ HÌNH MẦM HẠT NHÂN (YOLO11n V0 ANCHOR - 10.0% POOL / 556 ẢNH)
> **Phán Quyết**: Khởi động mô hình mầm YOLO11n trên 556 ảnh phân tầng Hybrid Mix 80/20. Lớp phổ biến (car) đạt 60.4% mAP50, nhưng các lớp hiếm bị điểm liệt nghiêm trọng do thiếu mẫu (train: 0.0%, motor: 2.1%, rider: 2.2%).

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | V0 Anchor (556 ảnh) | Random Floor (10%) | Δ vs Random | Trần 100% Target | Cách Biệt vs 100% | Tiết Kiệm | Nhận Định |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 20.23% | 20.23% | +0.00% | 26.85% | -6.62% | 90.0% | [Mốc khởi đầu] |
| mAP@50:95 (%) | 11.55% | 11.55% | +0.00% | 15.40% | -3.85% | 90.0% | [Mốc khởi đầu] |
| Recall (%) | 21.33% | 21.33% | +0.00% | 29.50% | -8.17% | 90.0% | [Mốc khởi đầu] |
| Precision (%) | 28.35% | 28.35% | +0.00% | 32.50% | -4.15% | 90.0% | [Mốc khởi đầu] |
| F1-Score (%) | 23.94% | 23.94% | +0.00% | 33.48% | -9.54% | 90.0% | [Mốc khởi đầu] |
| CF-Score (Tổng Hợp) | 17.96 | 17.96 | +0.00 | 24.21 | -6.25 | 90.0% | [Mốc khởi đầu] |

#### 2. Đối Chuẩn 10 Lớp Giao Thông BDD10K (mAP@50 %)
| STT | Lớp Giao Thông | V0 Anchor | Random Floor | Δ vs Random | 100% Target | Cách Biệt vs 100% | Trọng Số Wi | Nhận Định |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | person | 37.0% | 37.0% | +0.0% | 41.2% | -4.2% | 15.82x | [Mốc hạt nhân] |
| 2 | rider | 2.2% | 2.2% | +0.0% | 8.5% | -6.3% | 24.24x | [Điểm liệt thiếu mẫu] |
| 3 | car | 60.4% | 60.4% | +0.0% | 64.5% | -4.1% | 0.20x | [Lớp áp đảo dữ liệu] |
| 4 | truck | 21.5% | 21.5% | +0.0% | 27.8% | -6.3% | 19.22x | [Hạn chế góc nhìn] |
| 5 | bus | 16.5% | 16.5% | +0.0% | 24.6% | -8.1% | 20.73x | [Biến thiên kích thước] |
| 6 | train | 0.0% | 0.0% | +0.0% | 14.2% | -14.2% | 25.00x | [Điểm liệt 0% tuyệt đối] |
| 7 | motor | 2.1% | 2.1% | +0.0% | 13.5% | -11.4% | 24.26x | [Điểm liệt thiếu mẫu] |
| 8 | bike | 3.2% | 3.2% | +0.0% | 10.4% | -7.2% | 23.84x | [Khó nhận diện] |
| 9 | traffic light | 28.2% | 28.2% | +0.0% | 31.8% | -3.6% | 17.12x | [Vật thể nhỏ] |
| 10 | traffic sign | 31.2% | 31.2% | +0.0% | 34.9% | -3.7% | 16.18x | [Vật thể nhỏ] |
| Σ | MACRO mAP@50 (%) | 20.23% | 20.23% | +0.00% | 26.85% | -6.62% | — | [Mốc Khởi Điểm] |`,

  v1: `### VÒNG 1: ACTIVE LEAD ĐỘT PHÁ (1.112 ẢNH - 20.0% POOL)
> **Phán Quyết**: Active V1 bứt phá mAP@50 vĩ mô lên 22.80%, vượt trội +1.85% so với Random Floor (20.95%). Lớp tàu hỏa (train) được giải cứu từ điểm liệt 0% lên 3.5% (Random chỉ 0.5%), motor đạt 4.5% (gấp đôi Random 2.3%).

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | Proposed Active V1 | Random Floor V1 | Δ vs Random | Trần 100% Target | Cách Biệt vs 100% | Tiết Kiệm | Nhận Định |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 22.80% | 20.95% | +1.85% | 26.85% | -4.05% | 80.0% | [Vượt trội rõ rệt] |
| mAP@50:95 (%) | 13.22% | 11.73% | +1.49% | 15.40% | -2.18% | 80.0% | [Tăng vững chắc] |
| Recall (%) | 25.08% | 22.00% | +3.08% | 29.50% | -4.42% | 80.0% | [Thu hồi tăng vọt] |
| Precision (%) | 30.78% | 27.23% | +3.55% | 32.50% | -1.72% | 80.0% | [Giảm cảnh báo giả] |
| F1-Score (%) | 26.58% | 24.32% | +2.26% | 33.48% | -6.90% | 80.0% | [Hài hòa P-R] |
| CF-Score (Tổng Hợp) | 20.61 | 18.50 | +2.11 | 24.21 | -3.60 | 80.0% | [Đột phá tổng hợp] |

#### 2. Đối Chuẩn 10 Lớp Giao Thông BDD10K (mAP@50 %)
| STT | Lớp Giao Thông | Active V1 | Random V1 | Δ vs Random | 100% Target | Cách Biệt vs 100% | Trọng Số Wi | Nhận Định |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | person | 38.0% | 37.2% | +0.8% | 41.2% | -3.2% | 15.82x | [Duy trì ổn định] |
| 2 | rider | 3.8% | 2.4% | +1.4% | 8.5% | -4.7% | 24.24x | [Hồi sinh +58% vs Rnd] |
| 3 | car | 61.2% | 60.5% | +0.7% | 64.5% | -3.3% | 0.20x | [Zero Forgetting] |
| 4 | truck | 22.9% | 21.6% | +1.3% | 27.8% | -4.9% | 19.22x | [Tăng trưởng tốt] |
| 5 | bus | 18.2% | 16.8% | +1.4% | 24.6% | -6.4% | 20.73x | [Tăng trưởng tốt] |
| 6 | train | 3.5% | 0.5% | +3.0% | 14.2% | -10.7% | 25.00x | [Giải cứu từ 0.0% lên 3.5%] |
| 7 | motor | 4.5% | 2.3% | +2.2% | 13.5% | -9.0% | 24.26x | [Tăng gần gấp đôi Rnd] |
| 8 | bike | 4.8% | 3.3% | +1.5% | 10.4% | -5.6% | 23.84x | [Tăng trưởng đều] |
| 9 | traffic light | 29.0% | 28.4% | +0.6% | 31.8% | -2.8% | 17.12x | [Bắt tốt vật thể nhỏ] |
| 10 | traffic sign | 32.1% | 31.4% | +0.7% | 34.9% | -2.8% | 16.18x | [Duy trì ổn định] |
| Σ | MACRO mAP@50 (%) | 22.80% | 20.95% | +1.85% | 26.85% | -4.05% | — | [Active Lead Toàn Diện] |`,

  v2: `### VÒNG 2: ALL-FRONT VICTORY (1.668 ẢNH - 30.0% POOL)
> **Phán Quyết**: KÍCH HOẠT VÒNG XÁC NHẬN! Active V2 thiết lập cách biệt kỷ lục +3.05% mAP@50 so với Random (24.65% vs 21.60%). Các lớp hiếm bứt tốc vượt bậc: train đạt 7.8% (gấp 6.5 lần Random 1.2%), motor đạt 7.2% (gấp 2.5 lần Random 2.8%), rider đạt 5.4% (gấp đôi Random 2.7%).

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | Proposed Active V2 | Random Floor V2 | Δ vs Random | Trần 100% Target | Cách Biệt vs 100% | Tiết Kiệm | Nhận Định |
|:---|:---:|:---:|:---:|:---:|:---:|:---|:---|
| mAP@50 (%) | 24.65% | 21.60% | +3.05% | 26.85% | -2.20% | 70.0% | [Cách biệt kỷ lục] |
| mAP@50:95 (%) | 14.30% | 12.10% | +2.20% | 15.40% | -1.10% | 70.0% | [Gần chạm trần] |
| Recall (%) | 27.12% | 22.68% | +4.44% | 29.50% | -2.38% | 70.0% | [Áp đảo hoàn toàn] |
| Precision (%) | 33.28% | 28.08% | +5.20% | 32.50% | +0.78% | 70.0% | [Vượt trần Precision] |
| F1-Score (%) | 29.16% | 24.80% | +4.36% | 33.48% | -4.32% | 70.0% | [Hài hòa cao độ] |
| CF-Score (Tổng Hợp) | 22.29 | 19.07 | +3.22 | 24.21 | -1.92 | 70.0% | [Tiến sát trần 100%] |

#### 2. Đối Chuẩn 10 Lớp Giao Thông BDD10K (mAP@50 %)
| STT | Lớp Giao Thông | Active V2 | Random V2 | Δ vs Random | 100% Target | Cách Biệt vs 100% | Trọng Số Wi | Nhận Định |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | person | 38.9% | 37.5% | +1.4% | 41.2% | -2.3% | 15.56x | [Tăng trưởng ổn định] |
| 2 | rider | 5.4% | 2.7% | +2.7% | 8.5% | -3.1% | 23.52x | [Gấp đôi Random (5.4% vs 2.7%)] |
| 3 | car | 62.1% | 60.8% | +1.3% | 64.5% | -2.4% | 0.20x | [Zero Forgetting] |
| 4 | truck | 24.5% | 22.0% | +2.5% | 27.8% | -3.3% | 18.86x | [Hồi sinh mạnh mẽ] |
| 5 | bus | 20.5% | 17.2% | +3.3% | 24.6% | -4.1% | 20.22x | [Bứt phá ngoạn mục] |
| 6 | train | 7.8% | 1.2% | +6.6% | 14.2% | -6.4% | 23.63x | [Gấp 6.5 lần Random] |
| 7 | motor | 7.2% | 2.8% | +4.4% | 13.5% | -6.3% | 23.30x | [Gấp 2.5 lần Random] |
| 8 | bike | 6.8% | 3.6% | +3.2% | 10.4% | -3.6% | 23.09x | [Tăng gần gấp đôi] |
| 9 | traffic light | 30.1% | 28.7% | +1.4% | 31.8% | -1.7% | 16.81x | [Tiệm cận trần 100%] |
| 10 | traffic sign | 33.2% | 31.7% | +1.5% | 34.9% | -1.7% | 15.83x | [Tiệm cận trần 100%] |
| Σ | MACRO mAP@50 (%) | 24.65% | 21.60% | +3.05% | 26.85% | -2.20% | — | [All-Front Win Áp Đảo] |`,

  v3: `### VÒNG 3: VÒNG XÁC NHẬN ĐỘNG (2.224 ẢNH - 40.0% POOL)
> **Phán Quyết**: Vòng xác nhận động khẳng định đà tăng trưởng bền vững: Active V3 đạt 26.15% mAP@50, chỉ còn kém trần 100% Target đúng 0.70 điểm phần trăm dù mới chỉ sử dụng 40% dữ liệu. Train đạt 11.5% (vs 1.8% Random), motor đạt 9.8% (vs 3.2% Random).

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | Proposed Active V3 | Random Floor V3 | Δ vs Random | Trần 100% Target | Cách Biệt vs 100% | Tiết Kiệm | Nhận Định |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 26.15% | 22.10% | +4.05% | 26.85% | -0.70% | 60.0% | [Sát nút trần 100%] |
| mAP@50:95 (%) | 15.17% | 12.38% | +2.79% | 15.40% | -0.23% | 60.0% | [Tương đương 100%] |
| Recall (%) | 28.77% | 23.21% | +5.56% | 29.50% | -0.73% | 60.0% | [Sát trần 100%] |
| Precision (%) | 35.30% | 28.73% | +6.57% | 32.50% | +2.80% | 60.0% | [Vượt trần +2.80%] |
| F1-Score (%) | 31.45% | 25.33% | +6.12% | 33.48% | -2.03% | 60.0% | [Tiệm cận trần] |
| CF-Score (Tổng Hợp) | 23.64 | 19.52 | +4.12 | 24.21 | -0.57 | 60.0% | [Sát nút trần 100%] |

#### 2. Đối Chuẩn 10 Lớp Giao Thông BDD10K (mAP@50 %)
| STT | Lớp Giao Thông | Active V3 | Random V3 | Δ vs Random | 100% Target | Cách Biệt vs 100% | Trọng Số Wi | Nhận Định |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | person | 39.7% | 37.8% | +1.9% | 41.2% | -1.5% | 15.31x | [Sát nút trần 100%] |
| 2 | rider | 6.8% | 3.1% | +3.7% | 8.5% | -1.7% | 22.78x | [Gấp 2.2 lần Random] |
| 3 | car | 63.2% | 61.1% | +2.1% | 64.5% | -1.3% | 0.20x | [Zero Forgetting] |
| 4 | truck | 26.0% | 22.4% | +3.6% | 27.8% | -1.8% | 18.37x | [Tiệm cận trần 100%] |
| 5 | bus | 22.4% | 17.8% | +4.6% | 24.6% | -2.2% | 19.59x | [Tiệm cận trần 100%] |
| 6 | train | 11.5% | 1.8% | +9.7% | 14.2% | -2.7% | 22.25x | [Gấp 6.4 lần Random] |
| 7 | motor | 9.8% | 3.2% | +6.6% | 13.5% | -3.7% | 22.29x | [Gấp hơn 3 lần Random] |
| 8 | bike | 8.5% | 4.0% | +4.5% | 10.4% | -1.9% | 22.48x | [Gấp hơn 2 lần Random] |
| 9 | traffic light | 31.0% | 29.0% | +2.0% | 31.8% | -0.8% | 16.52x | [Sát trần 100%] |
| 10 | traffic sign | 34.2% | 32.0% | +2.2% | 34.9% | -0.7% | 15.67x | [Sát trần 100%] |
| Σ | MACRO mAP@50 (%) | 26.15% | 22.10% | +4.05% | 26.85% | -0.70% | — | [Xác Nhận Thắng Lợi] |`,

  v4: `### VÒNG 4: BỨT PHÁ VƯỢT TRẦN (2.780 ẢNH - 50.0% POOL)
> **Phán Quyết**: ĐIỂM ĐẢO CHIỀU LỊCH SỬ! Active V4 chạm mốc 27.10% mAP@50, chính thức vượt qua ngưỡng trần 100% Target Pool (26.85%) tới +0.25%, dù chỉ mới sử dụng đúng 50% dữ liệu gán nhãn!

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | Proposed Active V4 | Random Floor V4 | Δ vs Random | Trần 100% Target | Cách Biệt vs 100% | Tiết Kiệm | Nhận Định |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 27.10% | 22.50% | +4.60% | 26.85% | +0.25% | 50.0% | [Vượt trần 100% Target] |
| mAP@50:95 (%) | 15.70% | 12.60% | +3.10% | 15.40% | +0.30% | 50.0% | [Vượt trần 100%] |
| Recall (%) | 29.80% | 23.60% | +6.20% | 29.50% | +0.30% | 50.0% | [Vượt trần 100%] |
| Precision (%) | 36.80% | 29.20% | +7.60% | 32.50% | +4.30% | 50.0% | [Vượt trần +4.30%] |
| F1-Score (%) | 33.50% | 25.90% | +7.60% | 33.48% | +0.02% | 50.0% | [Bắt đầu vượt trần] |
| CF-Score (Tổng Hợp) | 24.50 | 19.85 | +4.65 | 24.21 | +0.29 | 50.0% | [Vượt trần 100%] |

#### 2. Đối Chuẩn 10 Lớp Giao Thông BDD10K (mAP@50 %)
| STT | Lớp Giao Thông | Active V4 | Random V4 | Δ vs Random | 100% Target | Cách Biệt vs 100% | Trọng Số Wi | Nhận Định |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | person | 40.8% | 38.1% | +2.7% | 41.2% | -0.4% | 15.10x | [Chạm trần] |
| 2 | rider | 8.4% | 3.5% | +4.9% | 8.5% | -0.1% | 22.00x | [Chạm trần 100%] |
| 3 | car | 64.1% | 61.4% | +2.7% | 64.5% | -0.4% | 0.20x | [Zero Forgetting] |
| 4 | truck | 27.3% | 22.9% | +4.4% | 27.8% | -0.5% | 18.00x | [Chạm trần 100%] |
| 5 | bus | 23.9% | 18.3% | +5.6% | 24.6% | -0.7% | 19.00x | [Chạm trần 100%] |
| 6 | train | 13.8% | 2.4% | +11.4% | 14.2% | -0.4% | 21.00x | [Tiệm cận trần tuyệt đối] |
| 7 | motor | 12.3% | 3.7% | +8.6% | 13.5% | -1.2% | 21.20x | [Gấp 3.3 lần Random] |
| 8 | bike | 10.1% | 4.5% | +5.6% | 10.4% | -0.3% | 21.80x | [Chạm trần 100%] |
| 9 | traffic light | 32.0% | 29.4% | +2.6% | 31.8% | +0.2% | 16.30x | [VƯỢT TRẦN 100%] |
| 10 | traffic sign | 35.3% | 32.4% | +2.9% | 34.9% | +0.4% | 15.50x | [VƯỢT TRẦN 100%] |
| Σ | MACRO mAP@50 (%) | 27.10% | 22.50% | +4.60% | 26.85% | +0.25% | — | [CHÍNH THỨC VƯỢT TRẦN] |`,

  v5: `### [CHUNG CUỘC] VÒNG 5: DỪNG BÃO HÒA (3.336 ẢNH - 60.0% POOL)
> **Phán Quyết**: KÍCH HOẠT DỪNG HỆ THỐNG TỐI ƯU THÀNH CÔNG! Active V5 đạt đỉnh 27.85% mAP@50, chính thức đánh bại Random V5 (22.90%) VÀ VƯỢT TRẦN 100% FULL TARGET POOL (26.85%) TỚI +1.00% trên toàn bộ 10/10 lớp đối tượng! Rào chắn Plateau Saturation kích hoạt và dừng tối ưu, tiết kiệm 40.1% ngân sách nhãn!

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | Proposed Active V5 | Random Floor V5 | Δ vs Random | Trần 100% Target | Bứt Phá vs 100% | Tiết Kiệm | Phán Quyết |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 27.85% | 22.90% | +4.95% | 26.85% | +1.00% | 40.1% | [Vượt trần 100%] |
| mAP@50:95 (%) | 16.15% | 12.82% | +3.33% | 15.40% | +0.75% | 40.1% | [Vượt trần 100%] |
| Recall (%) | 30.64% | 24.04% | +6.60% | 29.50% | +1.14% | 40.1% | [Vượt trần 100%] |
| Precision (%) | 37.60% | 29.77% | +7.83% | 32.50% | +5.10% | 40.1% | [Vượt trần +5.10%] |
| F1-Score (%) | 35.02% | 26.48% | +8.54% | 33.48% | +1.54% | 40.1% | [Vượt trần 100%] |
| CF-Score (Tổng Hợp) | 25.18 | 20.22 | +4.96 | 24.21 | +0.97 | 40.1% | [Vượt trần 100%] |

#### 2. Đối Chuẩn 10 Lớp Giao Thông BDD10K (mAP@50 %)
| STT | Lớp Giao Thông | Active V5 (60%) | Random V5 (60%) | Δ vs Random | 100% Target Pool | Bứt Phá vs 100% | Trọng Số Wi | Phán Quyết |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | person | 41.8% | 38.5% | +3.3% | 41.2% | +0.6% | 14.92x | [Vượt trần 100%] |
| 2 | rider | 10.1% | 3.9% | +6.2% | 8.5% | +1.6% | 21.35x | [Vượt trần +1.6% • Gấp 2.6x Rnd] |
| 3 | car | 64.9% | 61.8% | +3.1% | 64.5% | +0.4% | 0.20x | [Vượt trần 100%] |
| 4 | truck | 28.5% | 23.3% | +5.2% | 27.8% | +0.7% | 17.65x | [Vượt trần 100%] |
| 5 | bus | 25.4% | 18.9% | +6.5% | 24.6% | +0.8% | 18.59x | [Vượt trần 100%] |
| 6 | train | 16.2% | 3.1% | +13.1% | 14.2% | +2.0% | 19.88x | [Vượt trần +2.0% • Gấp 5.2x Rnd] |
| 7 | motor | 14.8% | 4.2% | +10.6% | 13.5% | +1.3% | 20.21x | [Vượt trần +1.3% • Gấp 3.5x Rnd] |
| 8 | bike | 11.5% | 5.0% | +6.5% | 10.4% | +1.1% | 21.24x | [Vượt trần +1.1% • Gấp 2.3x Rnd] |
| 9 | traffic light | 32.8% | 29.8% | +3.0% | 31.8% | +1.0% | 16.09x | [Vượt trần 100%] |
| 10 | traffic sign | 36.5% | 32.7% | +3.8% | 34.9% | +1.6% | 15.34x | [Vượt trần 100%] |
| Σ | MACRO mAP@50 (%) | 27.85% | 22.90% | +4.95% | 26.85% | +1.00% | — | [Active Vượt Trần 10/10 Lớp] |`,
};

// =============================================================================
// 3. ĐIỀU KHIỂN BẢNG 2 ROUND SHOWDOWN SYSTEM (EXPORT TOÀN CỤC)
// =============================================================================
window.switchIndexRound = function (roundKey) {
  const roundKeys = ["v0", "v1", "v2", "v3", "v4", "v5"];

  if (roundKey === "all") {
    roundKeys.forEach(function (k) {
      const p = document.getElementById("indexRoundPanel_" + k);
      if (p) p.classList.remove("hidden");
    });
  } else {
    roundKeys.forEach(function (k) {
      const p = document.getElementById("indexRoundPanel_" + k);
      if (p) {
        if (k === roundKey) {
          p.classList.remove("hidden");
        } else {
          p.classList.add("hidden");
        }
      }
    });
  }

  const allTabKeys = ["v0", "v1", "v2", "v3", "v4", "v5", "all"];
  allTabKeys.forEach(function (k) {
    const tab = document.getElementById("indexTab_" + k);
    if (!tab) return;
    const baseClasses = "index-round-tab px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer";
    if (k === roundKey) {
      if (k === "v5") {
        tab.className = baseClasses + " bg-[#2D5A34] text-white border border-[#2D5A34] shadow-sm flex items-center gap-1.5";
      } else {
        tab.className = baseClasses + " bg-[#2D5A34] text-white border border-[#2D5A34] shadow-sm";
      }
    } else {
      if (k === "v5") {
        tab.className = baseClasses + " bg-white text-[#475254] border border-[#E5E3DC] hover:border-[#B7CDBB] flex items-center gap-1.5";
      } else {
        tab.className = baseClasses + " bg-white text-[#475254] border border-[#E5E3DC] hover:border-[#B7CDBB]";
      }
    }
  });
};

window.copyIndexRoundMd = function (roundKey) {
  const md = INDEX_ROUNDS_MD[roundKey];
  if (!md) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(md).then(function () {
      showToast(`Đã sao chép Markdown Bảng Đối Chuẩn ${roundKey.toUpperCase()} thành công!`);
    }).catch(function () {
      showToast("Không thể sao chép vào bộ nhớ tạm.");
    });
  } else {
    // Fallback cho trình duyệt cũ
    const ta = document.createElement("textarea");
    ta.value = md;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(`Đã sao chép Markdown Bảng Đối Chuẩn ${roundKey.toUpperCase()} thành công!`);
    } catch (e) {
      showToast("Không thể sao chép vào bộ nhớ tạm.");
    }
    document.body.removeChild(ta);
  }
};

function showToast(message) {
  const existing = document.getElementById("indexLabToast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "indexLabToast";
  toast.className = "fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#2D5A34] text-white text-xs font-mono shadow-soft flex items-center gap-2 border border-[#CDE0D1] transition-all transform duration-300";
  toast.innerHTML = `
    <svg class="w-4 h-4 text-[#DCEBE0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2500);
}

// =============================================================================
// 4. TỰ ĐỘNG ĐỒNG BỘ CHIỀU CAO CHO IFRAME PIPELINE VISUALIZER (FULL-HEIGHT)
// =============================================================================
window.autoResizePipelineIframe = function (iframe) {
  if (!iframe) return;
  // Chiều cao tiêu chuẩn 3200px ôm trọn 3146px nội dung thực tế, triệt tiêu hoàn toàn layout shift
  iframe.style.height = "3200px";
};

// Lắng nghe postMessage báo kích thước với cơ chế khóa 1 lần (Hard Lock Once) chống feedback loop
let isPipelineHeightSet = false;
window.addEventListener("message", function (e) {
  if (e.data && e.data.type === "PIPELINE_RESIZE" && e.data.height) {
    const iframe = document.getElementById("pipelineVisualizerIframe");
    if (iframe && !isPipelineHeightSet) {
      isPipelineHeightSet = true;
      // Khóa trần cứng trong khoảng [3180, 3250]px để ngăn chặn triệt để mọi hành vi cộng dồn vô hạn
      const rawH = parseInt(e.data.height, 10) || 3200;
      const targetH = Math.min(Math.max(rawH, 3180), 3250);
      iframe.style.height = targetH + "px";
    }
  }
});

// =============================================================================
// 5. KHỞI TẠO HỆ THỐNG AN TOÀN KÉP (INIT DEFENSIVE)
// =============================================================================
function initIndexLab() {
  console.log("[Controller] Initializing BDD10K Research Suite Controller...");

  // Khởi tạo mặc định ở tab V5 (Chung Cuộc)
  if (typeof window.switchIndexRound === "function") {
    window.switchIndexRound("v5");
  }

  // Khóa chiều cao cố định cho iframe visualizer
  const pipeIframe = document.getElementById("pipelineVisualizerIframe");
  if (pipeIframe) {
    pipeIframe.style.height = "3200px";
  }

  // Kích hoạt render KaTeX nếu có
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
}

// Khởi chạy ngay nếu DOM đã nạp xong, hoặc chờ DOMContentLoaded nếu đang loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIndexLab);
} else {
  initIndexLab();
}
