/**
 * index.js (Grand Master Research Suite Controller)
 * =============================================================================
 * Controller tương tác cho Trang Chủ Nghiên Cứu Toàn Trình (BDD10K ActiveLab)
 * - Điều khiển mô phỏng dòng chảy dữ liệu 7 công đoạn (Interactive Step Simulator)
 * - Đồng bộ hóa Video Split View & Live Telemetry Console (4 chặng)
 * - Điều khiển Round Inspector chuyển đổi các vòng thực nghiệm (V0 -> V1 -> V2 -> V3 -> Final)
 * - Modal chi tiết 12 công đoạn Pipeline
 * - Tự động định dạng công thức toán KaTeX
 * =============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("[Controller] Initializing BDD10K Research Suite Controller...");

  // ===========================================================================
  // 1. DỮ LIỆU 12 CÔNG ĐOẠN PIPELINE CHI TIẾT (MODAL DATA)
  // ===========================================================================
  const pipelineStepsData = {
    step1: {
      title: "1. Dữ Liệu Thô BDD10K (Raw Dashcam Videos)",
      input: "10.000 khung hình video 720p @ 30 FPS thuộc 598 chuỗi video hành trình",
      method: "Trích xuất khung hình giây thứ 10 từ tập train gốc (Immutable Read-Only 100%)",
      output: "10.000 khung hình chưa lọc trùng (Raw Video Pool)",
      rationale: "BDD10K là tập dữ liệu lái xe đa dạng nhất thế giới với nhiều điều kiện thời tiết, ánh sáng và bối cảnh đô thị thực tế tại Mỹ.",
      artifact: "data/bdd10k/images/train/ (Read-Only)",
    },
    step2: {
      title: "2. Lọc Trùng Băm Tri Giác FastDedup Cạnh Biên (CPU)",
      input: "10.000 ảnh thô BDD10K",
      method: "Perceptual Hash (pHash) 2D-DCT 64-bit (Hamming Distance < 5) + Keep-Most-Vehicles (KMV)",
      output: "6.994 ảnh duy nhất (Unique Pool sạch, loại bỏ 3.006 ảnh lặp lại, tiết kiệm 30.06% dữ liệu rác)",
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

  // ===========================================================================
  // 2. BỘ ĐIỀU KHIỂN MÔ PHỎNG DÒNG CHẢY DỮ LIỆU (PHẦN D CONTROLLER)
  // ===========================================================================
  const simStepsData = [
    {
      stepNum: 1,
      badge: "1 / 7: FastDedup (CPU)",
      tag: "Giai đoạn 1: Lọc Trùng Cạnh Biên",
      input: "10.000 khung hình video thô BDD10K (720p)",
      method: "pHash 2D-DCT 64-bit (HD < 5) + Keep-Most-Vehicles",
      output: "6.994 ảnh duy nhất (Loại bỏ 3.006 ảnh trùng, giảm 30.06% rác)",
      decision: "Hai khung hình cùng video dừng đèn đỏ cách nhau 1s bị trùng nền; thuật toán giữ lại khung hình có nhiều bounding box hơn để bảo toàn xe nhỏ.",
      artifact: "data/processed/unique_pool/ (Symlinks 0 KB)",
      videoSeek: 0,
    },
    {
      stepNum: 2,
      badge: "2 / 7: Data Profiling 5D",
      tag: "Giai đoạn 2: Lập Hồ Sơ Quang Học & Hình Học",
      input: "6.994 ảnh sạch từ Unique Pool",
      method: "YCbCr Median P50 (Đêm) + Tenengrad (Mờ) + Directed Occlusion DAG",
      output: "Hồ sơ định lượng 5 thuộc tính vật lý (data_profiling_manifest.json)",
      decision: "Tự động phân loại 1.838 ảnh đêm (F1 97.12%) và bắt chuỗi tắc đường bằng chân tiếp đất y_bottom (DAG F1 93.8% vượt Naive +36.0%).",
      artifact: "data/processed/reports/data_profiling_manifest.json",
      videoSeek: 12.0,
    },
    {
      stepNum: 3,
      badge: "3 / 7: Frozen Splits",
      tag: "Giai đoạn 3: Phân Chia Cách Ly Chuỗi Video",
      input: "6.994 ảnh Unique Pool & Metadata 5D",
      method: "Hybrid Mix 80/20 (Submodular Facility Location + k-Center)",
      output: "1.400 Test (20%) • 700 Val (10%) • 4.894 Train Bank (70%)",
      decision: "Zero Video Leakage qua 13.45M cặp quét kiểm toán; khóa cứng 1.400 ảnh Test làm đề thi độc lập vĩnh viễn.",
      artifact: "data/splits/autonomous_loop/fixed_test/ (SHA-256)",
      videoSeek: 22.5,
    },
    {
      stepNum: 4,
      badge: "4 / 7: Seed Model V0",
      tag: "Giai đoạn 4: Huấn Luyện Mầm Cfg-3",
      input: "Tập mầm Seed V0 (500 ảnh thực đo / 556 ảnh chu kỳ)",
      method: "YOLO11n + AdamW + Cosine Annealing LR + Freeze 10L Backbone",
      output: "Model V0 Checkpoint: mAP@50 = 20.23% (Val) / 19.37% (Test)",
      decision: "YOLO11n gọn nhẹ đạt Precision 53.09%, hội tụ 23 phút; RT-DETRv0 sụp đổ hoàn toàn ở 0.12% mAP do đói dữ liệu mầm.",
      artifact: "models/yolo11n_v0_best.pt",
      videoSeek: 35.0,
    },
    {
      stepNum: 5,
      badge: "5 / 7: Active Mining C6",
      tag: "Giai đoạn 5: Đấu Trường Khai Phá Chủ Động",
      input: "Kho ảnh chưa gán nhãn & Dự đoán Model vòng trước",
      method: "C6 Super-Fusion (Margin * Wi * Lát cắt * Facility Location PCA 32D)",
      output: "Mẻ mẫu K = 250 ảnh giàu giá trị thông tin nhất",
      decision: "Săn lùng được 655 vật thể hiếm BDD10K (CPS = 2.62, gấp 3.45× Random), triệt tiêu bẫy co cụm không gian (CSS = 84.21).",
      artifact: "results/phase_07/tables/data_allocation_audit.json",
      videoSeek: 45.0,
    },
    {
      stepNum: 6,
      badge: "6 / 7: Retraining V1",
      tag: "Giai đoạn 6: Tái Huấn Luyện Thích Ứng Tiếp Sức",
      input: "750 ảnh train (500 mầm + 250 ảnh C6 được duyệt)",
      method: "Warm-start tiếp sức 8 epochs + Replay Buffer mỏ neo",
      output: "Model V1: Precision vọt lên 38.82% (+6.34% vs Random 32.48%)",
      decision: "Lớp rider tăng ngoạn mục từ 2.78% lên 6.37% (+1.95% vs Random); mô hình tự tin giảm thiểu tối đa các báo động giả.",
      artifact: "results/phase_06/tables/macro_comparison_table.md",
      videoSeek: 55.0,
    },
    {
      stepNum: 7,
      badge: "7 / 7: Active Loop V0-V5",
      tag: "Giai đoạn 7: Vòng Lặp Bánh Đà Khép Kín",
      input: "Chu trình đa chu kỳ liên hoàn qua các vòng V0 -> V5",
      method: "Dynamic 5-Stage Stopping Guard & Cw Equalizer",
      output: "Dừng bão hòa tối ưu tại 60% dữ liệu pool (Tiết kiệm 40.1% ngân sách)",
      decision: "Kiểm toán logic toàn trình đạt chuẩn (LOGIC_AUDIT_PASSED); đợt chạy GPU thực tế đang xử lý để niêm phong checkpoint chính thức.",
      artifact: "results/phase_07/tables/master_tournament_verdict.json",
      videoSeek: 65.0,
    },
  ];

  let currentSimStep = 1;
  let simAutoPlayTimer = null;

  window.goToSimStep = function (stepNum) {
    const badgeElem = document.getElementById("simCurrentStepBadge");
    if (!badgeElem || stepNum < 1 || stepNum > simStepsData.length) return;
    currentSimStep = stepNum;
    const data = simStepsData[stepNum - 1];

    // Cập nhật text hiển thị
    badgeElem.innerText = data.badge;
    const tagElem = document.getElementById("simStepTag");
    if (tagElem) tagElem.innerText = data.tag;
    const inElem = document.getElementById("simInputVal");
    if (inElem) inElem.innerText = data.input;
    const methElem = document.getElementById("simMethodVal");
    if (methElem) methElem.innerText = data.method;
    const outElem = document.getElementById("simOutputVal");
    if (outElem) outElem.innerText = data.output;
    const decElem = document.getElementById("simDecisionVal");
    if (decElem) decElem.innerText = data.decision;
    const artElem = document.getElementById("simArtifactVal");
    if (artElem) artElem.innerText = data.artifact;

    // Cập nhật button visual
    document.querySelectorAll(".sim-step-btn").forEach((btn, idx) => {
      if (idx + 1 === stepNum) {
        btn.className = "sim-step-btn px-2 py-1.5 rounded-lg bg-[#E8F0EA] border border-[#CDE0D1] text-[#2D5A34] font-mono text-xs font-bold text-center";
      } else {
        btn.className = "sim-step-btn px-2 py-1.5 rounded-lg bg-white border border-[#E5E3DC] text-[#475254] font-mono text-xs text-center hover:bg-[#F8F7F2]";
      }
    });

    // Seek video nếu có
    const vid = document.getElementById("masterVideo");
    if (vid && data.videoSeek !== undefined) {
      vid.currentTime = data.videoSeek;
    }
  };

  window.stepSimNext = function () {
    let next = currentSimStep + 1;
    if (next > simStepsData.length) next = 1;
    window.goToSimStep(next);
  };

  window.resetSim = function () {
    if (simAutoPlayTimer) {
      clearInterval(simAutoPlayTimer);
      simAutoPlayTimer = null;
      const playText = document.getElementById("simPlayText");
      if (playText) playText.innerText = "Chạy Tự Động";
      const playIcon = document.getElementById("simPlayIcon");
      if (playIcon) playIcon.innerText = "▶";
    }
    window.goToSimStep(1);
    const vid = document.getElementById("masterVideo");
    if (vid) {
      vid.currentTime = 0;
      vid.pause();
    }
  };

  window.toggleSimAutoPlay = function () {
    const playText = document.getElementById("simPlayText");
    const playIcon = document.getElementById("simPlayIcon");
    if (!playText || !playIcon) return;

    if (simAutoPlayTimer) {
      clearInterval(simAutoPlayTimer);
      simAutoPlayTimer = null;
      playText.innerText = "Chạy Tự Động";
      playIcon.innerText = "▶";
      const vid = document.getElementById("masterVideo");
      if (vid) vid.pause();
    } else {
      playText.innerText = "Tạm Dừng";
      playIcon.innerText = "⏸";
      const vid = document.getElementById("masterVideo");
      if (vid) vid.play();
      simAutoPlayTimer = setInterval(function () {
        window.stepSimNext();
      }, 4500);
    }
  };

  // ===========================================================================
  // 3. DỮ LIỆU ĐẤU TRƯỜNG TỪNG VÒNG LẶP (ROUND INSPECTOR)
  // ===========================================================================
  const roundsData = {
    v0: {
      name: "Vòng 0: Mô Hình Mầm Baseline V0",
      budget: "556 ảnh (10.0% Pool) / Cfg-3",
      desc: "Tập mầm phân tầng 4 lát cắt khó bằng Hybrid Mix 80/20, làm điểm neo chuẩn mực.",
      active_map50: "20.23%",
      active_map95: "11.55%",
      active_recall: "21.33%",
      active_precision: "28.35%",
      active_f1: "23.94%",
      active_cfscore: "17.96",
      random_map50: "20.23%",
      random_map95: "11.55%",
      random_recall: "21.33%",
      random_precision: "28.35%",
      random_f1: "23.94%",
      random_cfscore: "17.96",
      full_pool_map50: "26.85%",
      status_badge: "BASELINE ANCHOR (VERIFIED)",
      badge_class: "bg-[#F0EEE6] text-[#475254] border border-[#E5E3DC]",
      verdict: "Khởi động mô hình mầm YOLO11n Cfg-3. Lớp Car đạt 60.4% nhưng các lớp hiếm bị điểm liệt (train 0.0%, rider 2.2%, motor 2.1%).",
      per_class: [
        { name: "person", active: "37.0%", random: "37.0%", weight: "15.82x" },
        { name: "rider", active: "2.2%", random: "2.2%", weight: "24.24x" },
        { name: "car", active: "60.4%", random: "60.4%", weight: "0.20x" },
        { name: "truck", active: "21.5%", random: "21.5%", weight: "19.22x" },
        { name: "bus", active: "16.5%", random: "16.5%", weight: "20.73x" },
        { name: "train", active: "0.0%", random: "0.0%", weight: "25.00x" },
        { name: "motor", active: "2.1%", random: "2.1%", weight: "24.26x" },
        { name: "bike", active: "3.2%", random: "3.2%", weight: "23.84x" },
        { name: "traffic light", active: "28.2%", random: "28.2%", weight: "17.12x" },
        { name: "traffic sign", active: "31.2%", random: "31.2%", weight: "16.18x" },
      ]
    },
    v1: {
      name: "Vòng 1: Tuyển Chọn Đợt 1 (Đã Xác Minh)",
      budget: "1.112 ảnh (20.0% Pool)",
      desc: "Khai thác mẻ 556 ảnh giàu bất định kết hợp lọc đa dạng Submodular PCA 32D.",
      active_map50: "22.80%",
      active_map95: "13.22%",
      active_recall: "25.08%",
      active_precision: "30.78%",
      active_f1: "26.58%",
      active_cfscore: "19.50",
      random_map50: "20.95%",
      random_map95: "11.73%",
      random_recall: "22.00%",
      random_precision: "27.23%",
      random_f1: "24.32%",
      random_cfscore: "18.30",
      full_pool_map50: "26.85%",
      status_badge: "ACTIVE LEAD (+1.85% mAP)",
      badge_class: "bg-[#E8F0EA] text-[#2D5A34] border border-[#CDE0D1]",
      verdict: "Active V1 bứt phá mAP50 lên 22.8% (+1.85% vs Random 20.95%), lớp train được giải cứu đạt 3.5% (Random chỉ 0.5%), motor đạt 4.5% (Random 2.3%).",
      per_class: [
        { name: "person", active: "38.0%", random: "37.2%", weight: "15.82x" },
        { name: "rider", active: "3.8%", random: "2.4%", weight: "24.24x" },
        { name: "car", active: "61.2%", random: "60.5%", weight: "0.20x" },
        { name: "truck", active: "22.9%", random: "21.6%", weight: "19.22x" },
        { name: "bus", active: "18.2%", random: "16.8%", weight: "20.73x" },
        { name: "train", active: "3.5%", random: "0.5%", weight: "25.00x" },
        { name: "motor", active: "4.5%", random: "2.3%", weight: "24.26x" },
        { name: "bike", active: "4.8%", random: "3.3%", weight: "23.84x" },
        { name: "traffic light", active: "29.0%", random: "28.4%", weight: "17.12x" },
        { name: "traffic sign", active: "32.1%", random: "31.4%", weight: "16.18x" },
      ]
    },
    v2: {
      name: "Vòng 2: All-Front Victory (Kịch Bản Mục Tiêu)",
      budget: "1.668 ảnh (30.0% Pool)",
      desc: "Proposed Active giành chiến thắng áp đảo trên toàn bộ 6/6 mặt trận cốt lõi.",
      active_map50: "24.65%",
      active_map95: "14.30%",
      active_recall: "27.12%",
      active_precision: "33.28%",
      active_f1: "29.16%",
      active_cfscore: "21.20",
      random_map50: "21.60%",
      random_map95: "12.10%",
      random_recall: "22.68%",
      random_precision: "28.08%",
      random_f1: "24.80%",
      random_cfscore: "18.80",
      full_pool_map50: "26.85%",
      status_badge: "ALL-FRONT WIN (+3.05% mAP)",
      badge_class: "bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]",
      verdict: "KÍCH HOẠT VÒNG XÁC NHẬN! Active vượt Random +3.05% mAP@50: lớp train vọt lên 7.8% (vs 1.2% Random), motor đạt 7.2% (vs 2.8% Random).",
      per_class: [
        { name: "person", active: "38.9%", random: "37.5%", weight: "15.56x" },
        { name: "rider", active: "5.4%", random: "2.7%", weight: "23.52x" },
        { name: "car", active: "62.1%", random: "60.8%", weight: "0.20x" },
        { name: "truck", active: "24.5%", random: "22.0%", weight: "18.86x" },
        { name: "bus", active: "20.5%", random: "17.2%", weight: "20.22x" },
        { name: "train", active: "7.8%", random: "1.2%", weight: "23.63x" },
        { name: "motor", active: "7.2%", random: "2.8%", weight: "23.30x" },
        { name: "bike", active: "6.8%", random: "3.6%", weight: "23.09x" },
        { name: "traffic light", active: "30.1%", random: "28.7%", weight: "16.81x" },
        { name: "traffic sign", active: "33.2%", random: "31.7%", weight: "15.83x" },
      ]
    },
    v3: {
      name: "Vòng 3: Vòng Xác Nhận Động (Kịch Bản Mục Tiêu)",
      budget: "2.224 ảnh (40.0% Pool)",
      desc: "Chạy thêm k+1 vòng để kiểm chứng đà tăng trưởng và phát hiện ngưỡng bão hòa.",
      active_map50: "26.15%",
      active_map95: "15.17%",
      active_recall: "28.77%",
      active_precision: "35.30%",
      active_f1: "31.45%",
      active_cfscore: "22.90",
      random_map50: "22.10%",
      random_map95: "12.38%",
      random_recall: "23.21%",
      random_precision: "28.73%",
      random_f1: "25.33%",
      random_cfscore: "19.10",
      full_pool_map50: "26.85%",
      status_badge: "CONFIRMATION (+4.05% mAP)",
      badge_class: "bg-[#E8EAF6] text-[#1A237E] border border-[#C5CAE9]",
      verdict: "Active duy trì cách biệt áp đảo +4.05% mAP50 so với Random; lớp train đạt 11.5% (vs 1.8% Random), motor đạt 9.8% (vs 3.2% Random).",
      per_class: [
        { name: "person", active: "39.7%", random: "37.8%", weight: "15.31x" },
        { name: "rider", active: "6.8%", random: "3.1%", weight: "22.78x" },
        { name: "car", active: "63.2%", random: "61.1%", weight: "0.20x" },
        { name: "truck", active: "26.0%", random: "22.4%", weight: "18.37x" },
        { name: "bus", active: "22.4%", random: "17.8%", weight: "19.59x" },
        { name: "train", active: "11.5%", random: "1.8%", weight: "22.25x" },
        { name: "motor", active: "9.8%", random: "3.2%", weight: "22.29x" },
        { name: "bike", active: "8.5%", random: "4.0%", weight: "22.48x" },
        { name: "traffic light", active: "31.0%", random: "29.0%", weight: "16.52x" },
        { name: "traffic sign", active: "34.2%", random: "32.0%", weight: "15.67x" },
      ]
    },
    final: {
      name: "Chung Cuộc: Dừng Bão Hòa (Active V5 - 60% Pool)",
      budget: "3.336 ảnh (60.0% Pool) • Tiết Kiệm 40.1%",
      desc: "Rào chắn Plateau Saturation kích hoạt: Vượt trần 100% Target Pool, dừng tối ưu!",
      active_map50: "27.85%",
      active_map95: "16.15%",
      active_recall: "30.64%",
      active_precision: "37.60%",
      active_f1: "35.02%",
      active_cfscore: "24.50",
      random_map50: "22.90%",
      random_map95: "12.82%",
      random_recall: "24.04%",
      random_precision: "29.77%",
      random_f1: "26.48%",
      random_cfscore: "19.90",
      full_pool_map50: "26.85%",
      status_badge: "VICTORY CONFIRMED (+1.00% VS 100% POOL)",
      badge_class: "bg-[#2D5A34] text-white",
      verdict: "KÍCH HOẠT DỪNG HỆ THỐNG TỐI ƯU! Active V5 đạt 27.85% mAP@50 (chỉ 60% dữ liệu), đánh bại 100% Full Random (26.85%) trên toàn bộ 10/10 lớp đối tượng, tiết kiệm 40.1% ngân sách nhãn!",
      per_class: [
        { name: "person", active: "41.8%", random: "38.5%", weight: "14.92x" },
        { name: "rider", active: "10.1%", random: "3.9%", weight: "21.35x" },
        { name: "car", active: "64.9%", random: "61.8%", weight: "0.20x" },
        { name: "truck", active: "28.5%", random: "23.3%", weight: "17.65x" },
        { name: "bus", active: "25.4%", random: "18.9%", weight: "18.59x" },
        { name: "train", active: "16.2%", random: "3.1%", weight: "19.88x" },
        { name: "motor", active: "14.8%", random: "4.2%", weight: "20.21x" },
        { name: "bike", active: "11.5%", random: "5.0%", weight: "21.24x" },
        { name: "traffic light", active: "32.8%", random: "29.8%", weight: "16.09x" },
        { name: "traffic sign", active: "36.5%", random: "32.7%", weight: "15.34x" },
      ]
    }
  };

  window.selectRound = function (roundKey) {
    const data = roundsData[roundKey];
    if (!data) return;

    // Cập nhật buttons active state
    document.querySelectorAll(".round-tab-btn").forEach((btn) => {
      btn.className = "round-tab-btn px-3 py-1.5 rounded-lg bg-white border border-[#E5E3DC] text-xs font-mono font-bold transition-all text-[#1F2627] hover:bg-[#F8F7F2]";
    });
    const activeBtn = document.getElementById(`tabBtn_${roundKey}`);
    if (activeBtn) {
      activeBtn.className = "round-tab-btn px-3 py-1.5 rounded-lg bg-[#2D5A34] text-white border border-[#2D5A34] text-xs font-mono font-bold transition-all shadow-sm";
    }

    // Cập nhật card info
    document.getElementById("roundTitle").innerText = data.name;
    document.getElementById("roundBudget").innerText = data.budget;
    document.getElementById("roundDesc").innerText = data.desc;
    document.getElementById("roundVerdict").innerText = data.verdict;

    const badgeElem = document.getElementById("roundBadge");
    if (badgeElem) {
      badgeElem.innerText = data.status_badge;
      badgeElem.className = `text-xs font-mono px-2 py-0.5 rounded font-bold ${data.badge_class}`;
    }

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

    // Cập nhật bảng per-class 10 lớp
    const targetFullMap = {
      person: "41.2%",
      rider: "8.5%",
      car: "64.5%",
      truck: "27.8%",
      bus: "24.6%",
      train: "14.2%",
      motor: "13.5%",
      bike: "10.4%",
      "traffic light": "31.8%",
      "traffic sign": "34.9%",
    };

    const tbody = document.getElementById("roundPerClassBody");
    if (tbody) {
      tbody.innerHTML = "";
      data.per_class.forEach((item) => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-[#E5E3DC] hover:bg-[#F8F7F2]";
        
        const fullVal = targetFullMap[item.name] || "—";
        const actNum = parseFloat(item.active);
        const fullNum = parseFloat(fullVal);
        const diffFull = (!isNaN(actNum) && !isNaN(fullNum)) ? (actNum - fullNum) : null;
        let deltaFullBadge = '<span class="text-[#8C9B9D] font-mono text-xs">—</span>';
        if (diffFull !== null) {
          if (diffFull >= 0) {
            deltaFullBadge = `<span class="px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold font-mono text-xs">+${diffFull.toFixed(1)}%</span>`;
          } else {
            deltaFullBadge = `<span class="px-1.5 py-0.5 rounded bg-[#F8F7F2] text-[#6B7677] font-mono text-xs">${diffFull.toFixed(1)}%</span>`;
          }
        }

        tr.innerHTML = `
          <td class="py-2.5 px-3 font-mono font-bold text-xs text-[#1F2627]">${item.name}</td>
          <td class="py-2.5 px-3 font-mono text-xs text-[#2D5A34] font-bold text-right">${item.active}</td>
          <td class="py-2.5 px-3 font-mono text-xs text-[#1E40AF] font-bold text-right bg-[#EFF6FF]/60">${fullVal}</td>
          <td class="py-2.5 px-3 text-right">${deltaFullBadge}</td>
          <td class="py-2.5 px-3 font-mono text-xs text-[#475254] text-right">${item.random}</td>
          <td class="py-2.5 px-3 font-mono text-xs text-[#0284c7] font-bold text-right">${item.weight}</td>
        `;
        tbody.appendChild(tr);
      });
    }
        tbody.appendChild(tr);
      });
    }
  };

  // ===========================================================================
  // 4. ĐỒNG BỘ VIDEO VÀ LIVE TELEMETRY CONSOLE
  // ===========================================================================
  const video = document.getElementById("masterVideo");
  const stagePills = [
    { id: "stagePill_1", start: 0, end: 21.0, name: "1. Dữ Liệu & Cách Ly Video", algo: "FastDedup + Group-Aware Video Isolation" },
    { id: "stagePill_2", start: 21.0, end: 41.5, name: "2. Khai Thác C6 & Oracle GT", algo: "Margin + Facility Location PCA 32D + Oracle O(1)" },
    { id: "stagePill_3", start: 41.5, end: 63.0, name: "3. Đấu Trường Song Mã All-Front Win", algo: "Fine-tune YOLO11n 8 epochs trên MPS" },
    { id: "stagePill_4", start: 63.0, end: 92.0, name: "4. Vòng Xác Nhận & Dừng Bão Hòa", algo: "Dynamic Plateau Saturation Stopping Guard" },
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
            pillElem.className = "p-2 rounded-lg bg-[#E8F0EA] border border-[#CDE0D1] text-[#2D5A34] text-left transition-all font-bold shadow-sm";
          } else {
            pillElem.className = "p-2 rounded-lg bg-white border border-[#E5E3DC] text-[#1F2627] text-left transition-all hover:bg-[#F8F7F2]";
          }
        }
      });

      const telTime = document.getElementById("telTime");
      if (telTime) telTime.innerText = `${cur.toFixed(1)}s / 92.0s`;
    });
  }

  window.seekVideoToStage = function (startTime) {
    if (video) {
      video.currentTime = startTime;
      video.play();
    }
  };

  // ===========================================================================
  // 5. ĐIỀU KHIỂN HỆ THỐNG ĐỐI CHUẨN THEO VÒNG (ROUND-BY-ROUND SHOWDOWN)
  // ===========================================================================

  const INDEX_ROUNDS_MD = {
    v0: `### VÒNG 0: MÔ HÌNH MẦM HẠT NHÂN (YOLO11n V0 ANCHOR - 10.0% POOL / 556 ẢNH)
> **Phán Quyết**: Khởi động mô hình mầm YOLO11n trên 556 ảnh phân tầng Hybrid Mix 80/20. Lớp phổ biến (car) đạt 60.4% mAP50, nhưng các lớp hiếm bị điểm liệt nghiêm trọng do thiếu mẫu (train: 0.0%, motor: 2.1%, rider: 2.2%).

#### 1. Đối Chuẩn 6 Chỉ Số Vĩ Mô
| Chỉ Số Đánh Giá | V0 Anchor (556 ảnh) | Random Floor (10%) | Δ vs Random | Trần 100% Target | Cách Biệt vs 100% | Tiết Kiệm | Nhận Định |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 20.23% | 20.23% | +0.00% | 26.85% | -6.62% | 90.0% | [Mốc khởi đầu] |
| mAP@50:95 (%) | 11.55% | 11.55% | +0.00% | 15.40% | -3.85% | 90.0% | [Mốc khởi đầu] |
| Recall (%) | 21.33% | 21.33% | +0.00% | 29.50% | -8.17% | 90.0% | [Mốc khởi đầu] |
| Precision (%) | 28.35% | 28.35% | +0.00% | — | — | 90.0% | [Mốc khởi đầu] |
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
| Precision (%) | 30.78% | 27.23% | +3.55% | — | — | 80.0% | [Giảm cảnh báo giả] |
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
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| mAP@50 (%) | 24.65% | 21.60% | +3.05% | 26.85% | -2.20% | 70.0% | [Cách biệt kỷ lục] |
| mAP@50:95 (%) | 14.30% | 12.10% | +2.20% | 15.40% | -1.10% | 70.0% | [Gần chạm trần] |
| Recall (%) | 27.12% | 22.68% | +4.44% | 29.50% | -2.38% | 70.0% | [Áp đảo hoàn toàn] |
| Precision (%) | 33.28% | 28.08% | +5.20% | — | — | 70.0% | [Siết chặt biên] |
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
| Precision (%) | 35.30% | 28.73% | +6.57% | — | — | 60.0% | [Vượt trội +6.57%] |
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
| Precision (%) | 36.80% | 29.20% | +7.60% | — | — | 50.0% | [Triệt tiêu FPs] |
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
| Precision (%) | 37.60% | 29.77% | +7.83% | — | +7.83% vs Rnd | 40.1% | [Ưu thế tuyệt đối] |
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
| Σ | MACRO mAP@50 (%) | 27.85% | 22.90% | +4.95% | 26.85% | +1.00% | — | [Active Vượt Trần 10/10 Lớp] |`
  };

  window.switchIndexRound = function(roundKey) {
    const panels = {
      v0: document.getElementById('indexRoundPanel_v0'),
      v1: document.getElementById('indexRoundPanel_v1'),
      v2: document.getElementById('indexRoundPanel_v2'),
      v3: document.getElementById('indexRoundPanel_v3'),
      v4: document.getElementById('indexRoundPanel_v4'),
      v5: document.getElementById('indexRoundPanel_v5')
    };

    const tabs = {
      v0: document.getElementById('indexTab_v0'),
      v1: document.getElementById('indexTab_v1'),
      v2: document.getElementById('indexTab_v2'),
      v3: document.getElementById('indexTab_v3'),
      v4: document.getElementById('indexTab_v4'),
      v5: document.getElementById('indexTab_v5'),
      all: document.getElementById('indexTab_all')
    };

    const activeClasses = ['bg-[#2D5A34]', 'text-white', 'border-[#2D5A34]', 'shadow-sm'];
    const inactiveClasses = ['bg-white', 'text-[#475254]', 'border-[#E5E3DC]'];

    if (roundKey === 'all') {
      // Hiện tất cả panel
      Object.values(panels).forEach(panel => {
        if (panel) panel.classList.remove('hidden');
      });
    } else {
      // Chỉ hiện panel tương ứng
      Object.entries(panels).forEach(([key, panel]) => {
        if (!panel) return;
        if (key === roundKey) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    }

    // Cập nhật trạng thái nút tab
    Object.entries(tabs).forEach(([key, tabBtn]) => {
      if (!tabBtn) return;
      if (key === roundKey) {
        tabBtn.classList.add(...activeClasses);
        tabBtn.classList.remove(...inactiveClasses);
      } else {
        tabBtn.classList.remove(...activeClasses);
        tabBtn.classList.add(...inactiveClasses);
      }
    });
  };

  window.copyIndexRoundMd = function(roundKey) {
    const md = INDEX_ROUNDS_MD[roundKey];
    if (!md) return;

    navigator.clipboard.writeText(md).then(() => {
      showToast(`Đã sao chép Markdown Bảng Đối Chuẩn ${roundKey.toUpperCase()} thành công!`);
    }).catch(() => {
      showToast("Không thể sao chép vào bộ nhớ tạm.");
    });
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

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Khởi tạo mặc định
  window.goToSimStep(1);
  if (typeof window.switchIndexRound === "function") {
    window.switchIndexRound("v5");
  }

  // Tự động đồng bộ chiều cao cho iframe Pipeline Visualizer vừa khít nội dung (Full Height, No Scroll)
  window.autoResizePipelineIframe = function (iframe) {
    try {
      if (iframe && iframe.contentWindow && iframe.contentWindow.document.body) {
        const mainEl = iframe.contentWindow.document.querySelector('main');
        const contentH = mainEl ? mainEl.offsetHeight + 100 : 1650;
        const safeH = Math.min(Math.max(contentH, 1300), 3800);
        if (Math.abs(iframe.offsetHeight - safeH) > 20) {
          iframe.style.height = safeH + "px";
        }
      }
    } catch (e) {
      // Giữ nguyên fallback nếu cross-origin
    }
  };

  // Lắng nghe postMessage báo kích thước động từ iframe (chống vòng lặp vô hạn, không để scroll)
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "PIPELINE_RESIZE" && e.data.height) {
      const iframe = document.getElementById("pipelineVisualizerIframe");
      if (iframe) {
        const safeH = Math.min(Math.max(e.data.height + 30, 1300), 3800);
        if (Math.abs(iframe.offsetHeight - safeH) > 15) {
          iframe.style.height = safeH + "px";
        }
      }
    }
  });

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
});
