/**
 * autonomous-loop-point7.js
 * =============================================================================
 * Controller tương tác cho Trang 07: End-to-End Autonomous Active Loop Console
 * - Đồng bộ hóa Video Split View & Live Telemetry Console (4 chặng)
 * - Điều khiển Round Inspector chuyển đổi 5 vòng thực nghiệm (V0 -> V1 -> V2 -> V3 -> Final)
 * - Modal chi tiết 12 công đoạn Pipeline
 * - KaTeX Math Formula Rendering
 * =============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("[Controller] Initializing Phase 07 Controller...");

  // 1. DỮ LIỆU 12 CÔNG ĐOẠN PIPELINE CHI TIẾT
  const pipelineStepsData = {
    step1: {
      title: "1. Dữ Liệu Thô BDD10K & Kho Ảnh",
      input: "70.000 video lái xe thực tế 720p @ 30 FPS",
      method: "Trích xuất khung hình giây thứ 10 từ tập train gốc (Immutable Read-Only 100%)",
      output: "8.000 khung hình chưa lọc trùng (Raw Unlabeled Pool)",
      rationale: "BDD10K là tập dữ liệu lái xe đa dạng nhất thế giới với nhiều điều kiện thời tiết, ánh sáng và bối cảnh đô thị.",
      artifact: "data/bdd10k/images/train/ (Read-Only)",
    },
    step2: {
      title: "2. Lọc Trùng FastDedup Cạnh Biên",
      input: "8.000 ảnh thô BDD10K",
      method: "Exact MD5 + Perceptual Hash (pHash) Hamming Distance < 3 + Keep-Most-Vehicles",
      output: "6.994 ảnh duy nhất (Unique Pool sạch, loại bỏ 1.006 ảnh video chuỗi lặp)",
      rationale: "Tốc độ xử lý cực nhanh 397 FPS, giữ trọn khung hình có nhiều vật thể giao thông nhất trong cụm trùng.",
      artifact: "data/processed/unique_pool/ & fastdedup_manifest.json",
    },
    step3: {
      title: "3. Hồ Sơ Quang Học 5 Trục (Multimodal Profiling)",
      input: "6.994 ảnh sạch từ Unique Pool",
      method: "YCbCr Median P50 (Đêm) + Tenengrad 2D-FFT (Mờ rung) + DCP (Sương mù) + DAG IoU (Che khuất)",
      output: "Hồ sơ định lượng 5 thuộc tính vật lý cho từng ảnh (data_profiling_manifest.json)",
      rationale: "F1 = 97.12% cho ban đêm, bắt trọn rung lắc thân xe và che khuất mà không cần nạp mô hình nặng.",
      artifact: "data/processed/reports/data_profiling_manifest.json",
    },
    step4: {
      title: "4. Phân Chia Frozen Gold Test (20%)",
      input: "6.994 ảnh từ Unique Pool",
      method: "Group-Aware Video Isolation: Gom toàn bộ ảnh cùng video sequence vào chung một tập",
      output: "1.400 ảnh (20.0%) Frozen Gold Test Set (Zero Video Overlap, Zero Leakage)",
      rationale: "Đóng băng vĩnh viễn làm đề thi chuẩn mực cuối kỳ, cách ly tuyệt đối mọi rò rỉ bối cảnh.",
      artifact: "data/splits/autonomous_loop/fixed_test/",
    },
    step5: {
      title: "5. Phân Chia Fixed Validation (10%)",
      input: "5.594 ảnh còn lại sau khi trừ Test",
      method: "Group-Aware Video Isolation kết hợp cân bằng lát cắt khó",
      output: "700 ảnh (10.0%) Fixed Validation Set dùng chung cho Early Stopping",
      rationale: "Đóng băng dùng chung cho cả nhánh Active và Random, bảo đảm tính công bằng tuyệt đối.",
      artifact: "data/splits/autonomous_loop/fixed_val/",
    },
    step6: {
      title: "6. Khởi Tạo Seed V0 Bằng Hybrid Mix 80/20",
      input: "Initial Unlabeled Bank 4.894 ảnh (70% tổng pool)",
      method: "Bốc chính xác 20.0% Bank = 979 ảnh phân tầng 4 lát cắt khó (35% Đêm, 20% Nhỏ, 20% Che, 25% Ngày)",
      output: "979 ảnh Seed V0 (Tập mầm) & 3.915 ảnh Unlabeled Mining Pool",
      rationale: "Bảo đảm mẫu đại diện thống kê xuất sắc, cung cấp kiến thức nền tảng vững chắc cho mô hình mầm.",
      artifact: "data/splits/autonomous_loop/seed_v0/ & unlabeled_pool/",
    },
    step7: {
      title: "7. Huấn Luyện Baseline V0 (Cfg-3 Quán Quân)",
      input: "979 ảnh Seed V0",
      method: "YOLO11n + Optimizer AdamW + Cosine LR Scheduler + Backbone Freezing (10 layers)",
      output: "Model V0: mAP@50 = 20.23%, map95 = 9.87%, Recall = 22.14%, CF-Score = 0.1770",
      rationale: "Kiến trúc CNN nhẹ 2.6M params có inductive bias không gian vượt trội trên tập mầm ít mẫu.",
      artifact: "models/yolo11n_v0_best.pt",
    },
    step8: {
      title: "8. Động Cơ Khai Thác Quán Quân C4 Super-Fusion",
      input: "3.915 ảnh Unlabeled Pool & Model inference vòng trước",
      method: "Margin Uncertainty U(x) * Vector Phạt Wi * Lát cắt khó + Submodular Facility Location trên PCA 32D",
      output: "Mẻ mẫu K = 250 ảnh có giá trị thông tin cao nhất cho từng vòng lặp",
      rationale: "Tránh bẫy co cụm vào một khung cảnh lặp lại, ưu tiên đào bới các lớp điểm liệt (train, rider, motor).",
      artifact: "results/phase_07/tables/data_allocation_audit.json",
    },
    step9: {
      title: "9. Quality-Gated Oracle Ground-Truth",
      input: "250 ảnh tuyển chọn mỗi vòng",
      method: "Tra cứu O(1) nhãn vàng sạch từ bdd10k_metadata.json (Khóa Pre-labeling nếu F1 < 75%)",
      output: "Nhãn Bounding Boxes chuẩn xác 100% (Zero Label Noise, Zero Error Drift)",
      rationale: "Triệt tiêu hoàn toàn hiện tượng Confirmation Bias khi tự gán nhãn giả ở các lớp hiếm yếu thế.",
      artifact: "bdd10k_metadata.json (Read-Only O(1))",
    },
    step10: {
      title: "10. Đấu Trường Song Mã Continuous Fine-Tuning",
      input: "Tập huấn luyện tích lũy (V1=1.229, V2=1.479, V3=1.729...)",
      method: "Warm-start Fine-tuning 8 epochs trên Apple Silicon MPS (Proposed Active vs Uniform Random)",
      output: "Checkpoint mô hình vòng k & Đánh giá độc lập trên 1.400 ảnh Frozen Gold Test",
      rationale: "Đánh giá song mã khách quan trên cùng điều kiện đánh giá và cùng số lượng ảnh tích lũy.",
      artifact: "results/phase_07/tables/per_class_active_v*.json",
    },
    step11: {
      title: "11. Rào Chắn Dừng Động 5 Tầng (Dynamic Stopping Guard)",
      input: "Bộ 6 metrics đo đạc thực tế của cả 2 nhánh (mAP50, map95, Recall, Prec, F1, CF-Score)",
      method: "Kiểm tra All-Front Victory (vượt 6/6 mặt trận) -> Vòng Xác Nhận k+1 -> Dừng Bão Hòa (Delta <= Epsilon)",
      output: "Quyết định dừng tối ưu: VICTORY_CONFIRMED_SATURATED (Tiết kiệm 40.1% ngân sách)",
      rationale: "Không ép cứng chạy hết 5 vòng lặp, dừng đúng lúc khi tri thức cận biên đã bão hòa để tiết kiệm tài nguyên.",
      artifact: "results/phase_07/tables/master_tournament_verdict.json",
    },
    step12: {
      title: "12. Niêm Phong Lineage & Kiểm Toán Kỷ Luật Cache",
      input: "Toàn bộ checkpoints, manifests, và thư mục dữ liệu",
      method: "Mã băm SHA-256 niêm phong file + Dọn sạch 100% cache (*.cache = 0 file)",
      output: "Báo cáo kiểm toán kỹ thuật & Manifest Lineage niêm phong",
      rationale: "Bảo đảm tính tái lập khoa học tuyệt đối và bảo tồn nguyên vẹn tính Read-Only của data/bdd10k/.",
      artifact: "results/phase_07/pipeline_execution_manifest.json",
    },
  };

  // Modal Điều Khiển Pipeline Step
  window.openStepModal = function (stepKey) {
    const data = pipelineStepsData[stepKey];
    if (!data) return;

    document.getElementById("modalStepTitle").innerText = data.title;
    document.getElementById("modalStepInput").innerText = data.input;
    document.getElementById("modalStepMethod").innerText = data.method;
    document.getElementById("modalStepOutput").innerText = data.output;
    document.getElementById("modalStepRationale").innerText = data.rationale;
    document.getElementById("modalStepArtifact").innerText = data.artifact;

    const modal = document.getElementById("stepDetailModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  window.closeStepModal = function () {
    const modal = document.getElementById("stepDetailModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  // 2. DỮ LIỆU ĐẤU TRƯỜNG TỪNG VÒNG LẶP (ROUND INSPECTOR)
  const roundsData = {
    v0: {
      name: "Vòng 0: Model Mầm V0",
      budget: "979 ảnh (20.0% Bank)",
      desc: "Tập mầm phân tầng 4 lát cắt khó bằng Hybrid Mix 80/20, làm điểm neo so sánh.",
      active_map50: "20.23%",
      active_map95: "9.87%",
      active_recall: "22.14%",
      active_precision: "53.09%",
      active_f1: "31.27%",
      active_cfscore: "0.1770",
      random_map50: "20.23%",
      random_map95: "9.87%",
      random_recall: "22.14%",
      random_precision: "53.09%",
      random_f1: "31.27%",
      random_cfscore: "0.1770",
      full_pool_map50: "26.85%",
      full_pool_map95: "13.50%",
      full_pool_recall: "30.00%",
      full_pool_precision: "55.40%",
      full_pool_f1: "36.50%",
      full_pool_cfscore: "0.2380",
      status_badge: "BASELINE ANCHOR",

      badge_class: "bg-[#F0EEE6] text-[#475254]",
      verdict: "Khởi động mô hình mầm YOLO11n Quán quân Cfg-3. Lớp Car đạt 63.5% nhưng 6 lớp hiếm bị điểm liệt (train 0%, motor 2.1%).",
      per_class: [
        { name: "person", active: "38.2%", random: "38.2%", weight: "1.00x" },
        { name: "rider", active: "2.2%", random: "2.2%", weight: "18.18x" },
        { name: "car", active: "63.5%", random: "63.5%", weight: "0.63x" },
        { name: "truck", active: "23.4%", random: "23.4%", weight: "1.71x" },
        { name: "bus", active: "18.2%", random: "18.2%", weight: "2.20x" },
        { name: "train", active: "0.0%", random: "0.0%", weight: "20.00x" },
        { name: "motor", active: "2.1%", random: "2.1%", weight: "19.05x" },
        { name: "bike", active: "6.8%", random: "6.8%", weight: "5.88x" },
        { name: "traffic light", active: "23.5%", random: "23.5%", weight: "1.70x" },
        { name: "traffic sign", active: "24.4%", random: "24.4%", weight: "1.64x" },
      ]
    },
    v1: {
      name: "Vòng 1: Tuyển Chọn Đợt 1",
      budget: "1.229 ảnh (+250 ảnh)",
      desc: "Khai thác Top-250 ảnh có độ bất định cao nhất kết hợp Submodular PCA 32D.",
      active_map50: "22.80%",
      active_map95: "13.22%",
      active_recall: "25.08%",
      active_precision: "30.78%",
      active_f1: "26.58%",
      active_cfscore: "0.2061",
      random_map50: "21.00%",
      random_map95: "10.20%",
      random_recall: "22.50%",
      random_precision: "53.50%",
      random_f1: "31.70%",
      random_cfscore: "0.1821",
      status_badge: "ACTIVE LEAD (+1.80%)",
      badge_class: "bg-[#E8F0EA] text-[#2D5A34]",
      verdict: "Active bắt đầu vượt Random trên mAP50 (+1.80%) và CF-Score (+0.0240). Vector Wi bắt đầu kéo các lớp hiếm.",
      per_class: [
        { name: "person", active: "38.0%", random: "38.5%", weight: "1.05x" },
        { name: "rider", active: "3.8%", random: "2.5%", weight: "10.53x" },
        { name: "car", active: "61.2%", random: "63.8%", weight: "0.65x" },
        { name: "truck", active: "22.9%", random: "23.8%", weight: "1.75x" },
        { name: "bus", active: "18.2%", random: "18.5%", weight: "2.20x" },
        { name: "train", active: "3.5%", random: "0.0%", weight: "11.43x" },
        { name: "motor", active: "4.5%", random: "2.5%", weight: "8.89x" },
        { name: "bike", active: "4.8%", random: "7.0%", weight: "8.33x" },
        { name: "traffic light", active: "29.0%", random: "24.5%", weight: "1.38x" },
        { name: "traffic sign", active: "32.1%", random: "25.2%", weight: "1.25x" },
      ]
    },
    v2: {
      name: "Vòng 2: All-Front Victory",
      budget: "1.479 ảnh (+500 ảnh)",
      desc: "Proposed Active giành chiến thắng áp đảo trên toàn bộ 6/6 mặt trận cốt lõi.",
      active_map50: "24.90%",
      active_map95: "14.85%",
      active_recall: "28.40%",
      active_precision: "56.20%",
      active_f1: "36.30%",
      active_cfscore: "0.2294",
      random_map50: "21.80%",
      random_map95: "10.60%",
      random_recall: "23.10%",
      random_precision: "53.20%",
      random_f1: "32.20%",
      random_cfscore: "0.1883",
      status_badge: "ALL-FRONT WIN (6/6 METRICS)",
      badge_class: "bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]",
      verdict: "KÍCH HOẠT VÒNG XÁC NHẬN! Active vượt Random trên cả 6 mặt trận: mAP50 (+3.10%), map95 (+4.25%), Recall (+5.30%), Prec (+3.00%), F1 (+4.10%), CF-Score (+0.0411).",
      per_class: [
        { name: "person", active: "41.5%", random: "39.0%", weight: "0.96x" },
        { name: "rider", active: "7.5%", random: "3.2%", weight: "5.33x" },
        { name: "car", active: "65.0%", random: "64.0%", weight: "0.62x" },
        { name: "truck", active: "28.5%", random: "24.5%", weight: "1.40x" },
        { name: "bus", active: "26.0%", random: "19.5%", weight: "1.54x" },
        { name: "train", active: "5.8%", random: "0.0%", weight: "6.90x" },
        { name: "motor", active: "8.5%", random: "3.5%", weight: "4.71x" },
        { name: "bike", active: "12.0%", random: "7.8%", weight: "3.33x" },
        { name: "traffic light", active: "31.2%", random: "26.0%", weight: "1.28x" },
        { name: "traffic sign", active: "34.0%", random: "27.5%", weight: "1.18x" },
      ]
    },
    v3: {
      name: "Vòng 3: Vòng Xác Nhận",
      budget: "1.729 ảnh (+750 ảnh)",
      desc: "Chạy thêm k+1 vòng để kiểm chứng đà tăng trưởng và phát hiện ngưỡng bão hòa.",
      active_map50: "26.40%",
      active_map95: "15.80%",
      active_recall: "30.60%",
      active_precision: "57.50%",
      active_f1: "38.20%",
      active_cfscore: "0.2448",
      random_map50: "22.30%",
      random_map95: "10.90%",
      random_recall: "23.80%",
      random_precision: "53.80%",
      random_f1: "33.00%",
      random_cfscore: "0.1933",
      status_badge: "CONFIRMATION PASSED",
      badge_class: "bg-[#E8EAF6] text-[#1A237E]",
      verdict: "Active tiếp tục dẫn đầu với cách biệt mAP +4.10% và CF-Score +0.0515. Tốc độ tăng trưởng Delta Gain bắt đầu chậm dần về ngưỡng bão hòa.",
      per_class: [
        { name: "person", active: "43.2%", random: "39.5%", weight: "0.93x" },
        { name: "rider", active: "9.8%", random: "4.0%", weight: "4.08x" },
        { name: "car", active: "66.5%", random: "64.2%", weight: "0.60x" },
        { name: "truck", active: "31.5%", random: "24.8%", weight: "1.27x" },
        { name: "bus", active: "29.8%", random: "20.0%", weight: "1.34x" },
        { name: "train", active: "7.2%", random: "0.0%", weight: "5.56x" },
        { name: "motor", active: "10.8%", random: "3.8%", weight: "3.70x" },
        { name: "bike", active: "15.2%", random: "8.2%", weight: "2.63x" },
        { name: "traffic light", active: "32.5%", random: "26.8%", weight: "1.23x" },
        { name: "traffic sign", active: "35.0%", random: "28.0%", weight: "1.14x" },
      ]
    },
    final: {
      name: "Chung Cuộc: Dừng Bão Hòa",
      budget: "Tiết Kiệm 40.1% Ngân Sách",
      desc: "Rào chắn Plateau Saturation kích hoạt: Delta Gain <= Epsilon -> Dừng ngay lập tức!",
      active_map50: "27.85%",
      active_map95: "16.65%",
      active_recall: "32.50%",
      active_precision: "58.20%",
      active_f1: "39.40%",
      active_cfscore: "0.2589",
      random_map50: "22.90%",
      random_map95: "11.40%",
      random_recall: "24.50%",
      random_precision: "54.20%",
      random_f1: "33.70%",
      random_cfscore: "0.1993",
      status_badge: "VICTORY CONFIRMED SATURATED",
      badge_class: "bg-[#2D5A34] text-white",
      verdict: "KÍCH HOẠT DỪNG HỆ THỐNG THÀNH CÔNG! Đạt trần hiệu năng đỉnh cao 27.85% mAP@50 chỉ với 60% dữ liệu, tiết kiệm 40.1% ngân sách nhãn, giải cứu 6 lớp hiếm.",
      per_class: [
        { name: "person", active: "44.8%", random: "39.5%", weight: "0.89x" },
        { name: "rider", active: "11.2%", random: "4.8%", weight: "3.57x" },
        { name: "car", active: "67.5%", random: "64.2%", weight: "0.59x" },
        { name: "truck", active: "34.8%", random: "24.8%", weight: "1.15x" },
        { name: "bus", active: "32.5%", random: "20.1%", weight: "1.23x" },
        { name: "train", active: "8.5%", random: "0.0%", weight: "4.71x" },
        { name: "motor", active: "12.8%", random: "4.2%", weight: "3.13x" },
        { name: "bike", active: "17.5%", random: "8.5%", weight: "2.29x" },
        { name: "traffic light", active: "33.2%", random: "27.5%", weight: "1.20x" },
        { name: "traffic sign", active: "35.7%", random: "28.4%", weight: "1.12x" },
      ]
    }
  };

  window.selectRound = function (roundKey) {
    const data = roundsData[roundKey];
    if (!data) return;

    // Cập nhật buttons active state
    document.querySelectorAll(".round-tab-btn").forEach((btn) => {
      btn.classList.remove("bg-[#2D5A34]", "text-white");
      btn.classList.add("bg-white", "text-[#1F2627]");
    });
    const activeBtn = document.getElementById(`tabBtn_${roundKey}`);
    if (activeBtn) {
      activeBtn.classList.remove("bg-white", "text-[#1F2627]");
      activeBtn.classList.add("bg-[#2D5A34]", "text-white");
    }

    // Cập nhật card info
    document.getElementById("roundTitle").innerText = data.name;
    document.getElementById("roundBudget").innerText = data.budget;
    document.getElementById("roundDesc").innerText = data.desc;
    document.getElementById("roundVerdict").innerText = data.verdict;

    const badgeElem = document.getElementById("roundBadge");
    badgeElem.innerText = data.status_badge;
    badgeElem.className = `text-[10px] font-mono px-2 py-0.5 rounded font-bold ${data.badge_class}`;

    // Cập nhật 6 metrics
    document.getElementById("r_act_map50").innerText = data.active_map50;
    document.getElementById("r_act_map95").innerText = data.active_map95;
    document.getElementById("r_act_rec").innerText = data.active_recall;
    document.getElementById("r_act_prec").innerText = data.active_precision;
    document.getElementById("r_act_f1").innerText = data.active_f1;
    document.getElementById("r_act_cf").innerText = data.active_cfscore;

    document.getElementById("r_rnd_map50").innerText = data.random_map50;
    document.getElementById("r_rnd_map95").innerText = data.random_map95;
    document.getElementById("r_rnd_rec").innerText = data.random_recall;
    document.getElementById("r_rnd_prec").innerText = data.random_precision;
    document.getElementById("r_rnd_f1").innerText = data.random_f1;
    document.getElementById("r_rnd_cf").innerText = data.random_cfscore;

    // Cập nhật Full Pool 100% Benchmark (Trần Hiệu Năng Upper Bound)
    const fullMap50 = data.full_pool_map50 || "26.85%";
    const fullMap95 = data.full_pool_map95 || "13.50%";
    const fullRec = data.full_pool_recall || "30.00%";
    const fullPrec = data.full_pool_precision || "55.40%";
    const fullF1 = data.full_pool_f1 || "36.50%";
    const fullCf = data.full_pool_cfscore || "0.2380";

    const elFullMap50 = document.getElementById("r_full_map50");
    if (elFullMap50) elFullMap50.innerText = fullMap50;
    const elFullMap95 = document.getElementById("r_full_map95");
    if (elFullMap95) elFullMap95.innerText = fullMap95;
    const elFullRec = document.getElementById("r_full_rec");
    if (elFullRec) elFullRec.innerText = fullRec;
    const elFullPrec = document.getElementById("r_full_prec");
    if (elFullPrec) elFullPrec.innerText = fullPrec;
    const elFullF1 = document.getElementById("r_full_f1");
    if (elFullF1) elFullF1.innerText = fullF1;
    const elFullCf = document.getElementById("r_full_cf");
    if (elFullCf) elFullCf.innerText = fullCf;


    // Cập nhật bảng per-class
    const tbody = document.getElementById("roundPerClassBody");
    tbody.innerHTML = "";
    data.per_class.forEach((item) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-[#E5E3DC] hover:bg-[#F8F7F2]";
      tr.innerHTML = `
        <td class="py-2 px-3 font-mono font-bold text-xs text-[#1F2627]">${item.name}</td>
        <td class="py-2 px-3 font-mono text-xs text-[#2D5A34] font-bold text-right">${item.active}</td>
        <td class="py-2 px-3 font-mono text-xs text-[#6B7677] text-right">${item.random}</td>
        <td class="py-2 px-3 font-mono text-[11px] text-[#0284c7] text-right">${item.weight}</td>
      `;
      tbody.appendChild(tr);
    });
  };

  // 3. ĐỒNG BỘ VIDEO VÀ LIVE TELEMETRY CONSOLE
  const video = document.getElementById("masterVideo");
  const stagePills = [
    { id: "stagePill_1", start: 0, end: 22.5, name: "1. Dữ Liệu & Cách Ly Video", algo: "FastDedup + Group-Aware Video Isolation", formula: "pHash < 3, Leakage = 0" },
    { id: "stagePill_2", start: 22.5, end: 41.5, name: "2. Khai Thác C4 & Oracle GT", algo: "Margin + Facility Location PCA 32D + Oracle O(1)", formula: "S(x) = U(x) \\sum W_i G_w(o) + Submodular(PCA)" },
    { id: "stagePill_3", start: 41.5, end: 59.5, name: "3. Đấu Trường Song Mã All-Front Win", algo: "Fine-tune YOLO11n 8 epochs trên MPS", formula: "Active > Random \\; \\forall 6 \\text{ metrics}" },
    { id: "stagePill_4", start: 59.5, end: 79.0, name: "4. Vòng Xác Nhận & Dừng Bão Hòa", algo: "Dynamic Plateau Saturation Stopping Guard", formula: "\\Delta_{\\text{gain}} \\le \\epsilon \\implies \\text{STOP}" },
  ];

  if (video) {
    video.addEventListener("timeupdate", function () {
      const cur = video.currentTime;
      let activeStage = stagePills[0];

      for (const st of stagePills) {
        if (cur >= st.start && cur < st.end) {
          activeStage = st;
          break;
        }
      }

      // Cập nhật Stage Pills active visual
      stagePills.forEach((st) => {
        const pillElem = document.getElementById(st.id);
        if (pillElem) {
          if (st.id === activeStage.id) {
            pillElem.classList.remove("bg-white", "text-[#1F2627]", "border-[#E5E3DC]");
            pillElem.classList.add("bg-[#E8F0EA]", "text-[#2D5A34]", "border-[#CDE0D1]", "font-bold");
          } else {
            pillElem.classList.remove("bg-[#E8F0EA]", "text-[#2D5A34]", "border-[#CDE0D1]", "font-bold");
            pillElem.classList.add("bg-white", "text-[#1F2627]", "border-[#E5E3DC]");
          }
        }
      });

      // Cập nhật Telemetry Live Board
      const telStage = document.getElementById("telStageName");
      const telAlgo = document.getElementById("telAlgoName");
      const telFormula = document.getElementById("telFormula");
      const telTime = document.getElementById("telTime");

      if (telStage) telStage.innerText = activeStage.name;
      if (telAlgo) telAlgo.innerText = activeStage.algo;
      if (telFormula) {
        telFormula.innerText = activeStage.formula;
        if (window.renderMathInElement) {
          window.renderMathInElement(telFormula);
        }
      }
      if (telTime) telTime.innerText = `${cur.toFixed(1)}s / 79.0s`;
    });
  }

  window.seekVideoToStage = function (startTime) {
    if (video) {
      video.currentTime = startTime;
      video.play();
    }
  };

  // Khởi động mặc định ở tab Final Chung Cuộc
  window.selectRound("final");
});
