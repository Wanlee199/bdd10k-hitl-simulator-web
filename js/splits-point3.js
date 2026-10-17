/**
 * splits-point3.js - Controller điều khiển tương tác trang chuyên đề Point 3
 * BDD10K Active Learning Lab — Phase 03: Shared Frozen Test & Val Splits
 * Thiết kế kế thừa chuẩn GreenSM Nordic Editorial
 */

document.addEventListener("DOMContentLoaded", () => {
  initVideoSimulator();
  initSmoothScroll();
});

// =========================================================================
// 1. VIDEO SIMULATOR CONTROLLER & LIVE TELEMETRY
// =========================================================================

const video = document.getElementById("splitsVideo");
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
    tag: "STAGE 1: 5D FEATURE INGESTION",
    algo: "5D Feature Extractor & Video Sequence Grouper",
    complexity: "O(N) Sequential Traversal",
    throughput: "6.994 ảnh / 0.18s (38.855 FPS)",
    metricsHtml: `
      <div class="flex justify-between"><span>Unique Pool Size:</span> <span class="font-bold text-[#2D5A34]">6.994 ảnh</span></div>
      <div class="flex justify-between"><span>Video Sequences:</span> <span class="font-bold text-[#2D5A34]">4.277 cụm độc lập</span></div>
      <div class="flex justify-between"><span>Feature Dimensions:</span> <span class="font-bold text-[#2D5A34]">5 trục vật lý định lượng</span></div>
      <div class="flex justify-between"><span>Lát cắt đêm (is_night):</span> <span class="font-bold text-[#D97706]">YCbCr P50 Median &lt; 45</span></div>
    `,
    code: `# Chặng 1: Nạp 5D features và gom cụm chuỗi Video
splitter = GroupAwareVideoSplitter(
    unique_pool_dir="data/processed/unique_pool",
    manifest_path="data_profiling_manifest.json"
)
video_records = splitter.group_by_video_sequences()
assert len(video_records) == 4277  # 100% video sequences gom cụm thành công`
  },
  2: {
    tag: "STAGE 2: TOURNAMENT SHOWDOWN",
    algo: "Submodular Facility Location (80%) + Gonzalez Minimax k-Center (20%)",
    complexity: "O(K·N) Lazy Greedy + O(K·N) Core-Set",
    throughput: "6 chiến lược đối đầu / 1.42s",
    metricsHtml: `
      <div class="flex justify-between"><span>Quán quân (Winner):</span> <span class="font-bold text-[#2D5A34]">5. Hybrid Mix 80/20</span></div>
      <div class="flex justify-between"><span>Điểm CBS Tổng Hợp:</span> <span class="font-bold text-[#2D5A34]">93.6 / 100</span></div>
      <div class="flex justify-between"><span>Bán kính phủ R_cov:</span> <span class="font-bold text-[#2D5A34]">3.35 (Thấp nhất giải đấu)</span></div>
      <div class="flex justify-between"><span>Điểm dàn đều F_score:</span> <span class="font-bold text-[#2D5A34]">0.971 (Cân bằng mật độ)</span></div>
      <div class="flex justify-between"><span>Bảo tồn danh mục:</span> <span class="font-bold text-[#2D5A34]">10/10 lớp đối tượng</span></div>
    `,
    code: `# Chặng 2: Khởi chạy Tournament 6 Chiến Lược
strategies = [
    RandomGroupSplitter(seed=42),
    DirectMetadataStratifiedSplitter(seed=42),
    StratifiedKCenterSplitter(seed=42),
    SubmodularFacilityLocationSplitter(seed=42),
    HybridMixedSplitter(facility_ratio=0.80, name="5. Hybrid Mix 80/20"),
    HybridMixedSplitter(facility_ratio=0.70, name="6. Hybrid Mix 70/30"),
]
eval_records, results_map, winner = evaluator.run_tournament(strategies)
assert winner == "5. Hybrid Mix 80/20"  # CBS = 93.6`
  },
  3: {
    tag: "STAGE 3: ANTI-LEAKAGE DUAL AUDIT",
    algo: "Group-Aware Sequence Splitter & pHash 64-bit Hamming Scanner",
    complexity: "O(V_seq) Group Isolation + O(N_test·N_pool) C-Scan",
    throughput: "13.454.400 cặp quét trong 4.13s (3.25M cặp/giây)",
    metricsHtml: `
      <div class="flex justify-between"><span>Video Overlap Test vs Val:</span> <span class="font-bold text-[#2D5A34]">0 video (0.00%)</span></div>
      <div class="flex justify-between"><span>Video Overlap Test vs Pool:</span> <span class="font-bold text-[#2D5A34]">0 video (0.00%)</span></div>
      <div class="flex justify-between"><span>pHash Scanned Pairs:</span> <span class="font-bold text-[#2D5A34]">13.454.400 cặp</span></div>
      <div class="flex justify-between"><span>Khoảng cách Min HD:</span> <span class="font-bold text-[#2D5A34]">6 bit (&ge; 5 bit chuẩn an toàn)</span></div>
      <div class="flex justify-between"><span>Số cặp vi phạm HD &lt; 5:</span> <span class="font-bold text-[#2D5A34]">0 cặp tuyệt đối (PASS)</span></div>
    `,
    code: `# Chặng 3: Rào Chắn Kiểm Toán Rò Rỉ Kép 4 Chiều
auditor = AntiLeakageAuditor(winner_result)
audit_report = auditor.audit_all()

assert audit_report["video_sequence_isolation"]["status"] == "PASS"
assert audit_report["phash_cross_hamming_scan"]["total_violations"] == 0
assert audit_report["phash_cross_hamming_scan"]["test_vs_pool_min_hd"] >= 5`
  },
  4: {
    tag: "STAGE 4: IMMUTABLE HANDOVER",
    algo: "Symlink Split Materializer & SHA-256 Checksum Sealer",
    complexity: "O(1) Inode Symlink Linking",
    throughput: "13.988 symlinks / 0.22s (Zero Storage Overhead)",
    metricsHtml: `
      <div class="flex justify-between"><span>Fixed Test Set:</span> <span class="font-bold text-[#2563EB]">1.400 ảnh (20.0%)</span></div>
      <div class="flex justify-between"><span>Fixed Val Set:</span> <span class="font-bold text-[#2D5A34]">700 ảnh (10.0%)</span></div>
      <div class="flex justify-between"><span>Seed V0 Set:</span> <span class="font-bold text-[#D97706]">500 ảnh (7.1%)</span></div>
      <div class="flex justify-between"><span>Unlabeled Pool:</span> <span class="font-bold text-[#1F2627]">4.394 ảnh (62.8%)</span></div>
      <div class="flex justify-between"><span>Dung lượng đĩa phụ trội:</span> <span class="font-bold text-[#2D5A34]">0 KB (Zero Overhead)</span></div>
      <div class="flex justify-between"><span>Broken Symlinks:</span> <span class="font-bold text-[#2D5A34]">0 links (100% OK)</span></div>
    `,
    code: `# Chặng 4: Tạo Symlinks 0 KB & Niêm Phong SHA-256 Seal
materializer = SymlinkSplitMaterializer(splits_dir="data/splits")
mat_summary = materializer.materialize(winner_result)

sealer = SHA256ChecksumSealer(splits_dir="data/splits")
seal_path = sealer.seal("data/splits/reports/splits_manifest.json")
# SHA-256: 445c31e6c1324213f1d71d7a47fe339c29fbefab...`
  }
};

function initVideoSimulator() {
  if (!video) return;

  video.addEventListener("timeupdate", onVideoTimeUpdate);
  video.addEventListener("play", updatePlayIcons);
  video.addEventListener("pause", updatePlayIcons);
  video.addEventListener("ended", () => {
    updatePlayIcons();
    if (videoProgressBar) videoProgressBar.style.width = "100%";
  });

  // Tự động tải metadata
  video.addEventListener("loadedmetadata", () => {
    updateTimeDisplay();
  });
}

function onVideoTimeUpdate() {
  const t = video.currentTime;
  const dur = video.duration || 44.04;

  // Cập nhật progress bar
  const pct = (t / dur) * 100;
  if (videoProgressBar) {
    videoProgressBar.style.width = `${pct}%`;
  }

  updateTimeDisplay();

  // Xác định Chặng hiện tại
  let stageIdx = 1;
  if (t < 11.0) {
    stageIdx = 1;
  } else if (t < 22.5) {
    stageIdx = 2;
  } else if (t < 33.5) {
    stageIdx = 3;
  } else {
    stageIdx = 4;
  }

  if (stageIdx !== currentStageIndex) {
    currentStageIndex = stageIdx;
    updateTelemetry(stageIdx);
  }
}

function updateTelemetry(stageIdx) {
  const cfg = STAGE_CONFIGS[stageIdx];
  if (!cfg) return;

  if (telemetryStageTag) telemetryStageTag.textContent = cfg.tag;
  if (telemetryAlgoName) telemetryAlgoName.textContent = cfg.algo;
  if (telemetryComplexity) telemetryComplexity.textContent = cfg.complexity;
  if (telemetryThroughput) telemetryThroughput.textContent = cfg.throughput;
  if (telemetryMetricsList) telemetryMetricsList.innerHTML = cfg.metricsHtml;
  if (telemetryCodeBlock) telemetryCodeBlock.innerHTML = `<code>${escapeHtml(cfg.code)}</code>`;

  // Update pills
  stagePills.forEach(p => {
    const s = parseInt(p.getAttribute("data-stage"));
    if (s === stageIdx) {
      p.classList.add("bg-[#2D5A34]", "text-white", "shadow-soft-sm");
      p.classList.remove("bg-white", "text-[#475254]");
    } else {
      p.classList.remove("bg-[#2D5A34]", "text-white", "shadow-soft-sm");
      p.classList.add("bg-white", "text-[#475254]");
    }
  });
}

function updateTimeDisplay() {
  if (!timeDisplay || !video) return;
  const cur = formatTime(video.currentTime);
  const total = formatTime(video.duration || 44.04);
  timeDisplay.textContent = `${cur} / ${total}`;
}

function formatTime(sec) {
  const s = Math.floor(sec || 0);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

function togglePlay() {
  if (!video) return;
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

function updatePlayIcons() {
  if (!video) return;
  const isPaused = video.paused || video.ended;

  if (playIconSvg) playIconSvg.classList.toggle("hidden", !isPaused);
  if (pauseIconSvg) pauseIconSvg.classList.toggle("hidden", isPaused);

  if (ctrlPlaySvg) {
    if (isPaused) {
      ctrlPlaySvg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    } else {
      ctrlPlaySvg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    }
  }

  if (playOverlayBtn) {
    playOverlayBtn.style.opacity = isPaused ? "1" : "0";
    playOverlayBtn.style.pointerEvents = isPaused ? "auto" : "none";
  }
}

function toggleMute() {
  if (!video) return;
  video.muted = !video.muted;
  if (volumeSvg) {
    if (video.muted) {
      volumeSvg.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M23 9l-6 6"/><path d="M17 9l6 6"/>';
    } else {
      volumeSvg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
    }
  }
}

function seekToStage(timeSec) {
  if (!video) return;
  video.currentTime = timeSec;
  video.play();
}

function seekByClick(e) {
  if (!video) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, clickX / rect.width));
  const dur = video.duration || 44.04;
  video.currentTime = pct * dur;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// =========================================================================
// 2. SMOOTH SCROLLING
// =========================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}
