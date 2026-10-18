/**
 * BDD10K ACTIVE LEARNING LAB - "BE THE HUMAN ORACLE" MINI-STUDIO
 * Trải nghiệm trực tiếp vai trò chuyên gia gán nhãn thẩm định trong vòng lặp HITL
 * Sử dụng hình ảnh thực tế từ các tập seed BDD10K và các hộp prelabel/ground-truth
 */

import { REAL_ORACLE_SAMPLES } from './oracle-samples-data.js';

export class OracleStudio {
  constructor() {
    this.canvas = document.getElementById('oracleCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.approveTier1Btn = document.getElementById('approveTier1Btn');
    this.correctTier2Btn = document.getElementById('correctTier2Btn');
    this.submitBatchBtn = document.getElementById('submitBatchBtn');
    this.resetSceneBtn = document.getElementById('resetSceneBtn');
    
    this.accuracyBoostVal = document.getElementById('accuracyBoostVal');
    this.meterFill = document.getElementById('meterFill');
    
    // UI Metadata Elements
    this.roundBadge = document.getElementById('oracleRoundBadge');
    this.imageFileDisplay = document.getElementById('oracleImageFile');
    this.imageDescDisplay = document.getElementById('oracleImageDesc');
    this.roundPills = document.querySelectorAll('.round-pill-btn');

    // Preload images for all 5 real samples
    this.samples = JSON.parse(JSON.stringify(REAL_ORACLE_SAMPLES));
    this.currentRoundIndex = 4; // Defaults to V5 Victory (climax)
    
    this.loadedImages = [];
    this.samples.forEach((sample, idx) => {
      const img = new Image();
      img.src = sample.imagePath;
      img.onload = () => {
        if (this.currentRoundIndex === idx) {
          this.drawScene();
        }
      };
      this.loadedImages[idx] = img;
    });

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.setupCanvasResolution();
    this.updateMetaDisplay();
    this.drawScene();
    this.bindEvents();
  }

  setupCanvasResolution() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 640;
    this.canvas.height = rect.height || 380;
  }

  getCurrentSample() {
    return this.samples[this.currentRoundIndex] || this.samples[0];
  }

  updateMetaDisplay() {
    const sample = this.getCurrentSample();
    if (this.roundBadge) {
      this.roundBadge.textContent = `SEED ${sample.round} (${sample.seedName})`;
    }
    if (this.imageFileDisplay) {
      this.imageFileDisplay.textContent = sample.imageName;
    }
    if (this.imageDescDisplay) {
      const bddMeta = sample.bddMetadata || {};
      this.imageDescDisplay.innerHTML = `${sample.description} <br><span style="color: var(--neon-cyan); font-family: var(--font-mono); font-size: 0.72rem;">[BDD10K GT: ${bddMeta.numObjects || 0} vật thể | ${bddMeta.scene} | ${bddMeta.weather} | ${bddMeta.timeofday} | Đối chuẩn 100% Read-Only ✓]</span>`;
    }

    // Update active pill button
    if (this.roundPills && this.roundPills.length > 0) {
      this.roundPills.forEach((btn, idx) => {
        if (idx === this.currentRoundIndex) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update accuracy boost display
    this.updateMeter(sample.anchorMap);
  }

  drawScene() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;
    const sample = this.getCurrentSample();
    const img = this.loadedImages[this.currentRoundIndex];

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Real Dashcam Image or Fallback Gradient
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, w, h);
      
      // Subtle contrast tint to enhance HUD overlays
      ctx.fillStyle = 'rgba(2, 6, 18, 0.18)';
      ctx.fillRect(0, 0, w, h);
    } else {
      // Atmospheric fallback while image is loading
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(0.5, '#0b1122');
      bgGrad.addColorStop(1, '#020307');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '12px "Roboto Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Đang nạp ảnh thực tế ${sample.imageName}...`, w / 2, h / 2);
      ctx.textAlign = 'start';
    }

    // 2. Draw Bounding Boxes
    const boxes = sample.boxes || [];
    boxes.forEach(box => {
      this.drawBox(box, w, h);
    });

    // 3. Draw Watermark HUD Overlay
    ctx.font = '10px "Roboto Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(sample.hudText || 'CAM_FRONT_01 | BDD10K REAL HITL SPLIT | 1080P 1FPS', 14, 22);
    
    ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.fillText(`MỤC TIÊU VÒNG ${sample.round}: ${sample.targetMap.toFixed(2)}% mAP | ĐỐI CHUẨN: bdd10k_metadata.json (Read-Only)`, 14, 38);
    ctx.shadowBlur = 0;
  }

  drawBox(box, canvasW, canvasH) {
    const ctx = this.ctx;
    ctx.save();

    // Map normalized coordinates (cx, cy, w, h) to canvas pixels
    const bw = Math.max(28, box.w * canvasW);
    const bh = Math.max(28, box.h * canvasH);
    const bx = Math.max(4, Math.min(canvasW - bw - 4, (box.cx - box.w / 2) * canvasW));
    const by = Math.max(22, Math.min(canvasH - bh - 4, (box.cy - box.h / 2) * canvasH));

    const isTier1 = box.tier === 1;
    const isApproved = box.approved;
    const isCorrected = box.corrected;

    let strokeColor = isTier1 ? '#10b981' : '#f59e0b';
    if (isTier1 && isApproved) strokeColor = '#34d399';
    if (!isTier1 && isCorrected) strokeColor = '#06b6d4';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = isApproved || isCorrected ? 2.5 : 1.8;

    if (!isTier1 && !isCorrected) {
      ctx.setLineDash([5, 5]); // Dashed box for uncertain Tier 2
    } else {
      ctx.setLineDash([]);
    }

    // Box Rect
    ctx.strokeRect(bx, by, bw, bh);

    // Fill tinted
    let fillColor = isTier1 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.14)';
    if (isCorrected) fillColor = 'rgba(6, 182, 212, 0.20)';
    ctx.fillStyle = fillColor;
    ctx.fillRect(bx, by, bw, bh);

    // Label Badge
    ctx.font = '10px "Roboto Mono", monospace';
    const displayLabel = isCorrected && box.gtLabel ? box.gtLabel : box.label;
    const statusText = isCorrected ? '✓ BDD10K GT' : isApproved ? '✓ AUTO ACC' : isTier1 ? 'AI PRE-LABEL' : '? TIER 2';
    const labelText = `${displayLabel.toUpperCase()} (${(box.conf * 100).toFixed(0)}%) ${statusText}`;
    const textW = ctx.measureText(labelText).width;

    ctx.fillStyle = strokeColor;
    ctx.fillRect(bx, by - 18, textW + 8, 18);

    ctx.fillStyle = '#06090f';
    ctx.font = 'bold 9.5px "Roboto Mono", monospace';
    ctx.fillText(labelText, bx + 4, by - 5);

    ctx.restore();
  }

  setRound(index) {
    if (index < 0 || index >= this.samples.length) return;
    this.currentRoundIndex = index;
    this.updateMetaDisplay();
    this.drawScene();
    
    const sample = this.getCurrentSample();
    this.showToast(`🔍 Đã nạp khung hình thật từ ${sample.seedName} (${sample.imageName})`);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupCanvasResolution();
      this.drawScene();
    });

    // Round Selector Pill Buttons
    const pillsContainer = document.getElementById('oracleRoundSelector');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.round-pill-btn');
        if (!btn) return;
        const roundIdx = parseInt(btn.dataset.round, 10);
        if (!isNaN(roundIdx)) {
          this.setRound(roundIdx);
        }
      });
    }

    // 1. Approve Tier 1
    if (this.approveTier1Btn) {
      this.approveTier1Btn.addEventListener('click', () => {
        const sample = this.getCurrentSample();
        sample.boxes.forEach(b => {
          if (b.tier === 1) b.approved = true;
        });
        this.drawScene();
        this.showToast(`✅ Đã duyệt Tier 1 (${sample.round}): Giảm 26.67% thời gian gán nhãn nhờ AI Consensus!`);
        
        // Midpoint boost
        const midScore = sample.anchorMap + (sample.targetMap - sample.anchorMap) * 0.45;
        this.updateMeter(midScore);
      });
    }

    // 2. Correct Tier 2 (Simulate Human Oracle Correction using BDD10K Ground Truth)
    if (this.correctTier2Btn) {
      this.correctTier2Btn.addEventListener('click', () => {
        const sample = this.getCurrentSample();
        const correctedList = [];
        sample.boxes.forEach(b => {
          if (b.tier === 2) {
            b.corrected = true;
            b.conf = 1.0; // Human Oracle review = 100% Ground Truth
            correctedList.push(b.gtLabel);
          }
        });
        this.drawScene();
        this.showToast(`🎯 Chuyên gia Human Oracle: Sửa nhãn theo Chân Lý BDD10K (${correctedList.join(', ')}) - Conf 100%!`);
        
        // Oracle boost
        const oracleScore = sample.anchorMap + (sample.targetMap - sample.anchorMap) * 0.85;
        this.updateMeter(oracleScore);
      });
    }

    // 3. Submit to Gold Batch
    if (this.submitBatchBtn) {
      this.submitBatchBtn.addEventListener('click', () => {
        const sample = this.getCurrentSample();
        const hasApprovedOrCorrected = sample.boxes.some(b => b.approved || b.corrected);
        if (!hasApprovedOrCorrected) {
          this.showToast('⚠️ Vui lòng duyệt Tier 1 hoặc sửa Tier 2 trước khi đóng gói Batch!');
          return;
        }
        
        this.updateMeter(sample.targetMap);
        this.flashCanvasCelebration();
        this.showToast(`🏆 Batch Đóng Gói Thành Công: Model ${sample.round} mAP đạt đỉnh ${sample.targetMap.toFixed(2)}%!`);
      });
    }

    // 4. Reset Scene / Next Scene
    if (this.resetSceneBtn) {
      this.resetSceneBtn.addEventListener('click', () => {
        const nextIndex = (this.currentRoundIndex + 1) % this.samples.length;
        this.setRound(nextIndex);
      });
    }
  }

  updateMeter(score) {
    if (this.accuracyBoostVal) {
      this.accuracyBoostVal.textContent = `${score.toFixed(2)}%`;
    }
    if (this.meterFill) {
      // Map score from 20.23% to 28.0% -> percentage of bar (25% to 100%)
      const pct = Math.min(100, Math.max(20, ((score - 18) / 10) * 100));
      this.meterFill.style.width = `${pct}%`;
    }
  }

  flashCanvasCelebration() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    setTimeout(() => {
      this.drawScene();
    }, 250);
    ctx.restore();
  }

  showToast(message) {
    let container = document.getElementById('hudToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hudToastContainer';
      container.className = 'hud-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'hud-toast';
    toast.innerHTML = `
      <span class="toast-icon">⚡</span>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}
