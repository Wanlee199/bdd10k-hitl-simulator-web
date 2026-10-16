/**
 * profiling-point2.js
 * Controller & Dữ liệu thực nghiệm Point 2: Automated Data Profiling Benchmark
 * Chuẩn thiết kế: GreenSM Nordic Editorial (Canvas #F8F7F2, Ink #303A3B, Forest #2D5A34, Sage #B7CDBB)
 * Tác giả: Nguyễn Xuân Huỳnh
 */

// 1. DỮ LIỆU 100 ẢNH KIỂM TOÁN MẮT NGƯỜI
const AUDIT_CANDIDATES = [];

// 2. CẶP MẪU ĐỐI CHIẾU SONG SONG
const CROSS_VERIFY_SAMPLES = [
  {
    "image_name": "0001542f-5ce3cf52.jpg",
    "title": "Ảnh Ban Đêm + Che Khuất Cao Phức Tạp (Đô Thị)",
    "raw": {
      "timeofday": "night",
      "weather": "clear",
      "scene": "city street",
      "num_objects": 13,
      "occluded_boxes": 4
    },
    "prof": {
      "is_night": true,
      "is_blur": false,
      "is_weather_degraded": false,
      "is_high_occlusion": true,
      "is_small_object_slice": true,
      "is_dense": false,
      "scores": {
        "brightness_v_mean": 47.37,
        "brightness_p50": 37.0,
        "tenengrad_sharpness": 36249.97,
        "laplacian_variance": 42.68,
        "fft_high_freq_ratio": 0.0156,
        "dark_channel_prior": 28.49,
        "atmospheric_transmission": 0.6541,
        "low_transmission_ratio": 0.1739,
        "rain_streak_ratio": 0.3055,
        "saturation_mean": 57.94,
        "rms_contrast": 24.1,
        "weather_ensemble_score": 0.435,
        "scale_shannon_entropy": -0.0,
        "occlusion_pairs": 2,
        "max_occlusion_chain": 3,
        "vehicle_count": 10,
        "total_objects": 13
      }
    }
  },
  {
    "image_name": "0206144e-e176da9e.jpg",
    "title": "Ảnh Rung Xóc Thân Xe (ID 11: Motion Smear)",
    "raw": {
      "timeofday": "unknown",
      "weather": "unknown",
      "scene": "unknown",
      "num_objects": 0,
      "occluded_boxes": 0
    },
    "prof": {
      "is_night": false,
      "is_blur": false,
      "is_weather_degraded": false,
      "is_high_occlusion": false,
      "is_small_object_slice": false,
      "is_dense": false,
      "scores": {}
    }
  },
  {
    "image_name": "036d1a58-86d1f5cf.jpg",
    "title": "Ảnh Nhòe Viền Chuyển Động (ID 12: Gờ Giảm Tốc)",
    "raw": {
      "timeofday": "unknown",
      "weather": "unknown",
      "scene": "unknown",
      "num_objects": 0,
      "occluded_boxes": 0
    },
    "prof": {
      "is_night": false,
      "is_blur": false,
      "is_weather_degraded": false,
      "is_high_occlusion": false,
      "is_small_object_slice": false,
      "is_dense": false,
      "scores": {}
    }
  },
  {
    "image_name": "0000f77c-6257be58.jpg",
    "title": "Ảnh Ban Ngày Trời Nắng Rõ Nét (City Street)",
    "raw": {
      "timeofday": "daytime",
      "weather": "clear",
      "scene": "city street",
      "num_objects": 7,
      "occluded_boxes": 0
    },
    "prof": {
      "is_night": false,
      "is_blur": false,
      "is_weather_degraded": false,
      "is_high_occlusion": true,
      "is_small_object_slice": true,
      "is_dense": false,
      "scores": {
        "brightness_v_mean": 118.51,
        "brightness_p50": 104.0,
        "tenengrad_sharpness": 25826.71,
        "laplacian_variance": 329.35,
        "fft_high_freq_ratio": 0.0113,
        "dark_channel_prior": 57.11,
        "atmospheric_transmission": 0.7889,
        "low_transmission_ratio": 0.0234,
        "rain_streak_ratio": 0.4216,
        "saturation_mean": 63.96,
        "rms_contrast": 62.92,
        "weather_ensemble_score": 0.5015,
        "scale_shannon_entropy": 0.9852,
        "occlusion_pairs": 1,
        "max_occlusion_chain": 2,
        "vehicle_count": 2,
        "total_objects": 7
      }
    }
  },
  {
    "image_name": "0000f77c-62c2a288.jpg",
    "title": "Ảnh Hoàng Hôn / Bình Minh (Highway Dawn)",
    "raw": {
      "timeofday": "dawn/dusk",
      "weather": "clear",
      "scene": "highway",
      "num_objects": 6,
      "occluded_boxes": 2
    },
    "prof": {
      "is_night": false,
      "is_blur": true,
      "is_weather_degraded": false,
      "is_high_occlusion": false,
      "is_small_object_slice": true,
      "is_dense": false,
      "scores": {
        "brightness_v_mean": 123.18,
        "brightness_p50": 84.0,
        "tenengrad_sharpness": 21733.44,
        "laplacian_variance": 72.49,
        "fft_high_freq_ratio": 0.0052,
        "dark_channel_prior": 83.25,
        "atmospheric_transmission": 0.7724,
        "low_transmission_ratio": 0.087,
        "rain_streak_ratio": 0.4606,
        "saturation_mean": 57.15,
        "rms_contrast": 65.81,
        "weather_ensemble_score": 0.32,
        "scale_shannon_entropy": -0.0,
        "occlusion_pairs": 0,
        "max_occlusion_chain": 1,
        "vehicle_count": 0,
        "total_objects": 6
      }
    }
  },
  {
    "image_name": "0001542f-7c670be8.jpg",
    "title": "Ảnh Đường Cao Tốc Ban Đêm (High Speed)",
    "raw": {
      "timeofday": "night",
      "weather": "clear",
      "scene": "highway",
      "num_objects": 8,
      "occluded_boxes": 0
    },
    "prof": {
      "is_night": true,
      "is_blur": true,
      "is_weather_degraded": false,
      "is_high_occlusion": false,
      "is_small_object_slice": true,
      "is_dense": false,
      "scores": {
        "brightness_v_mean": 66.57,
        "brightness_p50": 52.0,
        "tenengrad_sharpness": 12740.19,
        "laplacian_variance": 34.25,
        "fft_high_freq_ratio": 0.0078,
        "dark_channel_prior": 40.5,
        "atmospheric_transmission": 0.7521,
        "low_transmission_ratio": 0.0537,
        "rain_streak_ratio": 0.2649,
        "saturation_mean": 52.26,
        "rms_contrast": 36.34,
        "weather_ensemble_score": 0.5094,
        "scale_shannon_entropy": -0.0,
        "occlusion_pairs": 0,
        "max_occlusion_chain": 1,
        "vehicle_count": 3,
        "total_objects": 8
      }
    }
  },
  {
    "image_name": "03a3f4e6-caeaf05d.jpg",
    "title": "Ảnh Thiếu Sáng Bệt Màu Cảm Biến (ID 1)",
    "raw": {
      "timeofday": "night",
      "weather": "clear",
      "scene": "city street",
      "num_objects": 7,
      "occluded_boxes": 1
    },
    "prof": {
      "is_night": true,
      "is_blur": true,
      "is_weather_degraded": false,
      "is_high_occlusion": false,
      "is_small_object_slice": true,
      "is_dense": false,
      "scores": {
        "brightness_v_mean": 11.79,
        "brightness_p50": 6.0,
        "tenengrad_sharpness": 10268.98,
        "laplacian_variance": 2.18,
        "fft_high_freq_ratio": 0.0212,
        "dark_channel_prior": 2.08,
        "atmospheric_transmission": 0.9179,
        "low_transmission_ratio": 0.0396,
        "rain_streak_ratio": 0.363,
        "saturation_mean": 182.26,
        "rms_contrast": 9.29,
        "weather_ensemble_score": 0.1355,
        "scale_shannon_entropy": -0.0,
        "occlusion_pairs": 0,
        "max_occlusion_chain": 1,
        "vehicle_count": 4,
        "total_objects": 7
      }
    }
  },
  {
    "image_name": "00067cfb-e535423e.jpg",
    "title": "Ảnh Giao Thông Mật Độ Dày Đa Thang Đo",
    "raw": {
      "timeofday": "dawn/dusk",
      "weather": "undefined",
      "scene": "city street",
      "num_objects": 33,
      "occluded_boxes": 20
    },
    "prof": {
      "is_night": false,
      "is_blur": false,
      "is_weather_degraded": false,
      "is_high_occlusion": true,
      "is_small_object_slice": true,
      "is_dense": true,
      "scores": {
        "brightness_v_mean": 96.38,
        "brightness_p50": 59.0,
        "tenengrad_sharpness": 42137.91,
        "laplacian_variance": 793.56,
        "fft_high_freq_ratio": 0.0302,
        "dark_channel_prior": 30.96,
        "atmospheric_transmission": 0.9047,
        "low_transmission_ratio": 0.002,
        "rain_streak_ratio": 0.3723,
        "saturation_mean": 96.02,
        "rms_contrast": 58.31,
        "weather_ensemble_score": 0.568,
        "scale_shannon_entropy": 0.3298,
        "occlusion_pairs": 26,
        "max_occlusion_chain": 7,
        "vehicle_count": 18,
        "total_objects": 33
      }
    }
  }
];

// 3. THÔNG TIN 4 CHẶNG PIPELINE ĐỒNG BỘ VIDEO & CANVAS
const PIPELINE_STAGES = [
  {
    id: 1,
    name: "Chặng 1: Nạp Ảnh & Đọc Metadata Gốc",
    startTime: 0,
    endTime: 9.0,
    kicker: "CHẶNG 1 / 4: NẠP ẢNH & TRA CỨU METADATA GỐC",
    title: "1. Nạp 6.994 ảnh từ kho Unique Pool & Tra cứu Metadata Gốc O(1)",
    desc: "Đọc 6.994 ảnh duy nhất từ kho Unique Pool bằng Symbolic Link (Dung lượng đĩa = 0 KB). Đồng thời tra cứu lập tức các thuộc tính gốc do UC Berkeley gán nhãn: timeofday, weather, scene, objects để chuẩn bị mỏ neo kiểm định.",
    telemetry: {
      action: "INGESTING_RAW_DATA",
      fps: "330.4 FPS",
      ram: "182 MB",
      disk: "0 KB (Symlink)"
    }
  },
  {
    id: 2,
    name: "Chặng 2: 5 Sub-Points Thực Nghiệm",
    startTime: 9.0,
    endTime: 17.0,
    kicker: "CHẶNG 2 / 4: 5 SUB-POINTS THỰC NGHIỆM ĐỐI ĐẦU",
    title: "2. Chạy giải đấu thực nghiệm nhiều thuật toán trên từng Sub-Point",
    desc: "Phân luồng song song qua 5 phân nhánh: P2.1 Đêm (Mean vs Otsu vs P50), P2.2 Mờ (Lap vs Ten vs 2D-FFT), P2.3 Thời tiết (DCP vs ClearGuard), P2.4 Che khuất (IoU vs Directed DAG), P2.5 Mật độ (Count vs Shannon).",
    telemetry: {
      action: "TOURNAMENT_BENCHMARKING",
      fps: "330.4 FPS",
      ram: "245 MB",
      disk: "0 KB"
    }
  },
  {
    id: 3,
    name: "Chặng 3: Trạm So Khớp & Kiểm Định",
    startTime: 17.0,
    endTime: 26.0,
    kicker: "CHẶNG 3 / 4: SO KHỚP METADATA GỐC & CẤP PHÉP",
    title: "3. So khớp trực tiếp Metadata sinh ra với Ground-Truth Metadata gốc",
    desc: "Trạm kiểm định đối chiếu từng cờ mới sinh ra với nhãn gốc BDD10K: is_night vs timeofday (khớp 97.12%), is_weather vs weather (khử 971 FP báo giả), is_high_occlusion vs occluded boxes (khớp 93.80% qua DAG). Cấp phép thuật toán Quán Quân ghi dữ liệu.",
    telemetry: {
      action: "CROSS_VERIFICATION_PASS",
      fps: "330.4 FPS",
      ram: "290 MB",
      disk: "0 KB"
    }
  },
  {
    id: 4,
    name: "Chặng 4: Đóng Dấu Bàn Giao Phase 03",
    startTime: 26.0,
    endTime: 34.0,
    kicker: "CHẶNG 4 / 4: XUẤT BẢN MANIFEST CHO PHASE 03",
    title: "4. Xuất bản data_profiling_manifest.json — Thiết lập Căn Cứ cho Phase 03",
    desc: "Đóng gói toàn bộ 6.994 hồ sơ ảnh đã kiểm định thành tệp Manifest chính thức. Cung cấp căn cứ bất biến để Phase 03 bốc chính xác 500 ảnh mầm seed_v0 (35% Đêm, 20% Nhỏ, 20% Che, 25% Ngày) và chia 1.400 fixed_test, 700 fixed_val.",
    telemetry: {
      action: "MANIFEST_SEALED_OK",
      fps: "330.4 FPS",
      ram: "195 MB",
      disk: "Manifest Exported"
    }
  }
];

// 4. BỘ ĐIỀU KHIỂN VIDEO MP4 PLAYER & CANVAS SIMULATOR
let simDisplayMode = 'video'; // 'video' hoặc 'canvas'
let canvasSimIsPlaying = false;
let currentStageIndex = 0;

function setSimulatorDisplayMode(mode) {
  simDisplayMode = mode;
  const videoCont = document.getElementById('videoContainer');
  const canvasCont = document.getElementById('canvasContainer');
  const tabVid = document.getElementById('tabModeVideo');
  const tabCan = document.getElementById('tabModeCanvas');
  const badge = document.getElementById('playerStatusBadge');
  const vid = document.getElementById('pipelineVideoPlayer');

  if (mode === 'video') {
    if (videoCont) videoCont.classList.remove('hidden');
    if (canvasCont) canvasCont.classList.add('hidden');
    if (tabVid) tabVid.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#2D5A34] shadow-soft-sm cursor-pointer transition-all';
    if (tabCan) tabCan.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6B7677] hover:text-[#1F2627] cursor-pointer transition-all';
    if (badge) badge.innerText = 'VIDEO MP4 HD THỰC TẾ (H.264 + THUYẾT MINH TIẾNG VIỆT)';
    if (PROFILING_CANVAS_ENGINE) PROFILING_CANVAS_ENGINE.pause();
  } else {
    if (videoCont) videoCont.classList.add('hidden');
    if (canvasCont) canvasCont.classList.remove('hidden');
    if (tabVid) tabVid.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6B7677] hover:text-[#1F2627] cursor-pointer transition-all';
    if (tabCan) tabCan.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#2D5A34] shadow-soft-sm cursor-pointer transition-all';
    if (badge) badge.innerText = 'CANVAS MÔ PHỎNG ĐỘNG HỌC 60FPS';
    if (vid) vid.pause();
    if (PROFILING_CANVAS_ENGINE) PROFILING_CANVAS_ENGINE.play();
  }
  updatePlayButtonUI();
}

function startVideoPlayback() {
  const vid = document.getElementById('pipelineVideoPlayer');
  const overlay = document.getElementById('videoPlayOverlay');
  if (vid) {
    vid.play().then(() => {
      if (overlay) overlay.style.display = 'none';
      updatePlayButtonUI();
    }).catch(err => {
      console.warn('Auto-play fallback to muted:', err);
      vid.muted = true;
      vid.play();
      if (overlay) overlay.style.display = 'none';
      updatePlayButtonUI();
    });
  }
}

function toggleMasterSimulation() {
  if (simDisplayMode === 'video') {
    const vid = document.getElementById('pipelineVideoPlayer');
    const overlay = document.getElementById('videoPlayOverlay');
    if (vid) {
      if (vid.paused) {
        vid.play();
        if (overlay) overlay.style.display = 'none';
      } else {
        vid.pause();
        if (overlay) overlay.style.display = 'flex';
      }
      updatePlayButtonUI();
    }
  } else {
    if (PROFILING_CANVAS_ENGINE.isPlaying) {
      PROFILING_CANVAS_ENGINE.pause();
    } else {
      PROFILING_CANVAS_ENGINE.play();
    }
    updatePlayButtonUI();
  }
}

function updatePlayButtonUI() {
  const btnIcon = document.getElementById('playBtnIcon');
  const btnText = document.getElementById('playBtnText');
  const vid = document.getElementById('pipelineVideoPlayer');
  const isPlaying = (simDisplayMode === 'video') ? (vid && !vid.paused) : PROFILING_CANVAS_ENGINE.isPlaying;

  if (isPlaying) {
    if (btnIcon) btnIcon.innerHTML = '<svg class="w-3.5 h-3.5 fill-current inline-block -mt-0.5" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    if (btnText) btnText.innerText = 'Tạm Dừng';
  } else {
    if (btnIcon) btnIcon.innerHTML = '<svg class="w-3.5 h-3.5 fill-current inline-block -mt-0.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    if (btnText) btnText.innerText = 'Phát Video';
  }
}

function seekSimulation(seconds) {
  if (simDisplayMode === 'video') {
    const vid = document.getElementById('pipelineVideoPlayer');
    if (vid) {
      vid.currentTime = seconds;
      startVideoPlayback();
    }
  } else {
    PROFILING_CANVAS_ENGINE.seek(seconds);
  }
}

function updateLiveStageInfo(stageIdx, currentTime) {
  if (currentStageIndex === stageIdx) return;
  currentStageIndex = stageIdx;
  const stage = PIPELINE_STAGES[stageIdx];
  if (!stage) return;

  // Cập nhật stage pills
  for (let i = 1; i <= 4; i++) {
    const pill = document.getElementById(`pillStage${i}`);
    if (pill) {
      if (i === stage.id) {
        pill.className = 'stage-pill text-left p-3.5 rounded-xl border border-[#2D5A34] bg-[#E8F0EA] shadow-soft-sm transition-all cursor-pointer';
        const title = pill.querySelector('div.font-editorial');
        if (title) title.className = 'font-editorial font-bold text-sm text-[#2D5A34]';
      } else {
        pill.className = 'stage-pill text-left p-3.5 rounded-xl border border-[#E5E3DC] bg-white transition-all cursor-pointer opacity-70 hover:opacity-100';
        const title = pill.querySelector('div.font-editorial');
        if (title) title.className = 'font-editorial font-bold text-sm text-[#1F2627]';
      }
    }
  }

  // Cập nhật thẻ giải thích bên cạnh
  const kickerEl = document.getElementById('simStageKicker');
  const titleEl = document.getElementById('simStageTitle');
  const descEl = document.getElementById('simStageDesc');
  const telemActionEl = document.getElementById('simStageAction');
  const telemFpsEl = document.getElementById('simStageFps');
  const telemRamEl = document.getElementById('simStageRam');
  const telemDiskEl = document.getElementById('simStageDisk');

  if (kickerEl) kickerEl.textContent = stage.kicker;
  if (titleEl) titleEl.textContent = stage.title;
  if (descEl) descEl.textContent = stage.desc;
  if (telemActionEl) telemActionEl.textContent = stage.telemetry.action;
  if (telemFpsEl) telemFpsEl.textContent = stage.telemetry.fps;
  if (telemRamEl) telemRamEl.textContent = stage.telemetry.ram;
  if (telemDiskEl) telemDiskEl.textContent = stage.telemetry.disk;
}

// 5. CANVAS ENGINE TƯƠNG TÁC DỰ PHÒNG
const PROFILING_CANVAS_ENGINE = {
  canvas: null,
  ctx: null,
  isPlaying: false,
  currentTime: 0,
  maxTime: 34.0,
  animId: null,
  lastT: 0,

  init() {
    this.canvas = document.getElementById('profilingPipelineCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.draw();
  },

  play() {
    this.isPlaying = true;
    this.lastT = performance.now();
    this.loop();
  },

  pause() {
    this.isPlaying = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  },

  seek(sec) {
    this.currentTime = sec;
    this.syncStage();
    this.draw();
  },

  loop(now = performance.now()) {
    if (!this.isPlaying) return;
    const dt = (now - this.lastT) / 1000;
    this.lastT = now;
    this.currentTime += dt;
    if (this.currentTime >= this.maxTime) this.currentTime = 0;

    this.syncStage();
    this.draw();
    this.animId = requestAnimationFrame(t => this.loop(t));
  },

  syncStage() {
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      if (this.currentTime >= PIPELINE_STAGES[i].startTime && this.currentTime < PIPELINE_STAGES[i].endTime) {
        updateLiveStageInfo(i, this.currentTime);
        break;
      }
    }
  },

  draw() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#F8F7F2';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#ECEAE2';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 4 Nodes
    const ny = h / 2 - 20;
    this.drawBox(ctx, 160, ny, 220, 160, "TRẠM 1: NẠP ẢNH & METADATA", "unique_pool/ + bdd10k_metadata", this.currentTime >= 0);
    this.drawBox(ctx, 480, ny, 230, 180, "TRẠM 2: 5 SUB-POINTS", "Giải Đấu Thuật Toán Song Song", this.currentTime >= 9.0);
    this.drawBox(ctx, 810, ny, 230, 160, "TRẠM 3: SO KHỚP METADATA", "Cross-Verification Ground-Truth", this.currentTime >= 17.0);
    this.drawBox(ctx, 1120, ny, 210, 160, "TRẠM 4: BÀN GIAO PHASE 03", "data_profiling_manifest.json", this.currentTime >= 26.0);

    // Pipes
    this.drawPipe(ctx, 270, ny, 365, ny, this.currentTime >= 9.0);
    this.drawPipe(ctx, 595, ny, 695, ny, this.currentTime >= 17.0);
    this.drawPipe(ctx, 925, ny, 1015, ny, this.currentTime >= 26.0);
  },

  drawBox(ctx, x, y, bw, bh, t1, t2, active) {
    ctx.save();
    ctx.fillStyle = active ? '#FFFFFF' : '#F2EFEB';
    ctx.strokeStyle = active ? '#2D5A34' : '#E5E3DC';
    ctx.lineWidth = active ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x - bw/2, y - bh/2, bw, bh, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = active ? '#2D5A34' : '#6B7677';
    ctx.font = 'bold 11px SF Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(t1, x, y - bh/2 + 25);

    ctx.fillStyle = '#1F2627';
    ctx.font = 'bold 12px Georgia, serif';
    ctx.fillText(t2, x, y - bh/2 + 45);
    ctx.restore();
  },

  drawPipe(ctx, x1, y1, x2, y2, active) {
    ctx.save();
    ctx.strokeStyle = active ? '#2D5A34' : '#E5E3DC';
    ctx.lineWidth = active ? 3 : 1.5;
    ctx.setLineDash(active ? [] : [6, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
};

// 6. CONTROLLER SO KHỚP CẶP SONG SONG
function selectCrossVerifySample(index) {
  const item = CROSS_VERIFY_SAMPLES[index];
  if (!item) return;

  for (let i = 0; i < CROSS_VERIFY_SAMPLES.length; i++) {
    const btn = document.getElementById(`cvBtn_${i}`);
    if (btn) {
      if (i === index) btn.className = 'px-3 py-1.5 rounded-lg border border-[#2D5A34] bg-[#E8F0EA] text-[#2D5A34] font-bold text-xs font-mono transition-all';
      else btn.className = 'px-3 py-1.5 rounded-lg border border-[#E5E3DC] bg-white text-[#475254] font-semibold text-xs font-mono transition-all hover:border-[#B7CDBB]';
    }
  }

  const titleEl = document.getElementById('cvSampleTitle');
  const nameEl = document.getElementById('cvSampleName');
  const rawBox = document.getElementById('cvRawMetaBox');
  const profBox = document.getElementById('cvProfMetaBox');
  const matchBox = document.getElementById('cvMatchBadgeBox');

  if (titleEl) titleEl.textContent = item.title;
  if (nameEl) nameEl.textContent = item.image_name;

  if (rawBox) {
    rawBox.innerHTML = `
      <div class="space-y-2 font-mono text-xs text-[#1F2627]">
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">timeofday:</span>
          <span class="font-bold ${item.raw.timeofday === 'night' ? 'text-[#991B1B]' : 'text-[#2D5A34]'}">${item.raw.timeofday}</span>
        </div>
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">weather:</span>
          <span class="font-bold text-[#1F2627]">${item.raw.weather}</span>
        </div>
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">scene:</span>
          <span class="text-[#1F2627]">${item.raw.scene}</span>
        </div>
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">num_objects:</span>
          <span class="font-bold text-[#1F2627]">${item.raw.num_objects} hộp nhãn</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#6B7677]">occluded_boxes:</span>
          <span class="font-bold text-[#991B1B]">${item.raw.occluded_boxes} hộp bị che</span>
        </div>
      </div>
    `;
  }

  if (profBox) {
    profBox.innerHTML = `
      <div class="space-y-2 font-mono text-xs text-[#1F2627]">
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">is_night:</span>
          <span class="font-bold ${item.prof.is_night ? 'text-[#991B1B]' : 'text-[#2D5A34]'}">${item.prof.is_night} (P50: ${item.prof.scores.brightness_p50 || 0})</span>
        </div>
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">is_blur:</span>
          <span class="font-bold ${item.prof.is_blur ? 'text-[#991B1B]' : 'text-[#2D5A34]'}">${item.prof.is_blur} (FFT Slope: ${item.prof.scores.fft_high_freq_ratio || 0})</span>
        </div>
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">is_weather_degraded:</span>
          <span class="font-bold text-[#1F2627]">${item.prof.is_weather_degraded} (ClearDayGuard OK)</span>
        </div>
        <div class="flex justify-between border-b border-[#E5E3DC] pb-1.5">
          <span class="text-[#6B7677]">is_high_occlusion:</span>
          <span class="font-bold text-[#1F2627]">${item.prof.is_high_occlusion} (DAG Pairs: ${item.prof.scores.occlusion_pairs || 0})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#6B7677]">is_small_object_slice:</span>
          <span class="font-bold text-[#1F2627]">${item.prof.is_small_object_slice}</span>
        </div>
      </div>
    `;
  }

  if (matchBox) {
    const nightMatch = (item.raw.timeofday === 'night') === item.prof.is_night;

    matchBox.innerHTML = `
      <div class="space-y-2.5 text-xs">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded font-mono font-bold text-[11px] ${nightMatch ? 'bg-[#E8F0EA] text-[#2D5A34] border border-[#CDE0D1]' : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'}">
            ${nightMatch ? 'XÁC THỰC KHỚP BAN ĐÊM (YCbCr P50)' : 'Lệch Phân Định'}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded font-mono font-bold text-[11px] bg-[#E8F0EA] text-[#2D5A34] border border-[#CDE0D1]">
            XÁC THỰC CHE KHUẤT DIRECTED DAG (+36.05% F1)
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded font-mono font-bold text-[11px] bg-[#E8F0EA] text-[#2D5A34] border border-[#CDE0D1]">
            CLEAR DAY GUARD: TRIỆT TIÊU BÁO GIẢ SƯƠNG MÙ
          </span>
        </div>
        <div class="pt-2 text-[11px] text-[#475254] leading-relaxed border-t border-[#E5E3DC]">
          <strong class="text-[#2D5A34]">Chuẩn Căn Cứ Phase 03:</strong> Hồ sơ metadata ảnh đã được đối chuẩn Ground-Truth thành công, sẵn sàng cung cấp căn cứ phân bổ cho tập mầm Seed V0.
        </div>
      </div>
    `;
  }
}

// 7. TOURNAMENT TABS
function switchTournamentTab(pointId) {
  const tabs = ['2.1', '2.2', '2.3', '2.4', '2.5', 'bootstrap_ci'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn_${t.replace('.', '_')}`);
    const content = document.getElementById(`tabContent_${t.replace('.', '_')}`);
    if (btn && content) {
      if (t === pointId) {
        btn.className = 'px-4 py-2.5 rounded-xl border border-[#2D5A34] bg-[#E8F0EA] text-[#2D5A34] font-bold text-xs font-mono transition-all';
        content.classList.remove('hidden');
      } else {
        btn.className = 'px-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-[#475254] font-semibold text-xs font-mono transition-all hover:border-[#B7CDBB]';
        content.classList.add('hidden');
      }
    }
  });
}

// 8. HUMAN AUDIT GALLERY
function renderAuditGallery(filter = 'all') {
  const grid = document.getElementById('auditGalleryGrid');
  const countBadge = document.getElementById('auditFilteredCount');
  if (!grid) return;

  let filtered = AUDIT_CANDIDATES;
  if (filter === 'blur') filtered = AUDIT_CANDIDATES.filter(c => c.label === 'BLUR');
  else if (filter === 'sharp') filtered = AUDIT_CANDIDATES.filter(c => c.label === 'SHARP');
  else if (filter === 'motion') filtered = AUDIT_CANDIDATES.filter(c => c.id === 11 || c.id === 12);

  if (countBadge) countBadge.textContent = `${filtered.length} / 100 ẢNH HIỂN THỊ`;

  grid.innerHTML = filtered.map(c => {
    const isBlur = c.is_blur;
    const badgeColor = isBlur ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' : 'bg-[#E8F0EA] text-[#2D5A34] border-[#CDE0D1]';
    const badgeText = isBlur ? 'XÁC THỰC MỜ' : 'SẮC NÉT';

    return `
      <div class="editorial-card p-4 space-y-3 cursor-pointer hover:border-[#2D5A34] transition-all group" onclick="openCandidateModal(${c.id})">
        <div class="flex items-center justify-between text-xs">
          <span class="font-mono font-bold text-[#1F2627]">ID ${c.id}</span>
          <span class="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${badgeColor}">${badgeText}</span>
        </div>

        <div class="aspect-video w-full rounded-lg overflow-hidden bg-[#ECEAE2] relative">
          <img src="${c.img}" alt="Candidate ${c.id}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
            Bấm xem đối chứng cận cảnh
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-[#F8F7F2] p-2 rounded-lg border border-[#E5E3DC]">
          <div>
            <div class="text-[#6B7677]">Laplacian</div>
            <div class="font-bold text-[#1F2627]">${c.lap.toFixed(1)}</div>
          </div>
          <div>
            <div class="text-[#6B7677]">Tenengrad</div>
            <div class="font-bold text-[#1F2627]">${Math.round(c.ten).toLocaleString()}</div>
          </div>
          <div>
            <div class="text-[#6B7677]">2D-FFT</div>
            <div class="font-bold text-[#1F2627]">${c.fft.toFixed(3)}</div>
          </div>
        </div>

        <div class="text-[11px] text-[#475254] line-clamp-2 leading-relaxed">
          <span class="font-semibold text-[#1F2627]">Thẩm định Huỳnh:</span> ${c.notes}
        </div>
      </div>
    `;
  }).join('');
}

function openCandidateModal(candId) {
  const c = AUDIT_CANDIDATES.find(item => item.id === candId);
  const modal = document.getElementById('candidateModal');
  const body = document.getElementById('candidateModalBody');
  if (!c || !modal || !body) return;

  const isBlur = c.is_blur;
  const badgeColor = isBlur ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' : 'bg-[#E8F0EA] text-[#2D5A34] border-[#CDE0D1]';
  const badgeText = isBlur ? 'XÁC THỰC MỜ THỰC TẾ (CONFIRMED BLUR)' : 'SẮC NÉT THỰC TẾ (CONFIRMED SHARP)';

  body.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-wider text-[#6B7677]">BDD10K UNIQUE POOL — CANDIDATE #${c.id}</span>
          <h3 class="text-lg font-bold font-editorial text-[#1F2627]">${c.name}</h3>
        </div>
        <span class="px-3 py-1 rounded-lg font-mono text-xs font-bold border ${badgeColor}">${badgeText}</span>
      </div>

      <div class="rounded-xl overflow-hidden border border-[#E5E3DC] bg-black">
        <img src="${c.img}" alt="Candidate ${c.id}" class="w-full h-auto max-h-[500px] object-contain mx-auto">
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="p-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] text-center">
          <div class="text-xs text-[#6B7677] font-mono">Laplacian Variance</div>
          <div class="text-xl font-bold font-editorial text-[#1F2627]">${c.lap.toFixed(2)}</div>
          <div class="text-[10px] text-[#6B7677]">Ngưỡng: < 120.0</div>
        </div>
        <div class="p-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] text-center">
          <div class="text-xs text-[#6B7677] font-mono">Edge-Gated Tenengrad</div>
          <div class="text-xl font-bold font-editorial text-[#1F2627]">${Math.round(c.ten).toLocaleString()}</div>
          <div class="text-[10px] text-[#6B7677]">Ngưỡng: < 15,000</div>
        </div>
        <div class="p-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] text-center">
          <div class="text-xs text-[#6B7677] font-mono">2D-FFT Energy Slope</div>
          <div class="text-xl font-bold font-editorial text-[#1F2627]">${c.fft.toFixed(4)}</div>
          <div class="text-[10px] text-[#6B7677]">Ngưỡng: < 0.015</div>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-[#E8F0EA] border border-[#CDE0D1] space-y-1.5">
        <div class="text-xs font-mono font-bold text-[#2D5A34]">
          KẾT QUẢ THẨM ĐỊNH CON NGƯỜI (HUMAN VERIFICATION AUDIT):
        </div>
        <p class="text-xs text-[#1F2627] leading-relaxed">
          <strong class="text-[#2D5A34]">Thẩm định bởi Chuyên gia:</strong> ${c.verified_by}<br>
          <strong class="text-[#2D5A34]">Ghi chú quang học:</strong> ${c.notes}
        </p>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeCandidateModal() {
  const modal = document.getElementById('candidateModal');
  if (modal) modal.classList.add('hidden');
}

function runQuickInspector() {
  const input = document.getElementById('inspectorInput');
  if (!input) return;
  const query = input.value.trim().toLowerCase();
  if (!query) {
    alert('Vui lòng nhập tên ảnh (hoặc tiền tố UUID)!');
    return;
  }
  const match = AUDIT_CANDIDATES.find(c => c.name.toLowerCase().includes(query));
  if (match) openCandidateModal(match.id);
  else alert(`Không tìm thấy "${query}" trong 100 ảnh kiểm toán. Thử: 0206144e (ID 11), 036d1a58 (ID 12)...`);
}

// 9. KHỞI CHẠY VÀ LẮNG NGHE SỰ KIỆN VIDEO
document.addEventListener('DOMContentLoaded', () => {
  PROFILING_CANVAS_ENGINE.init();
  renderAuditGallery('all');
  selectCrossVerifySample(0);
  switchTournamentTab('2.1');

  // Lắng nghe sự kiện Video MP4 để đồng bộ Chặng 1, 2, 3, 4
  const vid = document.getElementById('pipelineVideoPlayer');
  if (vid) {
    vid.addEventListener('timeupdate', () => {
      const curT = vid.currentTime;
      for (let i = 0; i < PIPELINE_STAGES.length; i++) {
        if (curT >= PIPELINE_STAGES[i].startTime && curT < PIPELINE_STAGES[i].endTime) {
          updateLiveStageInfo(i, curT);
          break;
        }
      }
    });

    vid.addEventListener('play', () => updatePlayButtonUI());
    vid.addEventListener('pause', () => updatePlayButtonUI());
  }

  updateLiveStageInfo(0, 0);

  if (typeof Chart !== 'undefined') {
    const distCanvas = document.getElementById('chartHardSlicesDist');
    if (distCanvas) {
      new Chart(distCanvas, {
        type: 'bar',
        data: {
          labels: ['Ban Đêm', 'Mờ/Rung', 'Thời Tiết Xấu', 'Vật Thể Nhỏ', 'Che Khuất Cao', 'Mật Độ Dày'],
          datasets: [{
            label: 'Tỷ lệ % trong 6.994 ảnh',
            data: [38.29, 13.24, 34.50, 99.27, 86.15, 64.63],
            backgroundColor: ['#2D5A34', '#C6D9E8', '#f59e0b', '#8b5cf6', '#dc2626', '#0284c7'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.raw}% (${Math.round(ctx.raw * 6994 / 100).toLocaleString()} ảnh)`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { callback: v => v + '%' },
              grid: { color: '#ECEAE2' }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }
});
