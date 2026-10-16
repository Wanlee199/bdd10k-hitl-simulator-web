/**
 * BDD10K ACTIVE LEARNING LAB - 9-STAGE FLYWHEEL SIMULATOR ENGINE
 * Điều khiển toàn bộ vòng lặp mô phỏng 9 chặng kỹ thuật
 */

import { PIPELINE_STAGES, STOPPING_GATES } from './data.js';

export class FlywheelSimulator {
  constructor(options = {}) {
    this.currentStageId = 1;
    this.isPlaying = false;
    this.playSpeed = 1; // 1x, 2x, 5x
    this.timer = null;
    this.stageDuration = 4000; // 4 seconds per stage at 1x
    
    this.trackContainer = document.getElementById('stageTrack');
    this.contentContainer = document.getElementById('stageContentCard');
    this.sandboxContainer = document.getElementById('stageSandboxCard');
    this.playPauseBtn = document.getElementById('simPlayPauseBtn');
    this.prevBtn = document.getElementById('simPrevBtn');
    this.nextBtn = document.getElementById('simNextBtn');
    this.speedChips = document.querySelectorAll('.speed-chip');

    this.init();
  }

  init() {
    this.renderTrack();
    this.bindEvents();
    this.setStage(1);
  }

  renderTrack() {
    if (!this.trackContainer) return;
    this.trackContainer.innerHTML = PIPELINE_STAGES.map(stage => `
      <button class="stage-step-btn ${stage.id === this.currentStageId ? 'active' : ''}" data-stage="${stage.id}" id="stepBtn-${stage.id}">
        <span class="step-num">${stage.id}</span>
        <span class="step-name">${stage.shortName}</span>
      </button>
    `).join('');
  }

  bindEvents() {
    if (this.trackContainer) {
      this.trackContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.stage-step-btn');
        if (btn) {
          const stageId = parseInt(btn.dataset.stage, 10);
          this.pause();
          this.setStage(stageId);
        }
      });
    }

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.pause();
        let prev = this.currentStageId - 1;
        if (prev < 1) prev = 9;
        this.setStage(prev);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.pause();
        let next = this.currentStageId + 1;
        if (next > 9) next = 1;
        this.setStage(next);
      });
    }

    this.speedChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.speedChips.forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.playSpeed = parseFloat(e.currentTarget.dataset.speed) || 1;
        if (this.isPlaying) {
          this.play(); // reset interval with new speed
        }
      });
    });

    // Re-render KaTeX formula once CDN script finishes loading
    window.addEventListener('load', () => {
      const stage = PIPELINE_STAGES.find(s => s.id === this.currentStageId) || PIPELINE_STAGES[0];
      this.renderFormula(stage.math);
    });
  }

  setStage(stageId) {
    this.currentStageId = stageId;
    const stage = PIPELINE_STAGES.find(s => s.id === stageId) || PIPELINE_STAGES[0];

    // Update Track UI
    document.querySelectorAll('.stage-step-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.stage, 10) === stageId);
    });

    // Render Stage Main Info
    this.renderStageContent(stage);

    // Render Stage Interactive Sandbox
    this.renderSandbox(stage);
  }

  play() {
    this.isPlaying = true;
    if (this.playPauseBtn) {
      this.playPauseBtn.innerHTML = `<span>⏸</span> Tạm Dừng`;
      this.playPauseBtn.classList.replace('btn-primary', 'btn-secondary');
    }
    clearInterval(this.timer);
    const duration = this.stageDuration / this.playSpeed;
    this.timer = setInterval(() => {
      let next = this.currentStageId + 1;
      if (next > 9) next = 1;
      this.setStage(next);
    }, duration);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
    if (this.playPauseBtn) {
      this.playPauseBtn.innerHTML = `<span>▶</span> Mô Phỏng Vòng Lặp`;
      this.playPauseBtn.classList.replace('btn-secondary', 'btn-primary');
    }
  }

  renderStageContent(stage) {
    if (!this.contentContainer) return;
    this.contentContainer.innerHTML = `
      <div class="stage-badge-row">
        <span class="stage-tag-pill">${stage.tag}</span>
        <span class="stage-hardware-pill"><svg style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-top: -2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ${stage.hardware}</span>
        <span class="badge-emerald" style="margin-left: auto;">${stage.status}</span>
      </div>
      <div>
        <h3 class="stage-title">${stage.name}</h3>
        <p style="color: var(--neon-cyan); font-size: 0.88rem; font-weight: 600; margin-top: 4px;">${stage.subtitle}</p>
      </div>
      <p class="stage-desc">${stage.description}</p>
      
      <div class="math-formula-box">
        <div class="formula-header">
          <div class="formula-label">
            <span><svg style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-top: -2px; color: #34d399;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 7-6 6"/><path d="m17 11-8 8"/><path d="m19 13-4 4"/><path d="m3 21 18-18"/></svg></span>
            <span>CÔNG THỨC TOÁN HỌC CỐT LÕI</span>
          </div>
          <span class="telemetry-badge badge-cyan" style="font-size: 0.65rem;">LaTeX / KaTeX</span>
        </div>
        <div class="formula-content" id="stageMathFormula"></div>
      </div>

      <div class="stage-metrics-row">
        ${Object.entries(stage.metrics).map(([k, v]) => `
          <div class="stage-metric-box">
            <div class="stage-metric-label">${k}</div>
            <div class="stage-metric-val">${v}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Render KaTeX with smart Unicode fallback (1 dòng chuẩn)
    this.renderFormula(stage.math);
  }

  renderFormula(mathString) {
    const el = document.getElementById('stageMathFormula');
    if (!el) return;

    if (window.katex) {
      try {
        const mainHtml = window.katex.renderToString(mathString, {
          throwOnError: false,
          displayMode: true
        });
        el.innerHTML = `<div class="formula-main">${mainHtml}</div>`;
        return;
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    }

    // Fallback: Smart Unicode formatting if KaTeX is not yet loaded or offline
    el.innerHTML = `<div class="formula-fallback">${this.formatLatexFallback(mathString)}</div>`;
  }

  formatLatexFallback(latex) {
    let s = latex;
    s = s.replace(/\\text\{([^}]+)\}/g, '$1');
    s = s.replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑<sub>$1</sub><sup>$2</sup>');
    s = s.replace(/\\sum/g, '∑');
    s = s.replace(/\\oplus/g, '⊕');
    s = s.replace(/\\times/g, '×');
    s = s.replace(/\\cdot/g, '·');
    s = s.replace(/\\ge/g, '≥');
    s = s.replace(/\\le/g, '≤');
    s = s.replace(/\\land/g, '∧');
    s = s.replace(/\\implies/g, '⟹');
    s = s.replace(/\\to/g, '→');
    s = s.replace(/\\cap/g, '∩');
    s = s.replace(/\\cup/g, '∪');
    s = s.replace(/\\in/g, '∈');
    s = s.replace(/\\emptyset/g, '∅');
    s = s.replace(/\\mathcal\{L\}/g, 'ℒ');
    s = s.replace(/\\mathcal\{S\}/g, '𝒮');
    s = s.replace(/\\mathcal\{D\}/g, '𝒟');
    s = s.replace(/\\Delta/g, 'Δ');
    s = s.replace(/\\nabla/g, '∇');
    s = s.replace(/\\lambda/g, 'λ');
    s = s.replace(/\\gamma/g, 'γ');
    s = s.replace(/\\alpha/g, 'α');
    s = s.replace(/\\sigma/g, 'σ');
    s = s.replace(/\\Omega/g, 'Ω');
    s = s.replace(/\\left\\lfloor/g, '⌊');
    s = s.replace(/\\right\\rceil/g, '⌉');
    s = s.replace(/\\arg\\max/g, 'arg max');
    s = s.replace(/\\max/g, 'max');
    s = s.replace(/\\min/g, 'min');
    s = s.replace(/\\quad/g, ' &nbsp; ');
    s = s.replace(/\\left/g, '');
    s = s.replace(/\\right/g, '');
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
    s = s.replace(/\\%/g, '%');
    s = s.replace(/\\;/g, ' ');
    s = s.replace(/\\,/g, ' ');
    s = s.replace(/\\_/g, '_');
    s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
    s = s.replace(/\^2/g, '²');
    return s;
  }

  renderSandbox(stage) {
    if (!this.sandboxContainer) return;
    
    let sandboxHTML = '';
    switch (stage.id) {
      case 1:
        sandboxHTML = this.renderStage1Sandbox();
        break;
      case 2:
        sandboxHTML = this.renderStage2Sandbox();
        break;
      case 3:
        sandboxHTML = this.renderStage3Sandbox();
        break;
      case 4:
        sandboxHTML = this.renderStage4Sandbox();
        break;
      case 5:
        sandboxHTML = this.renderStage5Sandbox();
        break;
      case 6:
        sandboxHTML = this.renderStage6Sandbox();
        break;
      case 7:
        sandboxHTML = this.renderStage7Sandbox();
        break;
      case 8:
        sandboxHTML = this.renderStage8Sandbox();
        break;
      case 9:
        sandboxHTML = this.renderStage9Sandbox();
        break;
      default:
        sandboxHTML = `<div style="color: var(--text-muted); text-align: center;">Mô phỏng đang tải...</div>`;
    }

    this.sandboxContainer.innerHTML = `
      <div class="sandbox-header">
        <div class="sandbox-title">
          <span><svg style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-top: -2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
          <span>SANDBOX TRẢI NGHIỆM TRỰC QUAN: CHẶNG ${stage.id}</span>
        </div>
        <span class="telemetry-badge badge-cyan">LIVE SIMULATION</span>
      </div>
      <div class="sandbox-viewport" id="sandboxViewport">
        ${sandboxHTML}
      </div>
    `;

    // Bind dynamic sandbox controls if applicable
    this.bindSandboxInteractive(stage.id);
  }

  /* --- Specific Stage Sandboxes --- */
  renderStage1Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
        <!-- Video Simulation Player Mini -->
        <div style="position: relative; width: 100%; height: 210px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-subtle); background: #000;">
          <video 
            id="stage1MiniVideo" 
            src="assets/fastdedup_pipeline_simulation.mp4" 
            autoplay 
            loop 
            muted 
            playsinline 
            controls
            style="width: 100%; height: 100%; object-fit: cover;"
          ></video>
          <div style="position: absolute; top: 8px; left: 8px; background: rgba(16, 185, 129, 0.9); color: #fff; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-family: var(--font-mono); display: flex; align-items: center; gap: 4px;">
            <span><svg style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-top: -2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg></span>
            <span>VIDEO MÔ PHỎNG (GIỌNG NỮ MICROSOFT EDGE)</span>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 700; color: #34d399; font-size: 0.82rem;"><svg style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-top: -2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ĐỘNG CƠ DUAL-STREAM FAST DEDUPLICATION:</div>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">
              Stream 1 (pHash >390 FPS) + Stream 2 (Keep-Most-Vehicles cứu người đi bộ)
            </div>
          </div>
          <a 
            href="fastdedup-point1.html" 
            class="btn btn-primary btn-sm" 
            style="font-size: 0.72rem; padding: 6px 12px; text-decoration: none; white-space: nowrap; margin-left: 12px;"
          >
            Mở Trang Báo Cáo Point 1 ↗
          </a>
        </div>
      </div>
    `;
  }

  renderStage2Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 20px; display: flex; flex-direction: column; justify-content: center; gap: 14px;">
        <div style="font-size: 0.82rem; color: var(--neon-cyan); font-weight: 700; text-transform: uppercase;">
          11 Chiều Thuộc Tính Quang Học Không Nhãn (Zero-Label)
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Độ Sáng (HSV-V)</div>
            <div style="font-family: var(--font-mono); font-size: 0.9rem; color: #fbbf24; font-weight: 700;">0.21 (Night)</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Tenengrad Sharpness</div>
            <div style="font-family: var(--font-mono); font-size: 0.9rem; color: #34d399; font-weight: 700;">184.2 px²</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Retinex Illumination</div>
            <div style="font-family: var(--font-mono); font-size: 0.9rem; color: #38bdf8; font-weight: 700;">Low Lux Dynamic</div>
          </div>
        </div>
        <div style="padding: 10px; background: rgba(6, 182, 212, 0.08); border-radius: 6px; border: 1px solid rgba(6, 182, 212, 0.2); font-size: 0.8rem; color: var(--text-secondary);">
          <svg style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; margin-top: -2px; color: #34d399;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> <strong>Tác vụ Profiling:</strong> Gắn nhãn phân loại tự động vào lát cắt <em>"Ban Đêm / Trời Mưa / Ngược Sáng"</em> để phục vụ thuật toán khai thác C6.
        </div>
      </div>
    `;
  }

  renderStage3Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700;">
            <svg style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; margin-top: -2px; color: #34d399;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ZERO DATA LEAKAGE: CÁCH LY TUYỆT ĐỐI VIDEO ID
          </div>
          <span class="telemetry-badge badge-emerald">AUDIT PASS (0 / 13.45M)</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center;">
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; padding: 6px;">
            <div style="font-size: 0.65rem; color: #f87171; font-weight: 700;">FIXED TEST</div>
            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-mono); color: #fff;">1.400</div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">20% Frozen Gold</div>
          </div>
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 6px; padding: 6px;">
            <div style="font-size: 0.65rem; color: #fbbf24; font-weight: 700;">FIXED VAL</div>
            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-mono); color: #fff;">700</div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">10% Early Stop</div>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 6px;">
            <div style="font-size: 0.65rem; color: #34d399; font-weight: 700;">SEED V0</div>
            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-mono); color: #fff;">500</div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">Mầm khởi đầu</div>
          </div>
          <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 6px; padding: 6px;">
            <div style="font-size: 0.65rem; color: #38bdf8; font-weight: 700;">UNLABELED</div>
            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-mono); color: #fff;">4.394</div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">Kho mỏ Active</div>
          </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 6px; padding: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-family: var(--font-mono);">
            <span style="color: var(--neon-emerald); font-weight: 700;"><svg style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; margin-top: -2px; color: #fbbf24;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> Quán Quân Tournament:</span>
            <span style="color: #fff; font-weight: 700;">Hybrid Mix 80/20 (Score: 93.59)</span>
          </div>
          <div style="font-size: 0.68rem; color: var(--text-secondary); margin-top: 3px;">
            Đánh bại 5 chiến lược đối thủ. Cosine 99.99%, Bán kính phủ R_cov 3.35, Zero Video Overlap.
          </div>
        </div>

        <div style="font-size: 0.7rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 5px 8px; border-radius: 4px;">
          <span>Quét chéo pHash: <strong>13.454.400 cặp</strong></span>
          <span style="color: var(--neon-emerald); font-weight: 700;">HD &lt; 5 Vi phạm: 0 (100% Sạch)</span>
        </div>
      </div>
    `;
  }

  renderStage4Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 18px; display: flex; flex-direction: column; justify-content: space-around;">
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); text-align: center;">
          Cân Bằng 4 Lát Cắt Khó (Hybrid Mix 80/20) Cho Seed V0
        </div>
        <div style="display: flex; height: 32px; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-medium);">
          <div style="width: 35%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff;" title="Đêm (Night) 35%">Đêm 35%</div>
          <div style="width: 20%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #000;" title="Vật thể nhỏ (Small) 20%">Nhỏ 20%</div>
          <div style="width: 20%; background: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff;" title="Che khuất (Occluded) 20%">Che 20%</div>
          <div style="width: 25%; background: #10b981; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #fff;" title="Ban ngày (Day) 25%">Ngày 25%</div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-secondary); background: rgba(0,0,0,0.4); padding: 8px 14px; border-radius: 6px;">
          <span>Model V0 mAP@50: <strong style="color: var(--neon-emerald);">20.23%</strong></span>
          <span>Precision: <strong style="color: #38bdf8;">53.09%</strong></span>
        </div>
      </div>
    `;
  }

  renderStage5Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--neon-cyan);">
          THỬ NGHIỆM ĐỘNG CƠ C6 SUPER-FUSION TÍNH ĐIỂM KHAI THÁC:
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
            <span>Độ Bất Định Shannon U(x):</span>
            <span id="sliderUVal" style="color: #38bdf8; font-family: var(--font-mono); font-weight: 700;">0.82</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value="0.82" class="calc-slider" id="sliderU">
          
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
            <span>Trọng số Thâm hụt Lớp C_w:</span>
            <span id="sliderCwVal" style="color: #fbbf24; font-family: var(--font-mono); font-weight: 700;">22.5x (Train/Motor)</span>
          </div>
          <input type="range" min="0.2" max="25" step="0.5" value="22.5" class="calc-slider" id="sliderCw">
        </div>
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.78rem; font-weight: 600;">Điểm Khai Thác Mẫu (Priority Score):</span>
          <span id="superFusionScoreDisplay" style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: var(--neon-emerald);">18.45 pts</span>
        </div>
      </div>
    `;
  }

  renderStage6Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 16px; display: flex; flex-direction: column; justify-content: space-around;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-primary);">TWO-TIER CONSENSUS ROUTER</div>
          <span class="badge-emerald" style="font-size: 0.7rem;">Consensus Checker</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 10px;">
            <div style="font-size: 0.75rem; color: #34d399; font-weight: 700;">TIER 1: AI PRE-LABEL</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Conf >= 0.75 & IoU >= 0.70</div>
            <div style="margin-top: 6px; font-family: var(--font-mono); font-size: 0.85rem; color: #fff; font-weight: 700;">Tiết kiệm 26.67%</div>
          </div>
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 10px;">
            <div style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">TIER 2: HUMAN ORACLE</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Bất định cao / Lớp điểm liệt</div>
            <div style="margin-top: 6px; font-family: var(--font-mono); font-size: 0.85rem; color: #fff; font-weight: 700;">Chuyên gia vẽ tay CVAT</div>
          </div>
        </div>
        <div style="font-size: 0.72rem; color: var(--text-secondary); text-align: center;">
          Rút ngẫu nhiên <strong>10% Tier 1</strong> để kiểm toán QA. Nếu sai số &ge; 5%, rollback toàn bộ về chuyên gia.
        </div>
      </div>
    `;
  }

  renderStage7Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 18px; display: flex; flex-direction: column; justify-content: space-around;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--neon-cyan);">RETRAINING LOSS CONVERGENCE</span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #34d399;">AdamW + Focal Loss</span>
        </div>
        <div style="height: 100px; display: flex; align-items: flex-end; gap: 8px; padding: 0 10px;">
          <div style="flex: 1; height: 95%; background: rgba(239, 68, 68, 0.6); border-radius: 2px;" title="Epoch 1: Loss 4.2"></div>
          <div style="flex: 1; height: 75%; background: rgba(245, 158, 11, 0.6); border-radius: 2px;" title="Epoch 3: Loss 3.1"></div>
          <div style="flex: 1; height: 55%; background: rgba(59, 130, 246, 0.6); border-radius: 2px;" title="Epoch 6: Loss 2.4"></div>
          <div style="flex: 1; height: 40%; background: rgba(6, 182, 212, 0.6); border-radius: 2px;" title="Epoch 10: Loss 1.8"></div>
          <div style="flex: 1; height: 25%; background: rgba(16, 185, 129, 0.8); border-radius: 2px;" title="Epoch 15: Loss 1.1"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
          <span>Epoch 1 (Loss 4.2)</span>
          <span style="color: var(--neon-emerald); font-weight: 700;">Hội tụ Epoch 15 (Loss 1.1)</span>
        </div>
      </div>
    `;
  }

  renderStage8Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 14px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--neon-emerald); margin-bottom: 4px;">
          KIỂM ĐỊNH BỘ RÀO CHẮN AN TOÀN 5 TẦNG
        </div>
        ${STOPPING_GATES.map(g => `
          <div style="background: rgba(255,255,255,0.02); border: 1px solid ${g.status === 'TRIGGERED' ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}; border-radius: 6px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: ${g.status === 'TRIGGERED' ? 'var(--neon-emerald)' : 'var(--text-primary)'};">${g.name}</div>
              <div style="font-size: 0.65rem; color: var(--text-muted);">${g.note}</div>
            </div>
            <span class="${g.status === 'TRIGGERED' ? 'badge-emerald' : 'badge-cyan'}" style="font-size: 0.65rem;">${g.status}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderStage9Sandbox() {
    return `
      <div style="width: 100%; height: 100%; padding: 18px; display: flex; flex-direction: column; justify-content: space-around;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--neon-purple); text-align: center;">
          LƯỢNG TỬ HÓA CẠNH BIÊN (INT8 QUANTIZATION BENCHMARK)
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 0.72rem; color: var(--text-muted);">YOLO11n FP32</div>
            <div style="font-size: 1.25rem; font-family: var(--font-mono); color: #f87171; font-weight: 800; margin: 4px 0;">38.4 ms</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Dung lượng ~24 MB</div>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 0.72rem; color: #34d399; font-weight: 700;">YOLO11n INT8</div>
            <div style="font-size: 1.25rem; font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 800; margin: 4px 0;">7.8 ms</div>
            <div style="font-size: 0.7rem; color: var(--neon-emerald); font-weight: 600;">Dung lượng 5.8 MB (Nhanh 4.9x)</div>
          </div>
        </div>
        <div style="text-align: center; font-size: 0.72rem; color: var(--text-muted);">
          Đạt chuẩn thời gian thực chạy trực tiếp trên chip biên camera xe tự hành.
        </div>
      </div>
    `;
  }

  bindSandboxInteractive(stageId) {
    if (stageId === 5) {
      const uSlider = document.getElementById('sliderU');
      const cwSlider = document.getElementById('sliderCw');
      const uVal = document.getElementById('sliderUVal');
      const cwVal = document.getElementById('sliderCwVal');
      const scoreDisplay = document.getElementById('superFusionScoreDisplay');

      const updateScore = () => {
        if (!uSlider || !cwSlider || !scoreDisplay) return;
        const u = parseFloat(uSlider.value);
        const cw = parseFloat(cwSlider.value);
        if (uVal) uVal.textContent = u.toFixed(2);
        if (cwVal) cwVal.textContent = `${cw.toFixed(1)}x`;
        const score = (u * cw).toFixed(2);
        scoreDisplay.textContent = `${score} pts`;
      };

      if (uSlider) uSlider.addEventListener('input', updateScore);
      if (cwSlider) cwSlider.addEventListener('input', updateScore);
    }
  }
}
