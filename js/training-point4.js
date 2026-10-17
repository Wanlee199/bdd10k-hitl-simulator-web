/**
 * training-point4.js - Controller điều khiển tương tác trang chuyên đề Point 4
 * BDD10K Active Learning Lab — Phase 04: Seed V0 Training & Dual-Model Ablation Tournament
 * Thiết kế kế thừa chuẩn GreenSM Nordic Editorial
 */

document.addEventListener("DOMContentLoaded", () => {
  initVideoSimulator();
  initSmoothScroll();
});

// =========================================================================
// 1. VIDEO SIMULATOR CONTROLLER & LIVE TELEMETRY
// =========================================================================

const video = document.getElementById("trainingVideo");
const playOverlayBtn = document.getElementById("videoPlayOverlayBtn");
const playIconSvg = document.getElementById("playIconSvg");
const pauseIconSvg = document.getElementById("pauseIconSvg");
const ctrlPlaySvg = document.getElementById("ctrlPlaySvg");
const volumeSvg = document.getElementById("volumeSvg");
const timeDisplay = document.getElementById("timeDisplay");
const videoProgressBar = document.getElementById("videoProgressBar");

const telemetryStageTag = document.getElementById("telemetryStageTag");
const telemetryAlgoName = document.getElementById("telemetryAlgoName");
const telemetryComplexity = document.getElementById("telemetryComplexity");
const telemetryThroughput = document.getElementById("telemetryThroughput");
const telemetryMetricsList = document.getElementById("telemetryMetricsList");
const telemetryCodeBlock = document.getElementById("telemetryCodeBlock");
const stagePills = document.querySelectorAll(".stage-pill");

let currentStageIndex = 1;

const STAGE_CONFIGS = {
  1: {
    tag: "STAGE 1: SEED V0 & EXTREME IMBALANCE",
    algo: "Hybrid Mix 80/20 Seed Set & Severe 2,000:1 Imbalance Analyzer",
    complexity: "O(N) Ground-Truth Map Query",
    throughput: "500 ảnh mầm / 9.887 GT Boxes (Read-Only O(1))",
    metricsHtml: `
      <div class="flex justify-between"><span>Seed Pool Size:</span> <span class="font-bold text-[#2D5A34]">500 ảnh (~10% Pool)</span></div>
      <div class="flex justify-between"><span>Ground-Truth Boxes:</span> <span class="font-bold text-[#2D5A34]">9.887 đối chuẩn BDD10K</span></div>
      <div class="flex justify-between"><span>Lát cắt đêm (35%):</span> <span class="font-bold text-[#2D5A34]">175 ảnh (thiếu sáng, lóa pha)</span></div>
      <div class="flex justify-between"><span>Vật thể nhỏ (20%):</span> <span class="font-bold text-[#D97706]">100 ảnh (đèn, biển báo xa)</span></div>
      <div class="flex justify-between"><span>Che khuất cao (20%):</span> <span class="font-bold text-[#DC2626]">100 ảnh (xe cộ chồng lấn)</span></div>
      <div class="flex justify-between"><span>Ban ngày chuẩn (25%):</span> <span class="font-bold text-[#2D5A34]">125 ảnh tham chiếu</span></div>
      <div class="flex justify-between"><span>Tỷ lệ mất cân bằng:</span> <span class="font-bold text-[#DC2626]">2.000 : 1 (Car vs Train)</span></div>
    `,
    code: `# Chặng 1: Nạp 500 ảnh mầm Seed V0 và khảo sát mất cân bằng 2.000:1
seed_loader = SeedV0DatasetLoader(
    seed_dir="data/splits/seed_v0/images",
    metadata_path="data/bdd10k/bdd10k_metadata.json"
)
seed_manifest = seed_loader.verify_4slices_and_class_distribution()
assert len(seed_manifest) == 500
assert seed_manifest["class_counts"]["car"] == 5385
assert seed_manifest["class_counts"]["train"] == 2  # Mất cân bằng 2.692:1`
  },
  2: {
    tag: "STAGE 2: ABLATION TOURNAMENT SHOWDOWN",
    algo: "5-Recipes Ablation Tournament: AdamW + Cosine Annealing + Freeze 10L",
    complexity: "O(E * N_batch) Convergence Dynamics",
    throughput: "5 công thức đối đầu / 35 Epochs / 100% Hội tụ thực",
    metricsHtml: `
      <div class="flex justify-between"><span>Quán quân (Winner):</span> <span class="font-bold text-[#2D5A34]">Cfg-3 (AdamW + Cosine)</span></div>
      <div class="flex justify-between"><span>Điểm mAP@50 Đỉnh:</span> <span class="font-bold text-[#2D5A34]">20.23% (Cao nhất giải đấu)</span></div>
      <div class="flex justify-between"><span>Điểm mAP@50-95:</span> <span class="font-bold text-[#2D5A34]">10.35% (Vượt Naive +2.4%)</span></div>
      <div class="flex justify-between"><span>Điểm CBS Tổng Hợp:</span> <span class="font-bold text-[#2D5A34]">27.72 / 100</span></div>
      <div class="flex justify-between"><span>Backbone Freezing:</span> <span class="font-bold text-[#2D5A34]">Đóng băng 10 tầng đầu</span></div>
      <div class="flex justify-between"><span>Khoảng cách vượt Naive:</span> <span class="font-bold text-[#2D5A34]">+6.13% mAP50 (+43.5% tương đối)</span></div>
    `,
    code: `# Chặng 2: Khởi tranh Đấu Trường Cắt Bỏ 5 Công Thức Huấn Luyện
recipes = [
    NaiveSGDRecipe(lr=0.01, momentum=0.9, freeze=0, class_weights=False),
    BackboneFreezeRecipe(freeze_layers=10, lr=0.01),
    ClassWeightedLossRecipe(weights_vector=W_class_penalty),
    AdamWCosineRecipe(lr0=0.002, lrf=0.01, cos_lr=True, freeze=10), # Quán Quân
    FullProposedRecipe(combine_all_features=True)
]
tournament = AblationTournamentRunner(val_set="data/splits/fixed_val")
leaderboard, winner = tournament.evaluate_all(recipes)
assert winner.config_id == "cfg_3_adamw_cosine"  # mAP50 = 20.23%`
  },
  3: {
    tag: "STAGE 3: DUAL-MODEL CNN VS TRANSFORMER",
    algo: "Dual-Model Baseline Rigor: CNN YOLO11n (~2.6M) vs Transformer RT-DETR (~32M)",
    complexity: "Inductive Bias (CNN) vs Hungarian Matching (Transformer)",
    throughput: "151.5 FPS (YOLO11n MPS) vs 18.5 FPS (RT-DETR-L MPS)",
    metricsHtml: `
      <div class="flex justify-between"><span>YOLO11n mAP@50:</span> <span class="font-bold text-[#2D5A34]">20.23% (Mining Engine V0)</span></div>
      <div class="flex justify-between"><span>YOLO11n mAP@90:</span> <span class="font-bold text-[#2D5A34]">2.28% (Lớp Car đạt 10.21%)</span></div>
      <div class="flex justify-between"><span>RT-DETR mAP@50:</span> <span class="font-bold text-[#D97706]">0.12% (Counterpart Baseline)</span></div>
      <div class="flex justify-between"><span>Tham số (Params):</span> <span class="font-bold text-[#2D5A34]">2.58M vs 32.00M (Gọn 12.4x)</span></div>
      <div class="flex justify-between"><span>Tính toán (GFLOPs):</span> <span class="font-bold text-[#2D5A34]">6.4G vs 105.4G (Nhẹ 16.5x)</span></div>
      <div class="flex justify-between"><span>Độ trễ suy luận (MPS):</span> <span class="font-bold text-[#2D5A34]">1.2 ms/ảnh vs 42.2 ms/ảnh</span></div>
    `,
    code: `# Chặng 3: Đối chuẩn Song Mã CNN (YOLO11n) vs Vision Transformer (RT-DETR)
yolo_eval = evaluate_model("paper_v4_10k/models/yolo11n_v0_best.pt", "fixed_val")
rtdetr_eval = evaluate_model("paper_v4_10k/models/rtdetr_v0_best.pt", "fixed_val")

# Khẳng định vai trò phân định theo Điều 9 AGENTS.md
assert yolo_eval.map50 == 20.23    # Mining Engine khai thác mỏ Active Learning
assert rtdetr_eval.map50 == 0.12   # Counterpart Benchmark kiểm tra độ bứt phá`
  },
  4: {
    tag: "STAGE 4: HARD SLICES & ACTIVE VECTOR W_i",
    algo: "Hard Slice Error Gap Profiler & Inverse-Recall Active Weight Vector W_i",
    complexity: "O(1) Vector Derivation + SHA-256 Seal",
    throughput: "1.400 ảnh Test (13.508 objects) / Zero Overfitting Gap (0.42%)",
    metricsHtml: `
      <div class="flex justify-between"><span>Bỏ sót Vật thể nhỏ:</span> <span class="font-bold text-[#DC2626]">78.67% Error Gap (ĐỈNH)</span></div>
      <div class="flex justify-between"><span>Bỏ sót Che khuất:</span> <span class="font-bold text-[#DC2626]">78.49% Error Gap</span></div>
      <div class="flex justify-between"><span>Bỏ sót Ban đêm:</span> <span class="font-bold text-[#D97706]">78.15% Error Gap</span></div>
      <div class="flex justify-between"><span>Trọng số W_small:</span> <span class="font-bold text-[#2D5A34]">0.2509 (Ưu tiên số 1 Phase 05)</span></div>
      <div class="flex justify-between"><span>Trọng số W_occ:</span> <span class="font-bold text-[#2D5A34]">0.2504 (Ưu tiên số 2)</span></div>
      <div class="flex justify-between"><span>Trọng số W_day / W_night:</span> <span class="font-bold text-[#2D5A34]">0.2494 / 0.2493</span></div>
      <div class="flex justify-between"><span>Mã băm YOLO11n V0:</span> <span class="font-bold text-[#2D5A34]">fe8f632... (Niêm phong)</span></div>
    `,
    code: `# Chặng 4: Đánh giá bài thi kép trên Frozen Test và suy ra Vector W_i
hard_eval = HardSliceEvaluator(test_set="data/splits/fixed_test")
slice_gaps = hard_eval.compute_error_gaps(model="yolo11n_v0_best.pt")
W_i = hard_eval.derive_active_learning_steering_weights(slice_gaps)

# Bàn giao bất biến cho Phase 05: Active Mining Tournament
handover_manifest = {
    "winner_model": "yolo11n_v0_best.pt",
    "sha256": "fe8f63276ad5cacffeecec12c04c59fdb7485e7d9fe94206efdf85db7be03959",
    "steering_weights": W_i  # [0.2509, 0.2504, 0.2494, 0.2493]
}
export_handover("results/phase_04/v0_baseline_evaluation.json", handover_manifest)`
  }
};

function initVideoSimulator() {
  if (!video) return;

  // Cập nhật telemetry theo thời gian video
  video.addEventListener("timeupdate", () => {
    const curTime = video.currentTime;
    const dur = video.duration || 58.85;

    // Cập nhật thanh tiến trình & đồng hồ
    if (videoProgressBar) {
      const pct = (curTime / dur) * 100;
      videoProgressBar.style.width = `${pct}%`;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(curTime)} / ${formatTime(dur)}`;
    }

    // Xác định Stage theo timeline chính xác
    let newStage = 1;
    if (curTime >= 39.8) {
      newStage = 4;
    } else if (curTime >= 26.3) {
      newStage = 3;
    } else if (curTime >= 12.6) {
      newStage = 2;
    } else {
      newStage = 1;
    }

    if (newStage !== currentStageIndex) {
      currentStageIndex = newStage;
      updateTelemetryUI(newStage);
    }
  });

  // Xử lý nút Play/Pause overlay và control bar
  if (playOverlayBtn) {
    playOverlayBtn.addEventListener("click", togglePlay);
  }

  const ctrlPlayBtn = document.getElementById("ctrlPlayBtn");
  if (ctrlPlayBtn) {
    ctrlPlayBtn.addEventListener("click", togglePlay);
  }

  // Xử lý mute/unmute
  const ctrlVolumeBtn = document.getElementById("ctrlVolumeBtn");
  if (ctrlVolumeBtn) {
    ctrlVolumeBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      updateVolumeIcon(video.muted);
    });
  }

  // Xử lý click thanh timeline
  const progressContainer = document.getElementById("progressContainer");
  if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const dur = video.duration || 58.85;
      video.currentTime = pos * dur;
    });
  }

  // Xử lý click các Stage Pills
  stagePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetStage = parseInt(pill.dataset.stage, 10);
      let seekTime = 0;
      if (targetStage === 1) seekTime = 0;
      else if (targetStage === 2) seekTime = 12.6;
      else if (targetStage === 3) seekTime = 26.3;
      else if (targetStage === 4) seekTime = 39.8;

      video.currentTime = seekTime;
      if (video.paused) {
        video.play().catch(() => {});
        updatePlayIcons(true);
      }
      currentStageIndex = targetStage;
      updateTelemetryUI(targetStage);
    });
  });

  // Khởi tạo hiển thị Stage 1 ban đầu
  updateTelemetryUI(1);
}

function togglePlay() {
  if (!video) return;
  if (video.paused) {
    video.play().catch(() => {});
    updatePlayIcons(true);
  } else {
    video.pause();
    updatePlayIcons(false);
  }
}

function updatePlayIcons(isPlaying) {
  if (playOverlayBtn) {
    playOverlayBtn.classList.toggle("opacity-0", isPlaying);
    playOverlayBtn.classList.toggle("pointer-events-none", isPlaying);
  }
  if (playIconSvg && pauseIconSvg) {
    playIconSvg.classList.toggle("hidden", isPlaying);
    pauseIconSvg.classList.toggle("hidden", !isPlaying);
  }
  if (ctrlPlaySvg) {
    ctrlPlaySvg.innerHTML = isPlaying
      ? `<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>`
      : `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>`;
  }
}

function updateVolumeIcon(isMuted) {
  if (!volumeSvg) return;
  volumeSvg.innerHTML = isMuted
    ? `<path d="M11 5L6 9H2v6h4l5 4V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>`
    : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`;
}

function updateTelemetryUI(stageId) {
  const cfg = STAGE_CONFIGS[stageId];
  if (!cfg) return;

  if (telemetryStageTag) telemetryStageTag.textContent = cfg.tag;
  if (telemetryAlgoName) telemetryAlgoName.textContent = cfg.algo;
  if (telemetryComplexity) telemetryComplexity.textContent = cfg.complexity;
  if (telemetryThroughput) telemetryThroughput.textContent = cfg.throughput;
  if (telemetryMetricsList) telemetryMetricsList.innerHTML = cfg.metricsHtml;
  if (telemetryCodeBlock) telemetryCodeBlock.textContent = cfg.code;

  // Highlight pill đang active
  stagePills.forEach((p) => {
    const pStage = parseInt(p.dataset.stage, 10);
    if (pStage === stageId) {
      p.className = "stage-pill flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-[#2D5A34] text-white shadow-soft";
    } else {
      p.className = "stage-pill flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-white border border-[#E5E3DC] text-[#475254] hover:bg-[#F8F7F2]";
    }
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
