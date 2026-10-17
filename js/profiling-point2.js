/**
 * profiling-point2.js
 * Controller & Dữ liệu thực nghiệm Point 2: Automated Data Profiling Benchmark
 * Chuẩn thiết kế: GreenSM Nordic Editorial (Canvas #F8F7F2, Ink #303A3B, Forest #2D5A34, Sage #B7CDBB)
 * Tác giả: T018
 */

// 1. DỮ LIỆU 100 ẢNH KIỂM TOÁN MẮT NGƯỜI
const AUDIT_CANDIDATES = [
  {
    "id": 1,
    "name": "03a3f4e6-caeaf05d.jpg",
    "lap": 2.19,
    "ten": 6743.62,
    "fft": 0.0213,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_001.jpg"
  },
  {
    "id": 2,
    "name": "018aca44-9a616a49.jpg",
    "lap": 3.25,
    "ten": 9693.26,
    "fft": 0.0163,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_002.jpg"
  },
  {
    "id": 3,
    "name": "03db7788-066fa992.jpg",
    "lap": 4.58,
    "ten": 12794.7,
    "fft": 0.0212,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_003.jpg"
  },
  {
    "id": 4,
    "name": "03b58b4e-db439f75.jpg",
    "lap": 5.01,
    "ten": 29782.42,
    "fft": 0.0616,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_004.jpg"
  },
  {
    "id": 5,
    "name": "03fa0a33-de2f7bbe.jpg",
    "lap": 5.56,
    "ten": 5748.7,
    "fft": 0.0077,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_005.jpg"
  },
  {
    "id": 6,
    "name": "04f568c5-7e59cc04.jpg",
    "lap": 5.95,
    "ten": 19931.15,
    "fft": 0.0718,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_006.jpg"
  },
  {
    "id": 7,
    "name": "006bb043-fe4bbaf6.jpg",
    "lap": 6.44,
    "ten": 31300.64,
    "fft": 0.3715,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_007.jpg"
  },
  {
    "id": 8,
    "name": "03f6e688-415b77da.jpg",
    "lap": 6.46,
    "ten": 21481.04,
    "fft": 0.0203,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_008.jpg"
  },
  {
    "id": 9,
    "name": "0549f27d-fe32da2d.jpg",
    "lap": 6.82,
    "ten": 12829.59,
    "fft": 0.0309,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_009.jpg"
  },
  {
    "id": 10,
    "name": "0279c430-962e3702.jpg",
    "lap": 6.84,
    "ten": 10535.66,
    "fft": 0.017,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_010.jpg"
  },
  {
    "id": 11,
    "name": "009215e2-e67ccfb7.jpg",
    "lap": 7.15,
    "ten": 19124.18,
    "fft": 0.0534,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Mờ nhòe rõ nét do rung lắc chuyển động xe di chuyển (motion smearing confirmed by Human Expert)",
    "img": "assets/profiling_candidates/cand_011.jpg"
  },
  {
    "id": 12,
    "name": "0374204b-c2fdc9c3.jpg",
    "lap": 7.24,
    "ten": 35635.7,
    "fft": 0.0618,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Mờ nhòe rõ nét do rung lắc chuyển động xe di chuyển (motion smearing confirmed by Human Expert)",
    "img": "assets/profiling_candidates/cand_012.jpg"
  },
  {
    "id": 13,
    "name": "009215e2-ea063b28.jpg",
    "lap": 7.35,
    "ten": 27938.93,
    "fft": 0.0482,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_013.jpg"
  },
  {
    "id": 14,
    "name": "033fba91-5ecfcf62.jpg",
    "lap": 7.38,
    "ten": 14607.3,
    "fft": 0.0127,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_014.jpg"
  },
  {
    "id": 15,
    "name": "05584a52-aa126299.jpg",
    "lap": 7.39,
    "ten": 10835.57,
    "fft": 0.0213,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_015.jpg"
  },
  {
    "id": 16,
    "name": "0374204b-40287a38.jpg",
    "lap": 7.92,
    "ten": 13646.05,
    "fft": 0.0207,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_016.jpg"
  },
  {
    "id": 17,
    "name": "03ab1996-72301852.jpg",
    "lap": 8.07,
    "ten": 15655.09,
    "fft": 0.0176,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_017.jpg"
  },
  {
    "id": 18,
    "name": "00e5e793-f94de032.jpg",
    "lap": 8.9,
    "ten": 14951.84,
    "fft": 0.0276,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_018.jpg"
  },
  {
    "id": 19,
    "name": "05584a52-fc4990b5.jpg",
    "lap": 8.96,
    "ten": 14874.6,
    "fft": 0.0391,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_019.jpg"
  },
  {
    "id": 20,
    "name": "04951646-802cc3d5.jpg",
    "lap": 9.18,
    "ten": 15275.33,
    "fft": 0.0257,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_020.jpg"
  },
  {
    "id": 21,
    "name": "02da8a10-630b1157.jpg",
    "lap": 9.38,
    "ten": 15802.77,
    "fft": 0.0088,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_021.jpg"
  },
  {
    "id": 22,
    "name": "05584a52-687411b6.jpg",
    "lap": 9.4,
    "ten": 12080.7,
    "fft": 0.0308,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_022.jpg"
  },
  {
    "id": 23,
    "name": "00ccf2e8-59a6bfc9.jpg",
    "lap": 9.95,
    "ten": 17280.98,
    "fft": 0.0262,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_023.jpg"
  },
  {
    "id": 24,
    "name": "0549f27d-31897e4e.jpg",
    "lap": 10.1,
    "ten": 14312.98,
    "fft": 0.0387,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_024.jpg"
  },
  {
    "id": 25,
    "name": "0081e3ea-b9448b6b.jpg",
    "lap": 10.17,
    "ten": 22701.9,
    "fft": 0.0355,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_025.jpg"
  },
  {
    "id": 26,
    "name": "0127cb3a-6be24a50.jpg",
    "lap": 10.21,
    "ten": 10257.14,
    "fft": 0.0346,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_026.jpg"
  },
  {
    "id": 27,
    "name": "0135988f-9fcccf88.jpg",
    "lap": 10.27,
    "ten": 17732.45,
    "fft": 0.0438,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_027.jpg"
  },
  {
    "id": 28,
    "name": "00852c8f-14cf1e60.jpg",
    "lap": 10.92,
    "ten": 25089.26,
    "fft": 0.0768,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_028.jpg"
  },
  {
    "id": 29,
    "name": "0350503e-d3efc96a.jpg",
    "lap": 11.06,
    "ten": 14412.66,
    "fft": 0.0146,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_029.jpg"
  },
  {
    "id": 30,
    "name": "043c2514-3caaa3a8.jpg",
    "lap": 11.2,
    "ten": 33701.41,
    "fft": 0.1219,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_030.jpg"
  },
  {
    "id": 31,
    "name": "03e6369b-c0e99715.jpg",
    "lap": 11.22,
    "ten": 13513.65,
    "fft": 0.0361,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_031.jpg"
  },
  {
    "id": 32,
    "name": "0294d2b2-7f831a57.jpg",
    "lap": 11.27,
    "ten": 22964.05,
    "fft": 0.0345,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_032.jpg"
  },
  {
    "id": 33,
    "name": "03afe274-e6c2f6f8.jpg",
    "lap": 11.42,
    "ten": 11003.2,
    "fft": 0.0457,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_033.jpg"
  },
  {
    "id": 34,
    "name": "05296fa8-248ff695.jpg",
    "lap": 11.53,
    "ten": 21093.37,
    "fft": 0.0272,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_034.jpg"
  },
  {
    "id": 35,
    "name": "0096bcca-c2027ec4.jpg",
    "lap": 11.76,
    "ten": 18056.88,
    "fft": 0.0229,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_035.jpg"
  },
  {
    "id": 36,
    "name": "01c3e892-a4a8f9ec.jpg",
    "lap": 11.83,
    "ten": 18060.55,
    "fft": 0.04,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_036.jpg"
  },
  {
    "id": 37,
    "name": "03799690-eb48b0b7.jpg",
    "lap": 11.91,
    "ten": 14790.6,
    "fft": 0.0327,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_037.jpg"
  },
  {
    "id": 38,
    "name": "02d478d1-937f841f.jpg",
    "lap": 11.99,
    "ten": 16244.27,
    "fft": 0.0294,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_038.jpg"
  },
  {
    "id": 39,
    "name": "01c3e892-13e4048a.jpg",
    "lap": 12.01,
    "ten": 7730.95,
    "fft": 0.0112,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_039.jpg"
  },
  {
    "id": 40,
    "name": "0081e3ea-9f5dda4a.jpg",
    "lap": 12.34,
    "ten": 25583.89,
    "fft": 0.0299,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_040.jpg"
  },
  {
    "id": 41,
    "name": "010d75f8-3eb08dc7.jpg",
    "lap": 12.37,
    "ten": 26998.06,
    "fft": 0.0625,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_041.jpg"
  },
  {
    "id": 42,
    "name": "05268dc6-4e88d5fb.jpg",
    "lap": 12.6,
    "ten": 19476.44,
    "fft": 0.0404,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_042.jpg"
  },
  {
    "id": 43,
    "name": "0081e3ea-3f7b0282.jpg",
    "lap": 12.65,
    "ten": 14806.37,
    "fft": 0.0189,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_043.jpg"
  },
  {
    "id": 44,
    "name": "01c3e892-c0641182.jpg",
    "lap": 13.13,
    "ten": 5356.9,
    "fft": 0.0037,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_044.jpg"
  },
  {
    "id": 45,
    "name": "054ce029-b78f0d6e.jpg",
    "lap": 13.82,
    "ten": 11442.43,
    "fft": 0.0148,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_045.jpg"
  },
  {
    "id": 46,
    "name": "05391f8a-06ea8bdb.jpg",
    "lap": 14.26,
    "ten": 29257.19,
    "fft": 0.1283,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_046.jpg"
  },
  {
    "id": 47,
    "name": "02f1accd-a65e6a80.jpg",
    "lap": 14.43,
    "ten": 31358.71,
    "fft": 0.0446,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_047.jpg"
  },
  {
    "id": 48,
    "name": "041b6c3f-03f97dd2.jpg",
    "lap": 14.44,
    "ten": 30902.93,
    "fft": 0.0451,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_048.jpg"
  },
  {
    "id": 49,
    "name": "013b7dd3-0b902c12.jpg",
    "lap": 14.45,
    "ten": 16504.83,
    "fft": 0.0399,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_049.jpg"
  },
  {
    "id": 50,
    "name": "00e5e793-22614772.jpg",
    "lap": 14.6,
    "ten": 23875.75,
    "fft": 0.0643,
    "label": "BLUR",
    "is_blur": true,
    "verified_by": "T018",
    "notes": "Ảnh mờ do xe rung xóc mạnh, nhòe viền chuyển động hoặc nhiễu tối bệt chi tiết.",
    "img": "assets/profiling_candidates/cand_050.jpg"
  },
  {
    "id": 51,
    "name": "01ce3717-4aa554ab.jpg",
    "lap": 733.88,
    "ten": 32359.86,
    "fft": 0.0152,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_051.jpg"
  },
  {
    "id": 52,
    "name": "00495359-27ce9c7e.jpg",
    "lap": 734.0,
    "ten": 35676.59,
    "fft": 0.0115,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_052.jpg"
  },
  {
    "id": 53,
    "name": "0531d2f7-1feee72c.jpg",
    "lap": 742.54,
    "ten": 27765.2,
    "fft": 0.0173,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_053.jpg"
  },
  {
    "id": 54,
    "name": "02250ece-2d6bfd5b.jpg",
    "lap": 743.04,
    "ten": 29775.53,
    "fft": 0.0242,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_054.jpg"
  },
  {
    "id": 55,
    "name": "034ba984-01a430f3.jpg",
    "lap": 743.52,
    "ten": 25943.38,
    "fft": 0.015,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_055.jpg"
  },
  {
    "id": 56,
    "name": "0315cc1f-d0c40c17.jpg",
    "lap": 747.98,
    "ten": 26732.98,
    "fft": 0.0184,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_056.jpg"
  },
  {
    "id": 57,
    "name": "036f07d5-a41ae610.jpg",
    "lap": 749.39,
    "ten": 32137.08,
    "fft": 0.0122,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_057.jpg"
  },
  {
    "id": 58,
    "name": "04327108-6fb3ab49.jpg",
    "lap": 749.5,
    "ten": 26409.7,
    "fft": 0.0167,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_058.jpg"
  },
  {
    "id": 59,
    "name": "00a2e3ca-5c856cde.jpg",
    "lap": 754.67,
    "ten": 26329.78,
    "fft": 0.0183,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_059.jpg"
  },
  {
    "id": 60,
    "name": "01cce42a-cd2acad5.jpg",
    "lap": 761.78,
    "ten": 32318.19,
    "fft": 0.0182,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_060.jpg"
  },
  {
    "id": 61,
    "name": "029968d6-9eea29a2.jpg",
    "lap": 764.13,
    "ten": 32626.66,
    "fft": 0.0143,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_061.jpg"
  },
  {
    "id": 62,
    "name": "0204aad7-8ad8ba92.jpg",
    "lap": 773.63,
    "ten": 33352.76,
    "fft": 0.0189,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_062.jpg"
  },
  {
    "id": 63,
    "name": "04f59f1c-429ef900.jpg",
    "lap": 774.49,
    "ten": 28673.62,
    "fft": 0.0181,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_063.jpg"
  },
  {
    "id": 64,
    "name": "053d7848-2ca828f8.jpg",
    "lap": 775.23,
    "ten": 23795.47,
    "fft": 0.0165,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_064.jpg"
  },
  {
    "id": 65,
    "name": "00d0f034-6d666f7b.jpg",
    "lap": 785.73,
    "ten": 20345.53,
    "fft": 0.0137,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_065.jpg"
  },
  {
    "id": 66,
    "name": "00067cfb-e535423e.jpg",
    "lap": 797.17,
    "ten": 36365.36,
    "fft": 0.0303,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_066.jpg"
  },
  {
    "id": 67,
    "name": "0209c510-5ef87f7a.jpg",
    "lap": 802.6,
    "ten": 29242.99,
    "fft": 0.0165,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_067.jpg"
  },
  {
    "id": 68,
    "name": "0521fd41-39bc52be.jpg",
    "lap": 810.15,
    "ten": 36298.21,
    "fft": 0.0267,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_068.jpg"
  },
  {
    "id": 69,
    "name": "00618cec-a7f7e470.jpg",
    "lap": 820.74,
    "ten": 25480.41,
    "fft": 0.0161,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_069.jpg"
  },
  {
    "id": 70,
    "name": "0204aad7-ce83492d.jpg",
    "lap": 825.38,
    "ten": 32146.81,
    "fft": 0.0179,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_070.jpg"
  },
  {
    "id": 71,
    "name": "007693e6-bc55f0e4.jpg",
    "lap": 827.92,
    "ten": 28571.25,
    "fft": 0.0179,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_071.jpg"
  },
  {
    "id": 72,
    "name": "04076a65-052f6027.jpg",
    "lap": 855.72,
    "ten": 33322.37,
    "fft": 0.0176,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_072.jpg"
  },
  {
    "id": 73,
    "name": "02e06911-cb3fd71e.jpg",
    "lap": 862.49,
    "ten": 36832.78,
    "fft": 0.0267,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_073.jpg"
  },
  {
    "id": 74,
    "name": "02ddd956-37234391.jpg",
    "lap": 862.92,
    "ten": 35949.47,
    "fft": 0.0201,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_074.jpg"
  },
  {
    "id": 75,
    "name": "0339a42b-1e75ac9a.jpg",
    "lap": 865.13,
    "ten": 32539.96,
    "fft": 0.0132,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_075.jpg"
  },
  {
    "id": 76,
    "name": "0204aad7-4ebd19fa.jpg",
    "lap": 865.61,
    "ten": 33327.8,
    "fft": 0.0172,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_076.jpg"
  },
  {
    "id": 77,
    "name": "0250f554-b900f677.jpg",
    "lap": 874.02,
    "ten": 24493.32,
    "fft": 0.0234,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_077.jpg"
  },
  {
    "id": 78,
    "name": "00a820ef-2b98dcf5.jpg",
    "lap": 875.43,
    "ten": 37462.2,
    "fft": 0.0216,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_078.jpg"
  },
  {
    "id": 79,
    "name": "02191150-4615d36f.jpg",
    "lap": 875.53,
    "ten": 26844.67,
    "fft": 0.0138,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_079.jpg"
  },
  {
    "id": 80,
    "name": "03626025-2af8b800.jpg",
    "lap": 877.24,
    "ten": 31705.98,
    "fft": 0.0194,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_080.jpg"
  },
  {
    "id": 81,
    "name": "00c50078-6298b9c1.jpg",
    "lap": 892.76,
    "ten": 35729.68,
    "fft": 0.0244,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_081.jpg"
  },
  {
    "id": 82,
    "name": "002ab96a-a96704f9.jpg",
    "lap": 894.07,
    "ten": 35405.86,
    "fft": 0.0157,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_082.jpg"
  },
  {
    "id": 83,
    "name": "00f42f6b-5a20a4d2.jpg",
    "lap": 905.29,
    "ten": 29418.75,
    "fft": 0.0144,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_083.jpg"
  },
  {
    "id": 84,
    "name": "03da60f5-4495144e.jpg",
    "lap": 907.62,
    "ten": 24778.88,
    "fft": 0.0153,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_084.jpg"
  },
  {
    "id": 85,
    "name": "0048f391-8eb40ca6.jpg",
    "lap": 913.16,
    "ten": 29669.49,
    "fft": 0.0181,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_085.jpg"
  },
  {
    "id": 86,
    "name": "007da0eb-e1f588e8.jpg",
    "lap": 913.34,
    "ten": 28579.32,
    "fft": 0.0143,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_086.jpg"
  },
  {
    "id": 87,
    "name": "02b1ab3d-e93996c2.jpg",
    "lap": 921.56,
    "ten": 33139.72,
    "fft": 0.0175,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_087.jpg"
  },
  {
    "id": 88,
    "name": "0445a23c-59aa5b31.jpg",
    "lap": 927.55,
    "ten": 25196.17,
    "fft": 0.0141,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_088.jpg"
  },
  {
    "id": 89,
    "name": "011ad6b2-1dfff443.jpg",
    "lap": 933.03,
    "ten": 49006.19,
    "fft": 0.0262,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_089.jpg"
  },
  {
    "id": 90,
    "name": "00d79c0a-a2b85ca4.jpg",
    "lap": 933.67,
    "ten": 44562.75,
    "fft": 0.0227,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_090.jpg"
  },
  {
    "id": 91,
    "name": "0540f550-72c78702.jpg",
    "lap": 933.85,
    "ten": 28412.59,
    "fft": 0.0354,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_091.jpg"
  },
  {
    "id": 92,
    "name": "02c26e9d-959a8a8d.jpg",
    "lap": 945.82,
    "ten": 28398.73,
    "fft": 0.0142,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_092.jpg"
  },
  {
    "id": 93,
    "name": "00f42f6b-699a498c.jpg",
    "lap": 957.46,
    "ten": 33717.3,
    "fft": 0.0119,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_093.jpg"
  },
  {
    "id": 94,
    "name": "021c4a16-1c50e818.jpg",
    "lap": 971.12,
    "ten": 24437.17,
    "fft": 0.0126,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_094.jpg"
  },
  {
    "id": 95,
    "name": "036f07d5-92c52ed8.jpg",
    "lap": 1014.15,
    "ten": 35497.72,
    "fft": 0.0114,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_095.jpg"
  },
  {
    "id": 96,
    "name": "043026cb-2808c6fb.jpg",
    "lap": 1091.7,
    "ten": 37057.32,
    "fft": 0.0404,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_096.jpg"
  },
  {
    "id": 97,
    "name": "022da1b8-ab52d480.jpg",
    "lap": 1156.1,
    "ten": 32718.33,
    "fft": 0.0283,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_097.jpg"
  },
  {
    "id": 98,
    "name": "02c01e62-c53e91a0.jpg",
    "lap": 1221.57,
    "ten": 31019.64,
    "fft": 0.0194,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_098.jpg"
  },
  {
    "id": 99,
    "name": "04056725-91d0bd08.jpg",
    "lap": 1379.06,
    "ten": 42415.11,
    "fft": 0.0218,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_099.jpg"
  },
  {
    "id": 100,
    "name": "03cee322-f7c906a2.jpg",
    "lap": 1602.66,
    "ten": 49883.85,
    "fft": 0.0105,
    "label": "SHARP",
    "is_blur": false,
    "verified_by": "T018",
    "notes": "Ảnh rất sắc nét, rõ viền phương tiện, vạch kẻ đường và biển số xe rõ ràng.",
    "img": "assets/profiling_candidates/cand_100.jpg"
  }
];

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

// 7. TOURNAMENT TABS & SUB-POINT NAVIGATION
function switchTournamentTab(pointId) {
  const tabs = ['2.1', '2.2', '2.3', '2.4', '2.5', 'bootstrap_ci'];
  tabs.forEach(t => {
    const key = t.replace('.', '_');
    const btn = document.getElementById(`tabBtn_${key}`);
    const content = document.getElementById(`tabContent_${key}`);
    const sideBtn = document.getElementById(`sideSubPoint_${key}`);

    if (btn && content) {
      if (t === pointId) {
        btn.className = 'px-4 py-2.5 rounded-xl border border-[#2D5A34] bg-[#E8F0EA] text-[#2D5A34] font-bold text-xs font-mono transition-all';
        content.classList.remove('hidden');
      } else {
        btn.className = 'px-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-[#475254] font-semibold text-xs font-mono transition-all hover:border-[#B7CDBB]';
        content.classList.add('hidden');
      }
    }

    if (sideBtn) {
      if (t === pointId) {
        sideBtn.className = 'subpoint-nav-item w-full text-left flex items-center justify-between p-2 rounded-xl bg-[#E8F0EA] border border-[#2D5A34] text-[#2D5A34] font-bold transition-all cursor-pointer';
      } else {
        sideBtn.className = 'subpoint-nav-item w-full text-left flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5E3DC] text-[#475254] hover:bg-[#F8F7F2] hover:border-[#B7CDBB] font-medium transition-all cursor-pointer';
      }
    }
  });
}

function navigateToSubPoint(pointId) {
  switchTournamentTab(pointId);
  const target = document.getElementById('tournament');
  if (target) {
    const yOffset = -80;
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
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
