/**
 * active-mining-point5.js - Bộ Điều Khiển Tương Tác & Đồng Bộ Video Telemetry Point 5
 * Dự án: BDD10K ActiveLab (GreenSM Nordic Editorial Standard)
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoPlayerAndTelemetry();
  initAlgorithmWalkthrough();
});

// =============================================================================
// 1. VIDEO PLAYER & LIVE TELEMETRY DASHBOARD SYNC
// =============================================================================

function initVideoPlayerAndTelemetry() {
  const video = document.getElementById('miningVideo');
  if (!video) return;

  const playOverlayBtn = document.getElementById('videoPlayOverlayBtn');
  const playIconSvg = document.getElementById('playIconSvg');
  const pauseIconSvg = document.getElementById('pauseIconSvg');

  const ctrlPlayBtn = document.getElementById('ctrlPlayBtn');
  const ctrlPlaySvg = document.getElementById('ctrlPlaySvg');

  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('videoProgressBar');
  const timeDisplay = document.getElementById('timeDisplay');
  const ctrlVolumeBtn = document.getElementById('ctrlVolumeBtn');

  const stagePills = document.querySelectorAll('.stage-pill');

  // Telemetry Elements
  const stageTag = document.getElementById('telemetryStageTag');
  const algoName = document.getElementById('telemetryAlgoName');
  const complexity = document.getElementById('telemetryComplexity');
  const throughput = document.getElementById('telemetryThroughput');
  const metricsList = document.getElementById('telemetryMetricsList');
  const codeBlock = document.getElementById('telemetryCodeBlock');

  // Stage Definitions
  const STAGES = [
    {
      id: 1,
      start: 0.0,
      end: 12.5,
      tag: 'STAGE 1: UNLABELED POOL & MODEL V0 DEFICIT',
      algo: '4,394 Pool Item Feature Cache Ingestion & Model V0 Diagnostic',
      comp: 'PCA 32D Dense Embedding',
      thru: 'K = 250 / 4.394 Ảnh Thô',
      metrics: [
        '• Model V0 (500 ảnh mầm): Lớp Car đạt 60.40% mAP50 (7.401 boxes)',
        '• 6 Lớp Điểm Liệt: Truck 21.5%, Bus 16.5%, Bike 3.18%, Rider 2.2%, Motor 2.13%, Train 0.0%',
        '• Vector Điều Phối W_i: Small 0.2509, Occlusion 0.2504, Night 0.2493, Day 0.2494',
        '• Vấn Nạn Cốt Tử: Bốc ngẫu nhiên chỉ được 0.76 đối tượng hiếm/ảnh (tiếp tục bị liệt)!'
      ],
      code: `# Chẩn đoán Model V0 từ Phase 04
v0_metrics = load_p4_per_class("results/phase_04/tables/")
rare_deficit = [c for c in RARE_CLASSES if v0_metrics[c]['map50'] < 0.25]
print("6 Lớp Điểm Liệt:", rare_deficit)
# Output: ['truck', 'bus', 'motor', 'bike', 'rider', 'train']`
    },
    {
      id: 2,
      start: 12.5,
      end: 23.5,
      tag: 'STAGE 2: 4-STRATEGY TOURNAMENT EXECUTION',
      algo: 'Multi-Objective Candidate Scoring & Uncertainty Profiling',
      comp: 'O(K * N) Lazy Greedy Max-Heap',
      thru: '4 Chiến Lược / 0.039s',
      metrics: [
        '• C1: Random Baseline — 10 runs độc lập: 185.50 ± 18.07 vật thể hiếm (Floor)',
        '• C2: Pure Margin Uncertainty — U_i = 1 - (P1 - P2) -> Rơi vào bẫy tụ cụm outlier (R_cov = 7.48)',
        '• C3: Pure CoreSet k-Center — Cực tiểu hóa R_cov = 3.16 nhưng mù quáng trước lớp hiếm',
        '• C4: Super Fusion Proposed — [0.6*U + 0.4*D_QBC] * C_w * W_i + Facility Location'
      ],
      code: `# Khởi tạo Đấu trường 4 Chiến lược kinh điển
strategies = [
    RandomSamplingStrategy(seed=42),
    TopKPureUncertaintyStrategy(),
    PureCoreSetKCenterStrategy(),
    SuperFusionProposedStrategy() # C4 Proposed
]
results_map = {s.name: s.select(records, k=250) for s in strategies}`
    },
    {
      id: 3,
      start: 23.5,
      end: 38.5,
      tag: 'STAGE 3: GROUND-TRUTH CROSS-VERIFICATION',
      algo: 'O(1) BDD10K Metadata Lookup & Rare Penetration Scorer',
      comp: 'O(K) Read-Only Lookup',
      thru: '100% Khách Quan Tuyệt Đối',
      metrics: [
        '• C4 Super Fusion: Bắt trọn 655 VẬT THỂ HIẾM BDD10K (+253% so với Random 190)',
        '• Phân Rã Per-Class: 122 Truck, 88 Bus, 89 Motor, 192 Bike, 155 Rider, 9 Train!',
        '• Rare CPS: 2.62 đối tượng hiếm/ảnh (Gấp 3.45x so với Random 0.76)',
        '• Bán Kính Phủ R_cov = 6.45: Rải đều không gian PCA 32D, triệt tiêu bẫy trùng lặp'
      ],
      code: `# Chấm thi Ground-Truth thật O(1)
for img in c4_result.selected_images:
    stem = Path(img).stem
    gt_item = bdd10k_metadata[stem] # Read-Only
    for obj in gt_item.get('objects', []):
        if obj['category'] in RARE_CLASSES:
            rare_counts[obj['category']] += 1
# Total: 655 rare objects (Winner CSS = 77.20)`
    },
    {
      id: 4,
      start: 38.5,
      end: 48.5,
      tag: 'STAGE 4: ZERO LABEL NOISE CURATION & DATASET V1',
      algo: 'Symlink Materialization 0 KB Disk Overhead & Manifest V1 Sign',
      comp: 'O(1) Symbolic Link Creation',
      thru: '750 Ảnh V1 Sẵn Sàng Phase 06',
      metrics: [
        '• Cổng Kiểm Soát Chất Lượng: Precision V0 < 40% -> Khóa 100% Pre-labeling',
        '• Cấp Nhãn Vàng BDD10K: 100% 250 ảnh trúng tuyển bảo đảm Zero Label Noise',
        '• Đóng Gói Dataset V1: 500 ảnh Seed V0 + 250 ảnh C4 Mined = 750 ảnh huấn luyện',
        '• Symlink Materialization: Mức tăng dung lượng đĩa = 0 KB, sẵn sàng cho Phase 06'
      ],
      code: `# Đóng gói Dataset V1 bằng Symlink (0 KB đĩa)
v1_images = list(dict.fromkeys(seed_v0_imgs + c4_mined_imgs))
assert len(v1_images) == 750
for img in v1_images:
    (train_v1_dir / img).symlink_to(bdd10k_train / img)
save_manifest("results/phase_05/manifest_v1.yaml")
# READY FOR PHASE 06 YOLO11N V1 TRAINING!`
    }
  ];

  let currentStageId = 1;

  // Toggle Play / Pause
  function togglePlay() {
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }

  if (playOverlayBtn) playOverlayBtn.addEventListener('click', togglePlay);
  if (ctrlPlayBtn) ctrlPlayBtn.addEventListener('click', togglePlay);

  video.addEventListener('play', () => {
    if (playIconSvg) playIconSvg.classList.add('hidden');
    if (pauseIconSvg) pauseIconSvg.classList.remove('hidden');
    if (ctrlPlaySvg) ctrlPlaySvg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    if (playOverlayBtn) playOverlayBtn.classList.add('opacity-0');
  });

  video.addEventListener('pause', () => {
    if (playIconSvg) playIconSvg.classList.remove('hidden');
    if (pauseIconSvg) pauseIconSvg.classList.add('hidden');
    if (ctrlPlaySvg) ctrlPlaySvg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    if (playOverlayBtn) playOverlayBtn.classList.remove('opacity-0');
  });

  // Volume toggle
  if (ctrlVolumeBtn) {
    ctrlVolumeBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      ctrlVolumeBtn.style.opacity = video.muted ? '0.5' : '1.0';
    });
  }

  // Time format helper
  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Update Progress & Telemetry Sync
  video.addEventListener('timeupdate', () => {
    const curr = video.currentTime;
    const dur = video.duration || 48.5;

    // Progress Bar
    if (progressBar) {
      const pct = (curr / dur) * 100;
      progressBar.style.width = `${pct}%`;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${fmtTime(curr)} / ${fmtTime(dur)}`;
    }

    // Identify Current Stage
    let activeStage = STAGES[0];
    for (const st of STAGES) {
      if (curr >= st.start && curr < st.end) {
        activeStage = st;
        break;
      }
    }
    if (curr >= STAGES[3].end) activeStage = STAGES[3];

    // Update Stage Pills Active State
    if (activeStage.id !== currentStageId) {
      currentStageId = activeStage.id;
      updateTelemetryUI(activeStage);
    }
  });

  // Seek Progress
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const dur = video.duration || 48.5;
      video.currentTime = pos * dur;
    });
  }

  // Stage Pills Jump
  stagePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const stageNum = parseInt(pill.getAttribute('data-stage'), 10);
      const targetStage = STAGES.find(s => s.id === stageNum);
      if (targetStage) {
        video.currentTime = targetStage.start + 0.1;
        video.play();
      }
    });
  });

  // Update UI Elements
  function updateTelemetryUI(stage) {
    // Pills Styling
    stagePills.forEach(pill => {
      const sNum = parseInt(pill.getAttribute('data-stage'), 10);
      if (sNum === stage.id) {
        pill.className = 'stage-pill flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-[#2D5A34] text-white shadow-soft';
      } else {
        pill.className = 'stage-pill flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-white border border-[#E5E3DC] text-[#475254] hover:bg-[#F8F7F2]';
      }
    });

    // Telemetry text
    stageTag.textContent = stage.tag;
    algoName.textContent = stage.algo;
    complexity.textContent = stage.comp;
    throughput.textContent = stage.thru;

    // Metrics list
    metricsList.innerHTML = stage.metrics.map(m => `<div>${m}</div>`).join('');

    // Code block
    codeBlock.textContent = stage.code;
  }

  // Initial Telemetry Render
  updateTelemetryUI(STAGES[0]);
}

// =============================================================================
// 2. INTERACTIVE ALGORITHM WALKTHROUGH CONTROLLER
// =============================================================================

function initAlgorithmWalkthrough() {
  const contentArea = document.getElementById('wtContentArea');
  const prevBtn = document.getElementById('wtPrevBtn');
  const nextBtn = document.getElementById('wtNextBtn');
  const playBtn = document.getElementById('wtPlayBtn');
  const tabs = document.querySelectorAll('.wt-step-tab');

  if (!contentArea || !tabs.length) return;

  const STEPS = [
    {
      step: 1,
      title: 'Bước 1: Trích Xuất Đặc Trưng Đa Mô Hình (Feature & Uncertainty Extraction)',
      subtitle: 'Quét inference liên kiến trúc trên 4.394 ảnh thô',
      input: 'Kho 4.394 ảnh Unlabeled Pool + Checkpoints YOLO11n V0 & RT-DETR V0',
      action: 'Chạy suy luận song mã: trích xuất Margin Uncertainty U_i = 1 - (P1 - P2) từ YOLO11n, đo độ bất đồng Hungarian Matching D_i^QBC với RT-DETR, và trích xuất vector Global Average Pooling giảm chiều PCA 32D.',
      output: 'unlabeled_pool_feature_cache.json (4.394 bản ghi 32D)',
      code: `def extract_features(img):\n    yolo_res = yolo_model(img)\n    rtdetr_res = rtdetr_model(img)\n    u_i = 1.0 - (top1_conf - top2_conf)\n    d_qbc = compute_iou_disagreement(yolo_res, rtdetr_res)\n    pca_32d = pca_transform(backbone_gap_embedding)\n    return PoolItemRecord(u_i, d_qbc, pca_32d)`
    },
    {
      step: 2,
      title: 'Bước 2: Chấm Điểm Tuyển Chọn Đa Mục Tiêu (Multi-Objective Candidate Scoring)',
      subtitle: 'Đặc trị 6 lớp điểm liệt kết hợp ma trận lát cắt khó W_i',
      input: 'Bản ghi đặc trưng 4.394 ảnh + Hệ số thâm hụt C_w + Vector điều phối W_i',
      action: 'Kích hoạt hệ số phạt thâm hụt lớp C_w (train x20, rider x15, motor x15, bike x10, bus x5, truck x4) kết hợp trọng số lát cắt khó W_i (Small 0.2509, Occlusion 0.2504, Night 0.2493) để tính điểm ưu tiên cho từng ứng viên.',
      output: 'Bảng điểm sơ bộ S(x_i) cho 4.394 ảnh',
      code: `score = (0.6 * r.margin_uncertainty + 0.4 * r.qbc_disagreement)\nscore *= r.class_deficit_score # C_w(c)\nscore *= r.slice_weight        # W_i\nscore /= (1.0 + 0.05 * r.num_boxes) # Phạt tràn viền`
    },
    {
      step: 3,
      title: 'Bước 3: Tối Ưu Hóa Submodular Facility Location (Lazy Greedy Selection)',
      subtitle: 'Tuyển chọn đúng K = 250 ảnh, rải đều không gian biểu diễn',
      input: 'Ứng viên có điểm cao + Ma trận khoảng cách Euclidean trên PCA 32D',
      action: 'Áp dụng thuật toán Lazy Greedy với hàng đợi ưu tiên Max-Heap để giải hàm mục tiêu chọn vị trí cơ sở. Mỗi ảnh được bốc phải vừa có điểm thông tin cao, vừa tối đa hóa độ bao phủ không gian và không bị trùng lặp góc máy với các ảnh đã chọn.',
      output: '250 image_ids trúng tuyển (R_cov = 6.45)',
      code: `selected = []\nheap = [(-marginal_gain(i, selected), i) for i in candidates]\nwhile len(selected) < 250:\n    gain, best_idx = heapq.heappop(heap)\n    selected.append(best_idx)\n    # Lazy update marginal gains`
    },
    {
      step: 4,
      title: 'Bước 4: Cấp Nhãn Vàng BDD10K & Đóng Gói Dataset V1 (Zero Label Noise)',
      subtitle: 'Khóa pre-labeling tự động, vật liệu hóa 750 ảnh Symlink',
      input: '250 ảnh trúng tuyển + 500 ảnh mầm Seed V0 + bdd10k_metadata.json (Read-Only)',
      action: 'Chủ động khóa pre-labeling tự động vì Precision V0 ở các lớp hiếm < 40%. Truy xuất trực tiếp nhãn vàng chuẩn BDD10K ($O(1)$) để cấp cho 250 ảnh mới, tạo symlink tại data/splits/train_v1/images/ (0 KB đĩa) và niêm phong manifest_v1.yaml.',
      output: 'train_v1 (750 ảnh = 500 Seed V0 + 250 Mined C4) + manifest_v1.yaml',
      code: `for img in v1_750_images:\n    symlink_to_source(img, dst="data/splits/train_v1/images/")\nwrite_manifest("results/phase_05/manifest_v1.yaml")\n# BÀN GIAO SẴN SÀNG CHO PHASE 06 HUẤN LUYỆN YOLO11N V1!`
    }
  ];

  let currentStep = 1;
  let autoPlayTimer = null;

  function renderStep(stepNum) {
    const data = STEPS.find(s => s.step === stepNum) || STEPS[0];
    currentStep = data.step;

    // Update tabs styling
    tabs.forEach(t => {
      const s = parseInt(t.getAttribute('data-step'), 10);
      if (s === currentStep) {
        t.className = 'wt-step-tab cursor-pointer text-center p-2 rounded-xl transition-all bg-[#E8F0EA] border border-[#2D5A34]';
        t.querySelector('div:first-child').className = 'text-[10px] font-mono font-bold text-[#2D5A34]';
      } else {
        t.className = 'wt-step-tab cursor-pointer text-center p-2 rounded-xl transition-all bg-white border border-[#E5E3DC] hover:bg-[#F8F7F2]';
        t.querySelector('div:first-child').className = 'text-[10px] font-mono font-bold text-[#6B7677]';
      }
    });

    // Render content
    contentArea.innerHTML = `
      <!-- Cột Trái: Diễn giải -->
      <div class="space-y-4">
        <div>
          <div class="text-[10px] font-mono font-bold text-[#2D5A34] uppercase tracking-wider">${data.subtitle}</div>
          <h3 class="font-editorial text-xl font-bold text-[#1F2627] mt-1">${data.title}</h3>
        </div>

        <div class="space-y-2.5 text-xs font-mono">
          <div class="p-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC]">
            <span class="font-bold text-[#6B7677] uppercase text-[10px] block">Dữ Liệu Đầu Vào (Input):</span>
            <span class="text-[#1F2627] mt-0.5 block">${data.input}</span>
          </div>

          <div class="p-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC]">
            <span class="font-bold text-[#2D5A34] uppercase text-[10px] block">Thao Tác Thuật Toán (Transformation):</span>
            <span class="text-[#303A3B] mt-0.5 block leading-relaxed">${data.action}</span>
          </div>

          <div class="p-3 rounded-xl bg-[#E8F0EA] border border-[#CDE0D1]">
            <span class="font-bold text-[#2D5A34] uppercase text-[10px] block">Kết Quả Đầu Ra (Output):</span>
            <span class="text-[#2D5A34] font-bold mt-0.5 block">${data.output}</span>
          </div>
        </div>
      </div>

      <!-- Cột Phải: Code Box -->
      <div class="p-4 rounded-xl bg-[#1F2627] text-white shadow-soft space-y-2">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <span class="text-[10px] font-mono text-[#10b981] font-bold uppercase">Python Source Pseudocode (Step ${data.step})</span>
          <span class="text-[9px] font-mono text-gray-400">src/active_mining.py</span>
        </div>
        <pre class="font-mono text-[11px] leading-relaxed text-gray-200 overflow-x-auto max-h-56 p-1">${data.code}</pre>
      </div>
    `;

    // Trigger KaTeX if exists
    if (window.renderMathInElement) {
      window.renderMathInElement(contentArea, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }
  }

  // Next / Prev
  prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    const nextS = currentStep > 1 ? currentStep - 1 : 4;
    renderStep(nextS);
  });

  nextBtn.addEventListener('click', () => {
    stopAutoPlay();
    const nextS = currentStep < 4 ? currentStep + 1 : 1;
    renderStep(nextS);
  });

  // Tab click
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      stopAutoPlay();
      const s = parseInt(t.getAttribute('data-step'), 10);
      renderStep(s);
    });
  });

  // Auto play
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      playBtn.textContent = 'Tự Động Chạy';
      playBtn.className = 'px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#2D5A34] text-white hover:bg-[#234729] transition-colors shadow-soft';
    }
  }

  playBtn.addEventListener('click', () => {
    if (autoPlayTimer) {
      stopAutoPlay();
    } else {
      playBtn.textContent = 'Tạm Dừng ⏸';
      playBtn.className = 'px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#b91c1c] text-white hover:bg-[#991b1b] transition-colors shadow-soft';
      autoPlayTimer = setInterval(() => {
        const nextS = currentStep < 4 ? currentStep + 1 : 1;
        renderStep(nextS);
      }, 3500);
    }
  });

  // Initial render
  renderStep(1);
}
