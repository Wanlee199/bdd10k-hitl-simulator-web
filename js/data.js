/**
 * BDD10K ACTIVE LEARNING LAB - GROUND TRUTH BENCHMARK & PIPELINE DATA
 * Nguồn dữ liệu mới nhất: 
 *   - reports/seeds/seeds_summary_and_weakness_evolution.md
 *   - reports/seeds/seed_v0_diagnostic_report.md -> seed_v5_diagnostic_report.md
 *   - data/splits/reports/strategy_tournament_benchmark.json
 *   - data/splits/reports/frozen_splits_audit_report.json
 * Tác giả nghiên cứu: T018
 */

export const PROJECT_METADATA = {
  title: "BDD10K Active Learning Lab",
  subtitle: "Hệ thống Tự Động Hóa Vòng Lặp Dữ Liệu Cho Thị Giác Xe Tự Hành",
  author: "T018",
  version: "Production Release v4.0",
  dataset: "BDD10K Autonomous Driving Dataset",
  coreArchitecture: "Dual-Model Engine (YOLO11n Mining Engine vs RT-DETR Counterpart)",
  masterVerdict: "VICTORY_CONFIRMED",
  totalRawFrames: 10000,
  uniquePoolFrames: 6994,
  leakageFreeSplits: {
    fixedTest: 1400, // 20%
    fixedVal: 700,   // 10%
    seedV0: 500,     // 500 ảnh mầm ban đầu (10% pool)
    unlabeledPool: 4394
  },
  headlineMetrics: {
    v0Map50: 20.23,
    randomV5Map50: 22.90,
    target100Map50: 26.85,
    proposedV5Map50: 27.85,
    deltaVsRandom: "+4.95%",
    deltaVsTarget100: "+1.00%",
    budgetSaved: "40.1%",
    dedupThroughput: ">360 FPS",
    inferenceLatency: "<8 ms (INT8)",
    dataVolumeRatio: "60% Pool (3,336 ảnh) thắng 100% Target (5,565 ảnh)"
  }
};

export const PIPELINE_STAGES = [
  {
    id: 1,
    name: "Edge Ingestion & FastDedup",
    shortName: "Edge Dedup",
    tag: "Chặng 1",
    subtitle: "Lọc trùng lặp siêu tốc tại camera hành trình",
    hardware: "CPU trên xe (>360 FPS)",
    description: "Camera hành trình 30 FPS thu về hàng triệu khung hình giống hệt nhau khi dừng đèn đỏ. Chặng 1 lấy mẫu 1 FPS và tính mã băm nhận thức pHash 64-bit qua DCT, loại bỏ khung hình có khoảng cách Hamming < 5 bit với cơ chế Keep-Most-Vehicles (KMV).",
    math: "\\text{HD}(H_1, H_2) = \\sum_{k=0}^{63} \\left( H_1[k] \\oplus H_2[k] \\right) < 5 \\implies \\text{Drop}",
    metrics: { throughput: ">360 FPS", filterRate: "30.06% bỏ trùng", storageAdded: "0 KB" },
    status: "OPTIMIZED",
    icon: "filter"
  },
  {
    id: 2,
    name: "Multi-Domain Unlabeled Profiling",
    shortName: "Data Profiling",
    tag: "Chặng 2",
    subtitle: "Trích xuất 11 thuộc tính vật lý không cần nhãn",
    hardware: "Edge Ring Buffer / Storage Cluster",
    description: "Phân tích đặc tính quang học của từng khung hình trước khi gán nhãn: độ sáng HSV, phân rã phản xạ Retinex, độ sắc nét Tenengrad, tỷ lệ nhiễu Laplacian để gắn thẻ môi trường (Đêm, Mưa, Ngược sáng, Sương mù).",
    math: "S_{\\text{sharp}} = \\frac{1}{|\\Omega|} \\sum_{(x,y)} \\left( G_x(x,y)^2 + G_y(x,y)^2 \\right)",
    metrics: { attributes: "11 Features", zeroLabel: "100% Unsupervised", latency: "12ms/frame" },
    status: "COMPLETED",
    icon: "activity"
  },
  {
    id: 3,
    name: "Stratified Video-Isolated Splitting",
    shortName: "Zero Leakage",
    tag: "Chặng 3",
    subtitle: "Phân chia dữ liệu cách ly tuyệt đối video ID",
    hardware: "Data Management Layer",
    description: "Giải đấu Strategy Tournament với Quán quân Hybrid Mix 80/20 (Score 93.59). Đóng băng 1.400 Test (20%) và 700 Val (10%). Quét kiểm toán 13,454,400 cặp ảnh chéo: 0 vi phạm pHash Hamming < 5, bảo toàn 100% Zero Leakage với Symlink 0 KB.",
    math: "\\text{Video}(\\mathcal{D}_{\\text{test}}) \\cap \\text{Video}(\\mathcal{D}_{\\text{train}}) = \\emptyset",
    metrics: { testSet: "1.400 ảnh", valSet: "700 ảnh", leakageViolations: "0 / 13.45M" },
    status: "LOCKED_GOLD",
    icon: "shield"
  },
  {
    id: 4,
    name: "Seed V0 Initialization (Cold Start)",
    shortName: "Seed V0",
    tag: "Chặng 4",
    subtitle: "Khởi tạo tập mầm 500 ảnh bằng Hybrid Mix 80/20",
    hardware: "YOLO11n Anchor Trainer",
    description: "Giải quyết bài toán Cold Start: Tuyển chọn 500 ảnh mầm cân bằng 4 lát cắt khó (35% Đêm, 20% Vật thể nhỏ, 20% Che khuất, 25% Ban ngày) với 9,887 GT boxes, đặt nền móng đạt 20.23% mAP50 khởi đầu.",
    math: "\\mathcal{S}_{\\text{seed}} = \\mathcal{S}_{\\text{stratified}}^{(400)} \\cup \\mathcal{S}_{\\text{facility}}^{(100)}",
    metrics: { seedCount: "500 ảnh (10% Pool)", anchorMap50: "20.23%", precision: "53.09%" },
    status: "ANCHOR_READY",
    icon: "zap"
  },
  {
    id: 5,
    name: "C6 Super-Fusion Active Mining",
    shortName: "Active Mining",
    tag: "Chặng 5",
    subtitle: "Khai thác mẫu thâm hụt bất định đa miền",
    hardware: "Mining Inference Engine",
    description: "Động cơ cốt lõi: Chấm điểm từng ảnh chưa gán nhãn bằng tích hợp 3 trục: Độ bất định Shannon Entropy, Trọng số thâm hụt lớp động C_w, và Độ khó lát cắt môi trường, sau đó lọc đa dạng không gian PCA 32D bằng hàm Submodular Facility Location.",
    math: "S(x_i) = U(x_i) \\times \\sum_{k=1}^{10} (C_w^{(k)} \\cdot P_k) \\times E_{\\text{slice}}(x_i)",
    metrics: { miningBatch: "K = 556 ảnh/vòng", redundancyPenalty: "PCA 32D k-Center", targetFocus: "Rare Classes" },
    status: "ACTIVE_ENGINE",
    icon: "cpu"
  },
  {
    id: 6,
    name: "Two-Tier Consensus HITL Router",
    shortName: "HITL Router",
    tag: "Chặng 6",
    subtitle: "Phân luồng chuyên gia thông minh 2 tầng",
    hardware: "Human-in-the-Loop Orchestrator",
    description: "Phân định ranh giới giữa AI và con người: Tier 1 tự động điền sẵn nhãn khi YOLO11n và RT-DETR đạt đồng thuận cao (Conf >= 0.75, tiết kiệm 26.67% công sức). Tier 2 đẩy các ca mơ hồ, vật thể che khuất vào CVAT cho chuyên gia thẩm định.",
    math: "\\text{IoU}(B_{\\text{YOLO}}, B_{\\text{DETR}}) \\ge 0.70 \\;\\land\\; \\min(\\text{Conf}) \\ge 0.75",
    metrics: { tier1Savings: "26.67%", tier2Precision: "100% Expert", qaSpotCheck: "10% Random" },
    status: "ORACLE_ENGAGED",
    icon: "users"
  },
  {
    id: 7,
    name: "Continuous Retraining with Replay",
    shortName: "Retraining",
    tag: "Chặng 7",
    subtitle: "Huấn luyện tiếp sức phòng chống quên thảm khốc",
    hardware: "PyTorch GPU Training Cluster",
    description: "Khi nhận batch hạt giống mới, YOLO11n được tái huấn luyện (Cfg-3: AdamW, Cosine LR Decay, Focal Loss) kết hợp Replay Buffer để bảo toàn tri thức cũ trong khi bứt phá các lớp mới (train từ 0% lên 16.2%).",
    math: "\\mathcal{L}_{\\text{total}} = \\mathcal{L}_{\\text{focal}}(V_k) + \\lambda \\mathcal{L}_{\\text{replay}}(\\text{Seed}_{V0})",
    metrics: { optimizer: "AdamW + Cosine", lossType: "Focal Loss", replayRatio: "20% Anchor" },
    status: "TRAINING_HOT",
    icon: "refresh-cw"
  },
  {
    id: 8,
    name: "5-Tier Stopping Gates Evaluation",
    shortName: "Stopping Gates",
    tag: "Chặng 8",
    subtitle: "Hệ thống phanh an toàn tự trị 5 tầng",
    hardware: "Evaluation Gatekeeper",
    description: "Kiểm định 5 điều kiện dừng nghiêm ngặt. Tại vòng 5 (60% Pool / 3.336 ảnh), hệ thống đạt 27.85% mAP50, vượt trần 100% Target (26.85%), kích hoạt Gate 1: VICTORY_CONFIRMED.",
    math: "\\Delta\\text{mAP}(V_k) \\ge 0 \\;\\land\\; \\text{mAP}(V_k) > \\text{mAP}_{\\text{ceiling}} \\implies \\text{VICTORY}",
    metrics: { gateStatus: "Gate 1 Triggered", victoryDelta: "+1.00% vs Ceiling", stopsAt: "Round 5 (60% Pool)" },
    status: "VICTORY_REACHED",
    icon: "check-circle"
  },
  {
    id: 9,
    name: "Edge Quantization & Telemetry Loop",
    shortName: "Edge Deploy",
    tag: "Chặng 9",
    subtitle: "Lượng tử hóa INT8 và phản hồi ngược từ đội xe",
    hardware: "Vehicle Edge Device (OpenVINO / ONNX)",
    description: "Mô hình chiến thắng được lượng tử hóa INT8 (độ trễ 7.8ms trên phần cứng xe). Xe vận hành trên đường tiếp tục ghi nhận các ca bất định cao và truyền ngược về Unlabeled Pool qua trạm sạc đêm, khép kín bánh đà tự học.",
    math: "W_{\\text{INT8}} = \\text{clamp}\\left( \\left\\lfloor \\frac{W_{\\text{FP32}}}{S} \\right\\rceil + Z, \\, -128, \\, 127 \\right)",
    metrics: { edgeLatency: "<8 ms", modelSize: "2.6M params (~6MB INT8)", loopStatus: "Closed Flywheel" },
    status: "PRODUCTION_DEPLOYED",
    icon: "send"
  }
];

export const ITERATIONS_DATA = [
  {
    iteration: "V0 (Seed)",
    seedName: "seed_v0",
    poolPercent: 10,
    labeledImages: 500,
    proposedMap50: 20.23,
    randomMap50: 20.23,
    targetCeiling: 26.85,
    proposedF1: 23.94,
    randomF1: 23.94,
    delta: 0.00,
    statusNote: "Khởi tạo tập mầm nền móng 500 ảnh phân tầng 4 lát cắt khó.",
    diagnostic: {
      numImages: 500,
      gtBoxes: 9887,
      evalModel: "None (Cold Start)",
      detectedBoxes: "-",
      truePositives: "-",
      falseNegatives: "-",
      falsePositives: "-",
      missRate: "-",
      avgConfidence: "-",
      confusionPairsCount: 0,
      hardSlices: { night: 159, small: 494, occlusion: 451, weather: 166, blur: 63, dense: 343 },
      topConfusions: [],
      impact: "Tập mầm nền móng: Thiết lập anchor 20.23% mAP@50 với 9,887 nhãn vàng chuẩn.",
      deficitFocus: "Khóa 4 lớp điểm liệt: train (0%), rider (2.2%), motor (2.1%), bike (3.2%)."
    },
    classes: {
      person: { proposed: 37.0, random: 37.0, target: 41.2 },
      rider: { proposed: 2.2, random: 2.2, target: 8.5 },
      car: { proposed: 60.4, random: 60.4, target: 64.5 },
      truck: { proposed: 21.5, random: 21.5, target: 27.8 },
      bus: { proposed: 16.5, random: 16.5, target: 24.6 },
      train: { proposed: 0.0, random: 0.0, target: 14.2 },
      motor: { proposed: 2.1, random: 2.1, target: 13.5 },
      bike: { proposed: 3.2, random: 3.2, target: 10.4 },
      traffic_light: { proposed: 28.2, random: 28.2, target: 31.8 },
      traffic_sign: { proposed: 31.2, random: 31.2, target: 34.9 }
    },
    cwWeights: {
      person: 15.82, rider: 24.24, car: 0.20, truck: 19.22, bus: 20.73,
      train: 25.00, motor: 24.26, bike: 23.84, traffic_light: 17.12, traffic_sign: 16.18
    }
  },
  {
    iteration: "V1",
    seedName: "seed_v1",
    poolPercent: 20,
    labeledImages: 1056,
    proposedMap50: 22.80,
    randomMap50: 20.95,
    targetCeiling: 26.85,
    proposedF1: 26.58,
    randomF1: 24.32,
    delta: 1.85,
    statusNote: "Bơm seed_v1 (556 ảnh): Cứu lớp tàu hỏa từ 0% lên 3.5%, motor lên 4.5%.",
    diagnostic: {
      numImages: 556,
      gtBoxes: 9964,
      evalModel: "YOLO11n V0",
      detectedBoxes: 4441,
      truePositives: 0,
      falseNegatives: 9964,
      falsePositives: 4441,
      missRate: "100.0%",
      avgConfidence: 0.499,
      confusionPairsCount: 11,
      hardSlices: { night: 532, small: 553, occlusion: 478, weather: 347, blur: 84, dense: 374 },
      topConfusions: [
        { pair: "car -> bus", count: 2 },
        { pair: "car -> traffic light", count: 2 },
        { pair: "traffic light -> person", count: 1 },
        { pair: "car -> rider", count: 1 },
        { pair: "car -> train", count: 1 }
      ],
      impact: "Nạp seed_v1 giúp mô hình nâng mAP@50 từ 20.23% (V0) lên 22.80% (V1) (Δ = +2.57%).",
      deficitFocus: "Tập trung phá vỡ điểm liệt: Đêm chiếm 532/556 ảnh (95.7%)."
    },
    classes: {
      person: { proposed: 38.0, random: 37.2, target: 41.2 },
      rider: { proposed: 3.8, random: 2.4, target: 8.5 },
      car: { proposed: 61.2, random: 60.5, target: 64.5 },
      truck: { proposed: 22.9, random: 21.6, target: 27.8 },
      bus: { proposed: 18.2, random: 16.8, target: 24.6 },
      train: { proposed: 3.5, random: 0.5, target: 14.2 },
      motor: { proposed: 4.5, random: 2.3, target: 13.5 },
      bike: { proposed: 4.8, random: 3.3, target: 10.4 },
      traffic_light: { proposed: 29.0, random: 28.4, target: 31.8 },
      traffic_sign: { proposed: 32.1, random: 31.4, target: 34.9 }
    },
    cwWeights: {
      person: 15.56, rider: 23.52, car: 0.20, truck: 18.86, bus: 20.22,
      train: 23.63, motor: 23.30, bike: 23.09, traffic_light: 16.81, traffic_sign: 15.83
    }
  },
  {
    iteration: "V2",
    seedName: "seed_v2",
    poolPercent: 30,
    labeledImages: 1612,
    proposedMap50: 24.65,
    randomMap50: 21.60,
    targetCeiling: 26.85,
    proposedF1: 29.16,
    randomF1: 24.80,
    delta: 3.05,
    statusNote: "Bơm seed_v2 (556 ảnh): Đánh mạnh ca rung lắc mờ & đêm, motor đạt 7.2%, bus lên 20.5%.",
    diagnostic: {
      numImages: 556,
      gtBoxes: 10262,
      evalModel: "YOLO11n V1",
      detectedBoxes: 4427,
      truePositives: 0,
      falseNegatives: 10262,
      falsePositives: 4427,
      missRate: "100.0%",
      avgConfidence: 0.502,
      confusionPairsCount: 2,
      hardSlices: { night: 470, small: 556, occlusion: 471, weather: 226, blur: 111, dense: 377 },
      topConfusions: [
        { pair: "traffic sign -> bus", count: 1 },
        { pair: "car -> truck", count: 1 }
      ],
      impact: "Nạp seed_v2 nâng mAP@50 từ 22.80% lên 24.65% (Δ = +1.85%). Cách biệt vs Random: +3.05%.",
      deficitFocus: "Bù đắp vật thể nhỏ (556/556) và rung lắc chuyển động blur (111 ảnh)."
    },
    classes: {
      person: { proposed: 38.9, random: 37.5, target: 41.2 },
      rider: { proposed: 5.4, random: 2.7, target: 8.5 },
      car: { proposed: 62.1, random: 60.8, target: 64.5 },
      truck: { proposed: 24.5, random: 22.0, target: 27.8 },
      bus: { proposed: 20.5, random: 17.2, target: 24.6 },
      train: { proposed: 7.8, random: 1.2, target: 14.2 },
      motor: { proposed: 7.2, random: 2.8, target: 13.5 },
      bike: { proposed: 6.8, random: 3.6, target: 10.4 },
      traffic_light: { proposed: 30.1, random: 28.7, target: 31.8 },
      traffic_sign: { proposed: 33.2, random: 31.7, target: 34.9 }
    },
    cwWeights: {
      person: 15.31, rider: 22.78, car: 0.20, truck: 18.37, bus: 19.59,
      train: 22.25, motor: 22.29, bike: 22.48, traffic_light: 16.52, traffic_sign: 15.67
    }
  },
  {
    iteration: "V3",
    seedName: "seed_v3",
    poolPercent: 40,
    labeledImages: 2168,
    proposedMap50: 26.15,
    randomMap50: 22.10,
    targetCeiling: 26.85,
    proposedF1: 31.45,
    randomF1: 25.33,
    delta: 4.05,
    statusNote: "Bơm seed_v3 (556 ảnh): Train chạm 11.5%, tiệm cận sát mốc trần 100% Target (26.85%).",
    diagnostic: {
      numImages: 556,
      gtBoxes: 10714,
      evalModel: "YOLO11n V2",
      detectedBoxes: 4361,
      truePositives: 2,
      falseNegatives: 10712,
      falsePositives: 4359,
      missRate: "100.0%",
      avgConfidence: 0.498,
      confusionPairsCount: 3,
      hardSlices: { night: 238, small: 555, occlusion: 487, weather: 290, blur: 138, dense: 361 },
      topConfusions: [
        { pair: "car -> person", count: 1 },
        { pair: "car -> bus", count: 1 },
        { pair: "car -> rider", count: 1 }
      ],
      impact: "Nạp seed_v3 nâng mAP@50 từ 24.65% lên 26.15% (Δ = +1.50%). Chỉ còn cách trần 0.70%.",
      deficitFocus: "Tăng cường che khuất nặng (487/556) và thời tiết khắc nghiệt (290 ảnh)."
    },
    classes: {
      person: { proposed: 39.7, random: 37.8, target: 41.2 },
      rider: { proposed: 6.8, random: 3.1, target: 8.5 },
      car: { proposed: 63.2, random: 61.1, target: 64.5 },
      truck: { proposed: 26.0, random: 22.4, target: 27.8 },
      bus: { proposed: 22.4, random: 17.8, target: 24.6 },
      train: { proposed: 11.5, random: 1.8, target: 14.2 },
      motor: { proposed: 9.8, random: 3.2, target: 13.5 },
      bike: { proposed: 8.5, random: 4.0, target: 10.4 },
      traffic_light: { proposed: 31.0, random: 29.0, target: 31.8 },
      traffic_sign: { proposed: 34.2, random: 32.0, target: 34.9 }
    },
    cwWeights: {
      person: 15.12, rider: 22.09, car: 0.20, truck: 18.01, bus: 19.08,
      train: 20.87, motor: 21.37, bike: 21.81, traffic_light: 16.35, traffic_sign: 15.53
    }
  },
  {
    iteration: "V4",
    seedName: "seed_v4",
    poolPercent: 50,
    labeledImages: 2724,
    proposedMap50: 27.20,
    randomMap50: 22.55,
    targetCeiling: 26.85,
    proposedF1: 33.73,
    randomF1: 25.94,
    delta: 4.65,
    statusNote: "Bơm seed_v4 (556 ảnh): CHÍNH THỨC VƯỢT TRẦN 100% Target (27.20% > 26.85%).",
    diagnostic: {
      numImages: 556,
      gtBoxes: 10492,
      evalModel: "YOLO11n V3",
      detectedBoxes: 4286,
      truePositives: 1,
      falseNegatives: 10491,
      falsePositives: 4285,
      missRate: "100.0%",
      avgConfidence: 0.503,
      confusionPairsCount: 10,
      hardSlices: { night: 171, small: 556, occlusion: 485, weather: 322, blur: 113, dense: 369 },
      topConfusions: [
        { pair: "car -> rider", count: 2 },
        { pair: "car -> truck", count: 2 },
        { pair: "car -> motor", count: 2 },
        { pair: "car -> bus", count: 1 },
        { pair: "person -> rider", count: 1 }
      ],
      impact: "Nạp seed_v4 vượt trần 100% Target: 27.20% > 26.85% (+0.35%), kích hoạt Vòng Xác Nhận.",
      deficitFocus: "Triệt tiêu ảo giác phân loại phương tiện hai bánh (car -> motor, person -> rider)."
    },
    classes: {
      person: { proposed: 41.0, random: 38.2, target: 41.2 },
      rider: { proposed: 8.9, random: 3.5, target: 8.5 },
      car: { proposed: 64.2, random: 61.5, target: 64.5 },
      truck: { proposed: 27.6, random: 22.9, target: 27.8 },
      bus: { proposed: 24.2, random: 18.4, target: 24.6 },
      train: { proposed: 14.8, random: 2.5, target: 14.2 },
      motor: { proposed: 13.2, random: 3.8, target: 13.5 },
      bike: { proposed: 10.2, random: 4.5, target: 10.4 },
      traffic_light: { proposed: 32.2, random: 29.4, target: 31.8 },
      traffic_sign: { proposed: 35.7, random: 32.4, target: 34.9 }
    },
    cwWeights: {
      person: 14.92, rider: 21.35, car: 0.20, truck: 17.65, bus: 18.59,
      train: 19.88, motor: 20.21, bike: 21.24, traffic_light: 16.09, traffic_sign: 15.34
    }
  },
  {
    iteration: "V5 (Victory)",
    seedName: "seed_v5",
    poolPercent: 60,
    labeledImages: 3336,
    proposedMap50: 27.85,
    randomMap50: 22.90,
    targetCeiling: 26.85,
    proposedF1: 35.02,
    randomF1: 26.48,
    delta: 4.95,
    statusNote: "Bơm seed_v5 (556 ảnh): VICTORY_CONFIRMED (27.85% mAP50), tiết kiệm 40.1% ngân sách!",
    diagnostic: {
      numImages: 556,
      gtBoxes: 11230,
      evalModel: "YOLO11n V4",
      detectedBoxes: 4302,
      truePositives: 2,
      falseNegatives: 11228,
      falsePositives: 4300,
      missRate: "100.0%",
      avgConfidence: 0.496,
      confusionPairsCount: 8,
      hardSlices: { night: 57, small: 556, occlusion: 500, weather: 176, blur: 51, dense: 393 },
      topConfusions: [
        { pair: "car -> bus", count: 2 },
        { pair: "traffic light -> truck", count: 1 },
        { pair: "car -> motor", count: 1 },
        { pair: "car -> person", count: 1 },
        { pair: "car -> rider", count: 1 }
      ],
      impact: "Bản án chung cuộc: Xác nhận chiến thắng 27.85% mAP@50 với chỉ 60% dữ liệu (VICTORY_CONFIRMED).",
      deficitFocus: "Khai thác tối đa 500 ca che khuất nặng (is_high_occlusion) và 393 ca mật độ cao."
    },
    classes: {
      person: { proposed: 41.8, random: 38.5, target: 41.2 },
      rider: { proposed: 10.1, random: 3.9, target: 8.5 },
      car: { proposed: 64.9, random: 61.8, target: 64.5 },
      truck: { proposed: 28.5, random: 23.3, target: 27.8 },
      bus: { proposed: 25.4, random: 18.9, target: 24.6 },
      train: { proposed: 16.2, random: 3.1, target: 14.2 },
      motor: { proposed: 14.8, random: 4.2, target: 13.5 },
      bike: { proposed: 11.5, random: 5.0, target: 10.4 },
      traffic_light: { proposed: 32.8, random: 29.8, target: 31.8 },
      traffic_sign: { proposed: 36.5, random: 32.7, target: 34.9 }
    },
    cwWeights: {
      person: 14.78, rider: 20.88, car: 0.20, truck: 17.49, bus: 18.35,
      train: 19.29, motor: 19.64, bike: 20.88, traffic_light: 15.95, traffic_sign: 15.20
    }
  }
];

export const TEN_CLASSES_INFO = [
  { key: "person", label: "Người đi bộ (Person)", color: "#38bdf8", target: 41.2 },
  { key: "rider", label: "Người lái xe (Rider)", color: "#f472b6", target: 8.5 },
  { key: "car", label: "Xe con (Car)", color: "#94a3b8", target: 64.5 },
  { key: "truck", label: "Xe tải (Truck)", color: "#fb923c", target: 27.8 },
  { key: "bus", label: "Xe buýt (Bus)", color: "#fbbf24", target: 24.6 },
  { key: "train", label: "Tàu hỏa (Train)", color: "#e879f9", target: 14.2 },
  { key: "motor", label: "Xe máy (Motor)", color: "#a78bfa", target: 13.5 },
  { key: "bike", label: "Xe đạp (Bike)", color: "#34d399", target: 10.4 },
  { key: "traffic_light", label: "Đèn tín hiệu (Traffic Light)", color: "#4ade80", target: 31.8 },
  { key: "traffic_sign", label: "Biển báo (Traffic Sign)", color: "#22d3ee", target: 34.9 }
];

export const STOPPING_GATES = [
  { id: 1, name: "Gate 1: Victory Condition", desc: "mAP Proposed vượt trần 100% Target Ceiling", status: "TRIGGERED", note: "27.85% > 26.85% (+1.00%)" },
  { id: 2, name: "Gate 2: Performance Plateau", desc: "Tăng trưởng mAP < 0.15% trong 2 vòng liên tiếp", status: "STANDBY", note: "Chưa kích hoạt" },
  { id: 3, name: "Gate 3: Budget Depletion", desc: "Vượt quá ngân sách gán nhãn cho phép", status: "STANDBY", note: "Mới dùng 60% ngân sách" },
  { id: 4, name: "Gate 4: Catastrophic Forgetting", desc: "Bất kỳ lớp hiếm nào bị tụt dốc > 2.0% mAP", status: "SAFE", note: "Zero Forgetting nhờ Replay Buffer" },
  { id: 5, name: "Gate 5: Data Leakage Barrier", desc: "Phát hiện pHash Hamming Distance < 5 sang Test set", status: "SECURE", note: "100% Zero Leakage (13.45M cặp quét)" }
];

export const STRATEGY_TOURNAMENT = [
  {
    rank: 1,
    name: "🏆 Hybrid Mix 80/20 (Proposed Winner)",
    score: 93.59,
    classScore: "99.99%",
    facilityScore: "99.19%",
    quotaScore: "82.14%",
    videoOverlap: 0,
    decision: "WINNER_SELECTED",
    statusNote: "Tối ưu xuất sắc: Cosine 0.9999, Phủ cực đại R_cov 3.35, Zero Video Overlap"
  },
  {
    rank: 2,
    name: "🥈 Hybrid Mix 70/30 (Runner-up)",
    score: 89.42,
    classScore: "99.85%",
    facilityScore: "96.50%",
    quotaScore: "79.28%",
    videoOverlap: 0,
    decision: "STRESS_TEST_RUNNER_UP",
    statusNote: "Hiệu quả tốt nhưng sai số quota lát cắt cao hơn phương án 80/20"
  },
  {
    rank: 3,
    name: "🥉 Direct Metadata Quota (Ablation)",
    score: 82.14,
    classScore: "95.20%",
    facilityScore: "75.40%",
    quotaScore: "92.50%",
    videoOverlap: 0,
    decision: "BENCHMARK_CONTROL",
    statusNote: "Tốt về phân bổ lát cắt nhưng độ bao phủ không gian đặc trưng thấp"
  },
  {
    rank: 4,
    name: "4. Submodular Facility Location (Pure)",
    score: 80.65,
    classScore: "88.40%",
    facilityScore: "99.80%",
    quotaScore: "68.20%",
    videoOverlap: 0,
    decision: "BENCHMARK_CONTROL",
    statusNote: "Bao phủ cụm rất tốt nhưng bị lệch tỷ lệ bối cảnh môi trường"
  },
  {
    rank: 5,
    name: "5. Uniform Random Baseline (Baseline)",
    score: 71.30,
    classScore: "84.10%",
    facilityScore: "62.40%",
    quotaScore: "55.80%",
    videoOverlap: 0,
    decision: "REJECTED_BASELINE",
    statusNote: "Bị trùng lặp cục bộ cao, lãng phí tài nguyên và bỏ quên lớp hiếm"
  }
];

export const FROZEN_SPLITS_AUDIT = {
  totalPairsScanned: "13,454,400",
  testVsValMinHD: 10.0,
  testVsSeedMinHD: 10.0,
  testVsPoolMinHD: 6.0,
  valVsSeedMinHD: 10.0,
  valVsPoolMinHD: 6.0,
  seedVsPoolMinHD: 8.0,
  violationsHDLessThan5: 0,
  videoOverlapCount: 0,
  auditStatus: "PASS_VERIFIED",
  leakageRisk: "0.000000%"
};
