/**
 * BDD10K ACTIVE LEARNING LAB - DYNAMIC BENCHMARK ARENA
 * Trình diễn đồ thị học tập 5 vòng lặp, bảng tiến hóa 10 lớp và Equalizer trọng số C_w
 */

import { ITERATIONS_DATA, TEN_CLASSES_INFO } from './data.js';

export class BenchmarkCharts {
  constructor() {
    this.currentIterIndex = 5; // Default to V5 Victory
    
    this.slider = document.getElementById('iterationSlider');
    this.tickItems = document.querySelectorAll('.scrubber-tick-item');
    
    this.curveCanvas = document.getElementById('learningCurveCanvas');
    this.curveCtx = this.curveCanvas ? this.curveCanvas.getContext('2d') : null;

    this.tableBody = document.getElementById('tenClassesTableBody');
    this.equalizerContainer = document.getElementById('equalizerChannels');

    // Seed Diagnostic Elements
    this.diagSeedTitle = document.getElementById('diagSeedTitle');
    this.diagEvalModel = document.getElementById('diagEvalModel');
    this.diagDeltaGain = document.getElementById('diagDeltaGain');
    this.diagGtBoxes = document.getElementById('diagGtBoxes');
    this.diagDetectBoxes = document.getElementById('diagDetectBoxes');
    this.diagAvgConf = document.getElementById('diagAvgConf');
    this.diagFalseNeg = document.getElementById('diagFalseNeg');
    this.diagMissRate = document.getElementById('diagMissRate');
    this.diagFalsePos = document.getElementById('diagFalsePos');
    this.diagConfusionsCount = document.getElementById('diagConfusionsCount');
    this.diagHardSlicesNote = document.getElementById('diagHardSlicesNote');
    this.diagHardSlicesList = document.getElementById('diagHardSlicesList');
    this.diagConfusionsList = document.getElementById('diagConfusionsList');
    this.diagImpactBanner = document.getElementById('diagImpactBanner');

    // Missing DOM element references for Scrubber Telemetry
    this.iterBadge = document.getElementById('currentIterBadge');
    this.iterPoolPct = document.getElementById('currentIterPoolPct');
    this.iterProposedMap = document.getElementById('currentProposedMap');
    this.iterRandomMap = document.getElementById('currentRandomMap');
    this.iterDeltaMap = document.getElementById('currentDeltaMap');
    this.iterProposedF1 = document.getElementById('currentProposedF1');
    this.iterNote = document.getElementById('currentIterNote');

    this.init();
  }

  init() {
    this.setupCanvas();
    this.bindEvents();
    this.updateIteration(this.currentIterIndex);
  }

  setupCanvas() {
    if (!this.curveCanvas || !this.curveCtx) return;
    const container = this.curveCanvas.parentElement;
    const rect = container ? container.getBoundingClientRect() : this.curveCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Use full container dimensions with ample fallbacks
    const displayW = Math.max(560, Math.floor(rect.width || 680));
    const displayH = Math.max(380, Math.floor(rect.height || 420));

    this.curveCanvas.width = Math.round(displayW * dpr);
    this.curveCanvas.height = Math.round(displayH * dpr);

    this.canvasDisplayW = displayW;
    this.canvasDisplayH = displayH;
    this.dpr = dpr;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.drawLearningCurve();
    });

    if (window.ResizeObserver && this.curveCanvas && this.curveCanvas.parentElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.setupCanvas();
        this.drawLearningCurve();
      });
      this.resizeObserver.observe(this.curveCanvas.parentElement);
    }

    if (this.slider) {
      this.slider.addEventListener('input', (e) => {
        const idx = parseInt(e.target.value, 10);
        this.updateIteration(idx);
      });
    }

    this.tickItems.forEach(tick => {
      tick.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (this.slider) this.slider.value = idx;
        this.updateIteration(idx);
      });
    });
  }

  updateIteration(index) {
    this.currentIterIndex = index;
    const data = ITERATIONS_DATA[index] || ITERATIONS_DATA[5];

    // Update Scrubber Ticks
    this.tickItems.forEach(t => {
      const tIdx = parseInt(t.dataset.index, 10);
      t.classList.toggle('active', tIdx === index);
    });

    // Update Telemetry KPI Texts
    if (this.iterBadge) this.iterBadge.textContent = data.iteration;
    if (this.iterPoolPct) this.iterPoolPct.textContent = `${data.poolPercent}% Pool (${data.labeledImages} ảnh)`;
    if (this.iterProposedMap) this.iterProposedMap.textContent = `${data.proposedMap50.toFixed(2)}%`;
    if (this.iterRandomMap) this.iterRandomMap.textContent = `${data.randomMap50.toFixed(2)}%`;
    if (this.iterDeltaMap) {
      const sign = data.delta >= 0 ? '+' : '';
      this.iterDeltaMap.textContent = `${sign}${data.delta.toFixed(2)}%`;
      this.iterDeltaMap.style.color = data.delta > 0 ? 'var(--neon-emerald)' : 'var(--text-muted)';
    }
    if (this.iterProposedF1) this.iterProposedF1.textContent = `${data.proposedF1.toFixed(2)}%`;
    if (this.iterNote) this.iterNote.textContent = data.statusNote;

    // Draw Curve
    this.drawLearningCurve();

    // Render Table
    this.renderTenClassesTable(data);

    // Render Equalizer
    this.renderCwEqualizer(data);

    // Render Seed Diagnostic & Error Audit
    this.renderSeedDiagnostic(data);
  }

  drawLearningCurve() {
    if (!this.curveCanvas || !this.curveCtx) return;
    const ctx = this.curveCtx;
    const w = this.canvasDisplayW || 680;
    const h = this.canvasDisplayH || 420;
    const dpr = this.dpr || 1;

    // Clear with identity matrix and then scale by DPR
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.curveCanvas.width, this.curveCanvas.height);
    ctx.scale(dpr, dpr);

    const padLeft = 68;
    const padRight = 36;
    const padTop = 50;
    const padBottom = 52;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const minMap = 18.0;
    const maxMap = 30.0;

    const getY = (val) => padTop + plotH - ((val - minMap) / (maxMap - minMap)) * plotH;
    const getX = (idx) => padLeft + (idx / 5) * plotW;

    // 1. Grid lines & Y-Axis Labels (Explicitly Right-Aligned at padLeft - 14)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '600 11px "Roboto Mono", monospace';

    for (let m = 18; m <= 30; m += 2) {
      const y = getY(m);
      
      // Horizontal subtle grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      // Clean Y-axis tick label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillText(`${m}%`, padLeft - 14, y);
    }

    // 2. X-Axis Ticks (V0 -> V5) with Pool % Labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ITERATIONS_DATA.forEach((iter, i) => {
      const x = getX(i);
      const isSelected = i === this.currentIterIndex;

      // Vertical tick mark
      ctx.strokeStyle = isSelected ? 'var(--neon-emerald)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x, padTop + plotH);
      ctx.lineTo(x, padTop + plotH + 6);
      ctx.stroke();

      // Main Iteration label
      ctx.fillStyle = isSelected ? 'var(--neon-emerald)' : 'rgba(255, 255, 255, 0.5)';
      ctx.font = isSelected ? 'bold 12.5px "Roboto Mono", monospace' : '11px "Roboto Mono", monospace';
      ctx.fillText(`V${i}`, x, h - padBottom + 12);

      // Sub-label with Pool percent
      ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.95)' : 'rgba(255, 255, 255, 0.3)';
      ctx.font = '9.5px "Roboto Mono", monospace';
      ctx.fillText(`${iter.poolPercent}%`, x, h - padBottom + 28);
    });

    // 3. 100% Target Ceiling Horizontal Line (26.85%)
    const ceilingY = getY(26.85);
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(padLeft, ceilingY);
    ctx.lineTo(w - padRight, ceilingY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ceiling Label Badge
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px "Roboto Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('100% Target Ceiling (26.85%)', w - padRight - 4, ceilingY - 6);

    // 4. Random Baseline Curve (Muted Crimson)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ITERATIONS_DATA.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.randomMap50);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Random Curve Dots
    ITERATIONS_DATA.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.randomMap50);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Proposed Active Learning Area Fill (Lush Neon Emerald Gradient)
    const areaGrad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    ctx.beginPath();
    ctx.moveTo(getX(0), padTop + plotH);
    ITERATIONS_DATA.forEach((d, i) => {
      ctx.lineTo(getX(i), getY(d.proposedMap50));
    });
    ctx.lineTo(getX(5), padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // 6. Proposed Active Learning Curve (Thick Glowing Emerald Line)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.65)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ITERATIONS_DATA.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.proposedMap50);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // 7. Proposed Curve Points & Badges
    ITERATIONS_DATA.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.proposedMap50);
      const isSelected = i === this.currentIterIndex;

      // Outer rings if selected
      if (isSelected) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Point Dot
      ctx.fillStyle = isSelected ? '#ffffff' : '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 6.5 : 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Score Value Badge above point
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = isSelected ? 'bold 12px "Roboto Mono", monospace' : '600 10.5px "Roboto Mono", monospace';
      ctx.fillStyle = isSelected ? '#34d399' : 'rgba(255, 255, 255, 0.85)';

      const badgeY = isSelected ? y - 18 : y - 8;
      const labelText = `${d.proposedMap50.toFixed(2)}%${i === 5 ? ' ★' : ''}`;
      ctx.fillText(labelText, x, badgeY);
    });
  }

  renderTenClassesTable(iterData) {
    if (!this.tableBody) return;
    this.tableBody.innerHTML = TEN_CLASSES_INFO.map(cls => {
      const classData = iterData.classes[cls.key] || { proposed: 0, random: 0, target: cls.target };
      const delta = (classData.proposed - classData.random).toFixed(1);
      const isOverCeiling = classData.proposed >= classData.target;

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${cls.color};"></span>
              <strong style="color: var(--text-primary);">${cls.label}</strong>
            </div>
          </td>
          <td><span style="color: var(--text-muted);">${classData.target.toFixed(1)}%</span></td>
          <td><span style="color: #f87171;">${classData.random.toFixed(1)}%</span></td>
          <td>
            <strong style="color: ${isOverCeiling ? 'var(--neon-emerald)' : '#fff'};">
              ${classData.proposed.toFixed(1)}% ${isOverCeiling ? '★' : ''}
            </strong>
          </td>
          <td>
            <span class="gain-pill ${delta > 0 ? 'gain-positive' : ''}">
              ${delta >= 0 ? '+' : ''}${delta}%
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderCwEqualizer(iterData) {
    if (!this.equalizerContainer) return;
    const weights = iterData.cwWeights || {};

    this.equalizerContainer.innerHTML = TEN_CLASSES_INFO.map(cls => {
      const w = weights[cls.key] || 1.0;
      // Max C_w is 25.0x
      const fillPct = Math.min(100, (w / 25.0) * 100);
      const isClamped = w <= 0.25;

      return `
        <div class="eq-column ${isClamped ? 'eq-clamped' : ''}" title="${cls.label}: ${w.toFixed(2)}x ${isClamped ? '(Sàn An Toàn 0.20x: Đã bão hòa >60% mAP và chiếm >55% dữ liệu BDD10K)' : ''}">
          <div class="eq-value" style="color: ${isClamped ? '#f87171' : 'var(--neon-cyan)'}; font-weight: ${isClamped ? '800' : '600'};">
            ${w.toFixed(1)}x
          </div>
          <div class="eq-bar-track">
            <div class="eq-bar-fill ${isClamped ? 'clamped' : ''}" style="height: ${fillPct}%;"></div>
          </div>
          <div class="eq-label">${cls.key}</div>
          ${isClamped ? '<span class="eq-badge-clamped">SÀN</span>' : ''}
        </div>
      `;
    }).join('');
  }

  renderSeedDiagnostic(iterData) {
    const diag = iterData.diagnostic;
    if (!diag) return;

    if (this.diagSeedTitle) {
      this.diagSeedTitle.textContent = `Báo Cáo Chẩn Đoán Hạt Giống: ${(iterData.seedName || iterData.iteration).toUpperCase()}`;
    }
    if (this.diagEvalModel) {
      this.diagEvalModel.textContent = `Đo bởi: ${diag.evalModel}`;
    }
    if (this.diagDeltaGain) {
      this.diagDeltaGain.textContent = `Tác động: Δ = ${diag.delta || '+0.00%'} mAP`;
    }

    if (this.diagGtBoxes) {
      this.diagGtBoxes.textContent = typeof diag.gtBoxes === 'number' ? diag.gtBoxes.toLocaleString() : diag.gtBoxes;
    }
    if (this.diagDetectBoxes) {
      this.diagDetectBoxes.textContent = typeof diag.detectedBoxes === 'number' ? diag.detectedBoxes.toLocaleString() : diag.detectedBoxes;
    }
    if (this.diagAvgConf) {
      this.diagAvgConf.textContent = `Độ tự tin TB: ${diag.avgConfidence}`;
    }
    if (this.diagFalseNeg) {
      this.diagFalseNeg.textContent = typeof diag.falseNegatives === 'number' ? diag.falseNegatives.toLocaleString() : diag.falseNegatives;
    }
    if (this.diagMissRate) {
      this.diagMissRate.textContent = `Miss Rate: ${diag.missRate || '0.0%'} (Cần vá)`;
    }
    if (this.diagFalsePos) {
      this.diagFalsePos.textContent = typeof diag.falsePositives === 'number' ? diag.falsePositives.toLocaleString() : diag.falsePositives;
    }
    if (this.diagConfusionsCount) {
      this.diagConfusionsCount.textContent = `${diag.confusionPairsCount} cặp nhầm lẫn lớp`;
    }

    if (this.diagHardSlicesNote) {
      this.diagHardSlicesNote.textContent = `${diag.numImages} ảnh hạt giống`;
    }

    // Render 6 Hard Slices Distribution
    if (this.diagHardSlicesList && diag.hardSlices) {
      const slices = [
        { key: 'night', label: '🌙 Ban đêm (is_night)', count: diag.hardSlices.night },
        { key: 'small', label: '🔍 Vật thể nhỏ (is_small)', count: diag.hardSlices.small },
        { key: 'occlusion', label: '🧱 Che khuất (is_occlusion)', count: diag.hardSlices.occlusion },
        { key: 'weather', label: '🌧️ Thời tiết xấu (is_weather)', count: diag.hardSlices.weather },
        { key: 'blur', label: '📷 Rung lắc mờ (is_blur)', count: diag.hardSlices.blur },
        { key: 'dense', label: '🚦 Mật độ dày (is_dense)', count: diag.hardSlices.dense }
      ];

      this.diagHardSlicesList.innerHTML = slices.map(s => {
        const pct = Math.round((s.count / diag.numImages) * 100);
        return `
          <div class="slice-item">
            <span class="slice-label">${s.label}</span>
            <div class="slice-bar-track">
              <div class="slice-bar-fill" style="width: ${Math.min(100, pct)}%;"></div>
            </div>
            <span class="slice-val">${s.count} <small style="color: var(--text-muted); font-size: 0.65rem;">(${pct}%)</small></span>
          </div>
        `;
      }).join('');
    }

    // Render Confusion Pairs
    if (this.diagConfusionsList) {
      if (!diag.topConfusions || diag.topConfusions.length === 0) {
        this.diagConfusionsList.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic; padding: 6px 0;">
            Tập mầm V0 khởi nguyên — Chưa có mô hình tiền nhiệm để so khớp ảo giác phân loại.
          </div>
        `;
      } else {
        this.diagConfusionsList.innerHTML = diag.topConfusions.map(c => `
          <div class="confusion-chip">
            <span>⚠️ <strong>${c.pair}</strong></span>
            <span class="confusion-count">${c.count}</span>
          </div>
        `).join('');
      }
    }

    // Render Impact Banner
    if (this.diagImpactBanner) {
      this.diagImpactBanner.innerHTML = `
        <span style="font-size: 1.2rem;">🎯</span>
        <div>
          <strong>Chiến lược hạt giống:</strong> ${diag.impact}
          <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 3px;">${diag.deficitFocus || ''}</div>
        </div>
      `;
    }
  }
}
