/**
 * BDD10K ACTIVE LEARNING LAB - ROI & RESOURCE EFFICIENCY CALCULATOR
 * Tính toán hiệu quả kinh tế và tối ưu tài nguyên gán nhãn thực tế
 */

export class RoiCalculator {
  constructor() {
    this.fleetSlider = document.getElementById('calcFleetSize');
    this.hoursSlider = document.getElementById('calcOperatingHours');
    this.costSlider = document.getElementById('calcLabelCost');

    this.fleetVal = document.getElementById('calcFleetVal');
    this.hoursVal = document.getElementById('calcHoursVal');
    this.costVal = document.getElementById('calcCostVal');

    this.bigSavingsDisplay = document.getElementById('calcTotalSavings');
    this.savedHoursDisplay = document.getElementById('calcSavedHours');
    this.filteredFramesDisplay = document.getElementById('calcFilteredFrames');
    this.co2Display = document.getElementById('calcCo2Saved');
    this.calcFormulaNote = document.getElementById('calcFormulaNote');

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const inputs = [this.fleetSlider, this.hoursSlider, this.costSlider];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.calculate());
      }
    });
  }

  calculate() {
    if (!this.fleetSlider || !this.hoursSlider || !this.costSlider) return;

    const fleetSize = parseInt(this.fleetSlider.value, 10) || 10;
    const hoursPerDay = parseInt(this.hoursSlider.value, 10) || 8;
    const costPerImage = parseFloat(this.costSlider.value) || 2.0;

    if (this.fleetVal) this.fleetVal.textContent = `${fleetSize} xe`;
    if (this.hoursVal) this.hoursVal.textContent = `${hoursPerDay} giờ/ngày`;
    if (this.costVal) this.costVal.textContent = `$${costPerImage.toFixed(2)}/ảnh`;

    // 1. Raw frames per month: 30 FPS * 3600s * hours * fleet * 30 days
    // Temporal 1 FPS cuts by 30x. pHash Dedup filters 30.06% of remaining.
    // 2. Dynamic Campaign Baseline:
    // Mỗi xe vận hành 1 giờ/ngày tạo ra ~625 ảnh mục tiêu thẩm định trong đợt chiến dịch hàng tháng.
    // Với 10 xe x 8 giờ/ngày = 50.000 ảnh chuẩn.
    // Khi tăng quy mô đội xe hoặc số giờ chạy, khối lượng ảnh chiến dịch tăng tỷ lệ thuận.
    const baselineTargetFrames = Math.round(fleetSize * hoursPerDay * 625);
    
    // 3. Proposed Active Learning chỉ cần gán nhãn 59.9% (~60% pool) để vượt điểm trần 100%:
    const activeSelectedFrames = Math.round(baselineTargetFrames * 0.599);
    const savedFrames = baselineTargetFrames - activeSelectedFrames; // Tiết kiệm 40.1% khối lượng

    // 4. Phân tích chi phí:
    // Chi phí gán nhãn thủ công mù quáng (Baseline):
    const rawCostBaseline = baselineTargetFrames * costPerImage;

    // Chi phí với kiến trúc HITL (60% ảnh được chọn):
    // - 26.67% ảnh thuộc Tier 1 (AI consensus cao, chỉ mất 20% chi phí duyệt nhanh)
    // - 73.33% ảnh thuộc Tier 2 (Human Oracle thẩm định chuyên sâu)
    const tier2Cost = (activeSelectedFrames * (1 - 0.2667)) * costPerImage;
    const tier1PrelabelCost = (activeSelectedFrames * 0.2667) * (costPerImage * 0.20);
    const activeTotalCost = tier2Cost + tier1PrelabelCost;

    const totalSavingsDollars = Math.round(rawCostBaseline - activeTotalCost);
    const annotationHoursSaved = Math.round((savedFrames * 2.5) / 60); // ~2.5 phút/ảnh thủ công
    const co2SavedKg = Math.round(savedFrames * 0.045); // Dấu chân carbon GPU training & storage

    if (this.bigSavingsDisplay) {
      this.bigSavingsDisplay.textContent = `$${totalSavingsDollars.toLocaleString()}`;
    }
    if (this.savedHoursDisplay) {
      this.savedHoursDisplay.textContent = `${annotationHoursSaved.toLocaleString()} giờ`;
    }
    if (this.filteredFramesDisplay) {
      this.filteredFramesDisplay.textContent = `${savedFrames.toLocaleString()} ảnh`;
    }
    if (this.co2Display) {
      this.co2Display.textContent = `${co2SavedKg.toLocaleString()} kg CO₂`;
    }
    if (this.calcFormulaNote) {
      this.calcFormulaNote.innerHTML = `💡 <em>Ước tính quy mô chiến dịch: <strong>${baselineTargetFrames.toLocaleString()}</strong> ảnh/tháng (từ ${fleetSize} xe × ${hoursPerDay} giờ/ngày). Tiết kiệm 40.1% khối lượng nhờ C6 Active Mining và giảm 26.67% chi phí Tier 1 Pre-labeling.</em>`;
    }
  }
}
