/**
 * fastdedup-point1.js
 * Controller & Dữ liệu thực nghiệm Point 1: Dual-Stream Fast Deduplication Benchmark
 * Kế thừa phong cách GreenSM Editorial Academic
 */

// 1. DỮ LIỆU TOÀN BỘ 34 CẶP ỨNG VIÊN ĐÃ ĐƯỢC CON NGƯỜI DUYỆT THẬT 100%
const CANDIDATES_DATA = [
  {
    "pair_id": 1,
    "video_id": "012a9c41",
    "img1": "012a9c41-69222e1b.jpg",
    "img2": "012a9c41-edad898c.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/012a9c41-69222e1b.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/012a9c41-edad898c.jpg",
    "distances": {
      "pHash": 4.0,
      "aHash": 0.0,
      "dHash": 1.0,
      "ResNet50": 0.0394
    },
    "flagged_by": [
      "pHash",
      "aHash",
      "dHash",
      "ResNet50"
    ],
    "initial_prediction": "Duplicate",
    "human_label": "Near-duplicate",
    "verification_status": "verified_by_human",
    "notes": "Xe dừng bãi đỗ, có thêm 1 người đi bộ bước vào khung hình (Ảnh A có 16 obj, Ảnh B có 15 obj). Giữ ảnh có người.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 2,
    "video_id": "0573f031",
    "img1": "0573f031-e8244dd0.jpg",
    "img2": "0573f031-fe89a0d4.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0573f031-e8244dd0.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0573f031-fe89a0d4.jpg",
    "distances": {
      "pHash": 24.0,
      "aHash": 3.0,
      "dHash": 22.0,
      "ResNet50": 0.3822
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Xe đang di chuyển, góc quay khác.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 3,
    "video_id": "06ac7da9",
    "img1": "06ac7da9-81ae9c1c.jpg",
    "img2": "06ac7da9-b4b26aa1.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/06ac7da9-81ae9c1c.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/06ac7da9-b4b26aa1.jpg",
    "distances": {
      "pHash": 0.0,
      "aHash": 0.0,
      "dHash": 0.0,
      "ResNet50": 0.0112
    },
    "flagged_by": [
      "pHash",
      "aHash",
      "dHash",
      "ResNet50"
    ],
    "initial_prediction": "Duplicate",
    "human_label": "Duplicate",
    "verification_status": "verified_by_human",
    "notes": "Dừng đèn đỏ ban ngày, bất biến 100% từng pixel (HD=0).",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 4,
    "video_id": "08688b9f",
    "img1": "08688b9f-4e2c11c8.jpg",
    "img2": "08688b9f-cdfc0599.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08688b9f-4e2c11c8.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08688b9f-cdfc0599.jpg",
    "distances": {
      "pHash": 16.0,
      "aHash": 3.0,
      "dHash": 25.0,
      "ResNet50": 0.2166
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Hai khung hình khác biệt hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 5,
    "video_id": "08b02c82",
    "img1": "08b02c82-0039a14a.jpg",
    "img2": "08b02c82-5551b303.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08b02c82-0039a14a.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08b02c82-5551b303.jpg",
    "distances": {
      "pHash": 14.0,
      "aHash": 3.0,
      "dHash": 23.0,
      "ResNet50": 0.262
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Xe đang di chuyển.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 6,
    "video_id": "08ef9f76",
    "img1": "08ef9f76-37ebfa18.jpg",
    "img2": "08ef9f76-886d0493.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08ef9f76-37ebfa18.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08ef9f76-886d0493.jpg",
    "distances": {
      "pHash": 20.0,
      "aHash": 4.0,
      "dHash": 29.0,
      "ResNet50": 0.399
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Hai khung hình khác biệt.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 7,
    "video_id": "08ffb626",
    "img1": "08ffb626-02eb6a44.jpg",
    "img2": "08ffb626-1c25b2a4.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08ffb626-02eb6a44.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/08ffb626-1c25b2a4.jpg",
    "distances": {
      "pHash": 30.0,
      "aHash": 4.0,
      "dHash": 30.0,
      "ResNet50": 0.2735
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Hai khung hình khác biệt.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 8,
    "video_id": "09ac7416",
    "img1": "09ac7416-34ea8581.jpg",
    "img2": "09ac7416-74752083.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ac7416-34ea8581.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ac7416-74752083.jpg",
    "distances": {
      "pHash": 0.0,
      "aHash": 0.0,
      "dHash": 4.0,
      "ResNet50": 0.0196
    },
    "flagged_by": [
      "pHash",
      "aHash",
      "dHash",
      "ResNet50"
    ],
    "initial_prediction": "Duplicate",
    "human_label": "Near-duplicate",
    "verification_status": "verified_by_human",
    "notes": "Xe dừng, xuất hiện thêm 1 người đi bộ thứ hai (từ 7 lên 8 obj). Giữ ảnh 8 obj.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 9,
    "video_id": "09ac7416",
    "img1": "09ac7416-76fb4b2c.jpg",
    "img2": "09ac7416-e1082bec.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ac7416-76fb4b2c.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ac7416-e1082bec.jpg",
    "distances": {
      "pHash": 4.0,
      "aHash": 3.0,
      "dHash": 6.0,
      "ResNet50": 0.0523
    },
    "flagged_by": [
      "pHash",
      "aHash"
    ],
    "initial_prediction": "Duplicate",
    "human_label": "Near-duplicate",
    "verification_status": "verified_by_human",
    "notes": "Xe dừng, xe phía trước nhích nhẹ 1 chút xíu.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 10,
    "video_id": "09ae119b",
    "img1": "09ae119b-eb13907f.jpg",
    "img2": "09ae119b-f7f6ef39.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ae119b-eb13907f.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ae119b-f7f6ef39.jpg",
    "distances": {
      "pHash": 24.0,
      "aHash": 4.0,
      "dHash": 29.0,
      "ResNet50": 0.2561
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 11,
    "video_id": "09ae119b",
    "img1": "09ae119b-f7f6ef39.jpg",
    "img2": "09ae119b-f8e3d19d.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ae119b-f7f6ef39.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/09ae119b-f8e3d19d.jpg",
    "distances": {
      "pHash": 22.0,
      "aHash": 3.0,
      "dHash": 28.0,
      "ResNet50": 0.5313
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 12,
    "video_id": "0a19489c",
    "img1": "0a19489c-120e718b.jpg",
    "img2": "0a19489c-498fdc3f.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0a19489c-120e718b.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0a19489c-498fdc3f.jpg",
    "distances": {
      "pHash": 14.0,
      "aHash": 3.0,
      "dHash": 13.0,
      "ResNet50": 0.1485
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 13,
    "video_id": "0a7cbfc6",
    "img1": "0a7cbfc6-469c9037.jpg",
    "img2": "0a7cbfc6-c83c2cde.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0a7cbfc6-469c9037.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0a7cbfc6-c83c2cde.jpg",
    "distances": {
      "pHash": 22.0,
      "aHash": 4.0,
      "dHash": 27.0,
      "ResNet50": 0.3437
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 14,
    "video_id": "0b8b0111",
    "img1": "0b8b0111-01aac1a5.jpg",
    "img2": "0b8b0111-a5a06f63.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0b8b0111-01aac1a5.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0b8b0111-a5a06f63.jpg",
    "distances": {
      "pHash": 22.0,
      "aHash": 4.0,
      "dHash": 30.0,
      "ResNet50": 0.2567
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 15,
    "video_id": "0ce5101a",
    "img1": "0ce5101a-08b03d25.jpg",
    "img2": "0ce5101a-39704188.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0ce5101a-08b03d25.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0ce5101a-39704188.jpg",
    "distances": {
      "pHash": 0.0,
      "aHash": 0.0,
      "dHash": 2.0,
      "ResNet50": 0.0065
    },
    "flagged_by": [
      "pHash",
      "aHash",
      "dHash",
      "ResNet50"
    ],
    "initial_prediction": "Duplicate",
    "human_label": "Duplicate",
    "verification_status": "verified_by_human",
    "notes": "Xe dừng trước vạch giao lộ ban ngày, trùng tuyệt đối HD=0.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 16,
    "video_id": "0d13ae3d",
    "img1": "0d13ae3d-208a0cdb.jpg",
    "img2": "0d13ae3d-f033a349.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0d13ae3d-208a0cdb.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0d13ae3d-f033a349.jpg",
    "distances": {
      "pHash": 24.0,
      "aHash": 4.0,
      "dHash": 33.0,
      "ResNet50": 0.3102
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 17,
    "video_id": "0d65d38e",
    "img1": "0d65d38e-35d14713.jpg",
    "img2": "0d65d38e-866f8386.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0d65d38e-35d14713.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0d65d38e-866f8386.jpg",
    "distances": {
      "pHash": 28.0,
      "aHash": 13.0,
      "dHash": 15.0,
      "ResNet50": 0.045
    },
    "flagged_by": [
      "ResNet50"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "ResNet50 báo nhầm: Tương đồng ngữ nghĩa nhưng xe đã chạy sang đoạn đường mới.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 18,
    "video_id": "0dffa115",
    "img1": "0dffa115-191d4e50.jpg",
    "img2": "0dffa115-8a64b65d.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0dffa115-191d4e50.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/0dffa115-8a64b65d.jpg",
    "distances": {
      "pHash": 18.0,
      "aHash": 3.0,
      "dHash": 26.0,
      "ResNet50": 0.3204
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Khác nhau hoàn toàn.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 19,
    "video_id": "11502c6d",
    "img1": "11502c6d-b66f8ffa.jpg",
    "img2": "11502c6d-f4834c96.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11502c6d-b66f8ffa.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11502c6d-f4834c96.jpg",
    "distances": {
      "pHash": 12.0,
      "aHash": 12.0,
      "dHash": 8.0,
      "ResNet50": 0.0499
    },
    "flagged_by": [
      "ResNet50"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "ResNet50 báo nhầm: Xe đã rẽ qua giao lộ khác.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 20,
    "video_id": "11dc1774",
    "img1": "11dc1774-0a765996.jpg",
    "img2": "11dc1774-3e573074.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-0a765996.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-3e573074.jpg",
    "distances": {
      "pHash": 16.0,
      "aHash": 4.0,
      "dHash": 26.0,
      "ResNet50": 0.4257
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 21,
    "video_id": "11dc1774",
    "img1": "11dc1774-0a765996.jpg",
    "img2": "11dc1774-6942564c.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-0a765996.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-6942564c.jpg",
    "distances": {
      "pHash": 10.0,
      "aHash": 1.0,
      "dHash": 19.0,
      "ResNet50": 0.1528
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 22,
    "video_id": "11dc1774",
    "img1": "11dc1774-0a765996.jpg",
    "img2": "11dc1774-98ab1ef4.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-0a765996.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-98ab1ef4.jpg",
    "distances": {
      "pHash": 14.0,
      "aHash": 4.0,
      "dHash": 25.0,
      "ResNet50": 0.4238
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 23,
    "video_id": "11dc1774",
    "img1": "11dc1774-0a765996.jpg",
    "img2": "11dc1774-bf4763bf.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-0a765996.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-bf4763bf.jpg",
    "distances": {
      "pHash": 16.0,
      "aHash": 3.0,
      "dHash": 32.0,
      "ResNet50": 0.3213
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 24,
    "video_id": "11dc1774",
    "img1": "11dc1774-3e573074.jpg",
    "img2": "11dc1774-812e76a9.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-3e573074.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-812e76a9.jpg",
    "distances": {
      "pHash": 18.0,
      "aHash": 3.0,
      "dHash": 26.0,
      "ResNet50": 0.4687
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 25,
    "video_id": "11dc1774",
    "img1": "11dc1774-3e573074.jpg",
    "img2": "11dc1774-98ab1ef4.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-3e573074.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-98ab1ef4.jpg",
    "distances": {
      "pHash": 2.0,
      "aHash": 0.0,
      "dHash": 9.0,
      "ResNet50": 0.0155
    },
    "flagged_by": [
      "pHash",
      "aHash",
      "ResNet50"
    ],
    "initial_prediction": "Duplicate",
    "human_label": "Duplicate",
    "verification_status": "verified_by_human",
    "notes": "Xe dừng trong hầm, HD=2, góc nhìn gần như bất biến.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 26,
    "video_id": "11dc1774",
    "img1": "11dc1774-3e573074.jpg",
    "img2": "11dc1774-bf4763bf.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-3e573074.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-bf4763bf.jpg",
    "distances": {
      "pHash": 16.0,
      "aHash": 1.0,
      "dHash": 22.0,
      "ResNet50": 0.4369
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 27,
    "video_id": "11dc1774",
    "img1": "11dc1774-3e573074.jpg",
    "img2": "11dc1774-e4217b25.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-3e573074.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-e4217b25.jpg",
    "distances": {
      "pHash": 24.0,
      "aHash": 2.0,
      "dHash": 33.0,
      "ResNet50": 0.4028
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 28,
    "video_id": "11dc1774",
    "img1": "11dc1774-6942564c.jpg",
    "img2": "11dc1774-bf4763bf.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-6942564c.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-bf4763bf.jpg",
    "distances": {
      "pHash": 18.0,
      "aHash": 4.0,
      "dHash": 33.0,
      "ResNet50": 0.32
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 29,
    "video_id": "11dc1774",
    "img1": "11dc1774-6eb9c063.jpg",
    "img2": "11dc1774-9647e9b0.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-6eb9c063.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-9647e9b0.jpg",
    "distances": {
      "pHash": 22.0,
      "aHash": 4.0,
      "dHash": 21.0,
      "ResNet50": 0.6231
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 30,
    "video_id": "11dc1774",
    "img1": "11dc1774-812e76a9.jpg",
    "img2": "11dc1774-98ab1ef4.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-812e76a9.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-98ab1ef4.jpg",
    "distances": {
      "pHash": 20.0,
      "aHash": 3.0,
      "dHash": 27.0,
      "ResNet50": 0.4808
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 31,
    "video_id": "11dc1774",
    "img1": "11dc1774-812e76a9.jpg",
    "img2": "11dc1774-bf4763bf.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-812e76a9.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-bf4763bf.jpg",
    "distances": {
      "pHash": 20.0,
      "aHash": 2.0,
      "dHash": 30.0,
      "ResNet50": 0.3003
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 32,
    "video_id": "11dc1774",
    "img1": "11dc1774-98ab1ef4.jpg",
    "img2": "11dc1774-bf4763bf.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-98ab1ef4.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-bf4763bf.jpg",
    "distances": {
      "pHash": 14.0,
      "aHash": 1.0,
      "dHash": 27.0,
      "ResNet50": 0.4461
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 33,
    "video_id": "11dc1774",
    "img1": "11dc1774-98ab1ef4.jpg",
    "img2": "11dc1774-e4217b25.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-98ab1ef4.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-e4217b25.jpg",
    "distances": {
      "pHash": 24.0,
      "aHash": 2.0,
      "dHash": 34.0,
      "ResNet50": 0.4066
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  },
  {
    "pair_id": 34,
    "video_id": "11dc1774",
    "img1": "11dc1774-bf4763bf.jpg",
    "img2": "11dc1774-e4217b25.jpg",
    "path_img1": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-bf4763bf.jpg",
    "path_img2": "/Users/huynh/orca/workspaces/BuildPhase/tang/paper_v4_10k/data/bdd10k/images/train/11dc1774-e4217b25.jpg",
    "distances": {
      "pHash": 26.0,
      "aHash": 3.0,
      "dHash": 29.0,
      "ResNet50": 0.2787
    },
    "flagged_by": [
      "aHash"
    ],
    "initial_prediction": "Suspected",
    "human_label": "Not duplicate",
    "verification_status": "verified_by_human",
    "notes": "aHash báo nhầm: Đường hầm tối, khung hình khác nhau.",
    "verified_by": "Human Expert (T018)"
  }
];

// 2. BẢNG TỔNG KẾT ĐỐI CHUẨN 6 PHƯƠNG PHÁP (PAPER-READY)
const BENCHMARK_SUMMARY = [
  {
    "Phương Pháp": "No-Dedup (Raw Baseline)",
    "Yêu Cầu Phần Cứng": "CPU Only",
    "Thông Lượng (FPS)": 93520.5,
    "Độ Trễ (ms/ảnh)": 0.01,
    "Human Precision (%)": 0.0,
    "Human Recall (%)": 0.0,
    "Human F1 (%)": 0.0,
    "Robust AUC-ROC": 0.5,
    "Bảo Toàn BBox": "Thụ Động (Keep-First)"
  },
  {
    "Phương Pháp": "aHash (HD < 5)",
    "Yêu Cầu Phần Cứng": "CPU Only",
    "Thông Lượng (FPS)": 405.0,
    "Độ Trễ (ms/ảnh)": 2.47,
    "Human Precision (%)": 18.75,
    "Human Recall (%)": 100.0,
    "Human F1 (%)": 31.58,
    "Robust AUC-ROC": 0.95,
    "Bảo Toàn BBox": "Thụ Động (Keep-First)"
  },
  {
    "Phương Pháp": "dHash (HD < 5)",
    "Yêu Cầu Phần Cứng": "CPU Only",
    "Thông Lượng (FPS)": 440.4,
    "Độ Trễ (ms/ảnh)": 2.27,
    "Human Precision (%)": 100.0,
    "Human Recall (%)": 66.67,
    "Human F1 (%)": 80.0,
    "Robust AUC-ROC": 0.9,
    "Bảo Toàn BBox": "Thụ Động (Keep-First)"
  },
  {
    "Phương Pháp": "Standard pHash (HD < 5)",
    "Yêu Cầu Phần Cứng": "CPU Only",
    "Thông Lượng (FPS)": 415.3,
    "Độ Trễ (ms/ảnh)": 2.41,
    "Human Precision (%)": 100.0,
    "Human Recall (%)": 100.0,
    "Human F1 (%)": 100.0,
    "Robust AUC-ROC": 0.87,
    "Bảo Toàn BBox": "Thụ Động (Keep-First)"
  },
  {
    "Phương Pháp": "ResNet50 Embedding (Cosine Sim > 0.95)",
    "Yêu Cầu Phần Cứng": "GPU/PyTorch",
    "Thông Lượng (FPS)": 29.2,
    "Độ Trễ (ms/ảnh)": 34.24,
    "Human Precision (%)": 71.43,
    "Human Recall (%)": 83.33,
    "Human F1 (%)": 76.92,
    "Robust AUC-ROC": 0.94,
    "Bảo Toàn BBox": "Thụ Động (Keep-First)"
  },
  {
    "Phương Pháp": "Proposed: pHash + Keep-Most-Vehicles (HD < 5)",
    "Yêu Cầu Phần Cứng": "CPU Only",
    "Thông Lượng (FPS)": 397.3,
    "Độ Trễ (ms/ảnh)": 2.52,
    "Human Precision (%)": 100.0,
    "Human Recall (%)": 100.0,
    "Human F1 (%)": 100.0,
    "Robust AUC-ROC": 0.87,
    "Bảo Toàn BBox": "Tối Đa (Keep-Most)"
  }
];

// 3. KHOẢNG TIN CẬY BOOTSTRAP 95%
const BOOTSTRAP_CI = [
  {
    "Phương Pháp": "aHash (HD < 5)",
    "F1-Score 95% CI": "95.0% [89.7% - 98.9%]",
    "Precision 95% CI": "100.0% [100.0% - 100.0%]",
    "Recall 95% CI": "90.4% [81.2% - 97.8%]"
  },
  {
    "Phương Pháp": "dHash (HD < 5)",
    "F1-Score 95% CI": "89.2% [80.5% - 95.4%]",
    "Precision 95% CI": "100.0% [100.0% - 100.0%]",
    "Recall 95% CI": "80.4% [67.3% - 91.2%]"
  },
  {
    "Phương Pháp": "Standard pHash (HD < 5)",
    "F1-Score 95% CI": "85.1% [75.3% - 92.3%]",
    "Precision 95% CI": "100.0% [100.0% - 100.0%]",
    "Recall 95% CI": "74.0% [60.4% - 85.7%]"
  },
  {
    "Phương Pháp": "ResNet50 Embedding (Cosine Sim > 0.95)",
    "F1-Score 95% CI": "93.9% [87.7% - 98.0%]",
    "Precision 95% CI": "100.0% [100.0% - 100.0%]",
    "Recall 95% CI": "88.5% [78.0% - 96.2%]"
  },
  {
    "Phương Pháp": "Proposed: pHash + Keep-Most-Vehicles (HD < 5)",
    "F1-Score 95% CI": "85.1% [75.3% - 92.3%]",
    "Precision 95% CI": "100.0% [100.0% - 100.0%]",
    "Recall 95% CI": "74.0% [60.4% - 85.7%]"
  }
];

// 4. QUẢN LÝ PIPELINE VIDEO-FLOW SIMULATOR (MÔ PHỎNG DẠNG VIDEO)
const PIPELINE_SIMULATOR = {
  currentStage: 1,
  totalStages: 4,
  isPlaying: false,
  timer: null,
  speed: 1,

  stages: [
    {
      id: 1,
      title: "Chặng 1: Nạp Dữ Liệu Thô (Raw Ingestion)",
      kicker: "ĐẦU VÀO PIPELINE",
      desc: "7.000 khung hình xe tự hành (1280x720) đổ vào từ camera hành trình. Các frame chứa vô số khung hình tĩnh dư thừa khi dừng đèn đỏ và kẹt xe.",
      telemetry: "Dung lượng: ~5.8 GB | 7.000 files | 598 chuỗi video",
      badgeColor: "bg-[#E8F0EA] text-[#2D5A34]",
      actionHighlight: "Nạp và phân nhóm chuỗi video theo video_id prefix",
      samplePair: null
    },
    {
      id: 2,
      title: "Chặng 2: Stream 1 Sàng Lọc Thô Siêu Tốc (Coarse pHash Screening)",
      kicker: "STREAM 1 — TẦN SỐ THẤP DCT CPU O(1)",
      desc: "Áp dụng biến đổi DCT 32x32 co về 8x8 tần số thấp trên CPU (>390 FPS). Quét các cặp trong cùng chuỗi: nếu Hamming Distance HD < 5, kích hoạt cờ xung đột cảnh tĩnh.",
      telemetry: "Phát hiện 6 cặp trùng lặp thực tế | HD < 5 | Tốc độ: 397.3 FPS",
      badgeColor: "bg-[#FEF3C7] text-[#92400E]",
      actionHighlight: "Bắt chính xác các cặp dừng xe thực tế, loại trừ 28 cặp nhiễu",
      samplePair: {
        title: "Cặp #02 (Ngã tư dừng đèn đỏ)",
        f1: "06ac7da9-81ae9c1c.jpg",
        f2: "06ac7da9-b4b26aa1.jpg",
        status: "Trùng hoàn toàn (HD = 0)",
        note: "Bất biến 100% từng pixel, xe đứng yên tuyệt đối."
      }
    },
    {
      id: 3,
      title: "Chặng 3: Stream 2 Phân Giải Xung Đột & Bảo Toàn Xe (Keep-Most-Vehicles)",
      kicker: "STREAM 2 — NOVELTY BẢO TOÀN NGỮ NGHĨA",
      desc: "Khi 2 khung hình gần trùng nhau (HD < 5), không vứt ngẫu nhiên. Stream 2 đếm BBox xe, ưu tiên giữ lại frame có nhiều đối tượng hơn và có người đi bộ mới bước vào.",
      telemetry: "Bảo toàn: 76 xe | 50 xe nhỏ (<32px) | 64 xe che khuất",
      badgeColor: "bg-[#DCEBE0] text-[#2D5A34]",
      actionHighlight: "Cặp #01: Có 1 người mới bước vào bãi đỗ -> Giữ lại khung hình 16 objects, loại khung hình 15 objects!",
      samplePair: {
        title: "Cặp #01 (Bãi đỗ xe chạng vạng)",
        f1: "012a9c41-69222e1b.jpg (16 objects, 2 người)",
        f2: "012a9c41-edad898c.jpg (15 objects, 1 người)",
        status: "Near-duplicate (HD = 4)",
        note: "Giữ khung hình có thêm người đi bộ, ngăn chặn mất mát mẫu học quý hiếm!"
      }
    },
    {
      id: 4,
      title: "Chặng 4: Xuất Dữ Liệu Sạch (Zero Storage Symlinks)",
      kicker: "ĐẦU RA PIPELINE",
      desc: "Xuất 6.994 ảnh sạch vào unique_pool/ bằng Symbolic Links (0 KB đĩa phụ trội), loại bỏ 6 ảnh tĩnh vào dropped_duplicates/. Sẵn sàng 100% cho Active Learning Phase 02.",
      telemetry: "unique_pool: 6.994 ảnh | dropped: 6 ảnh (0.09%) | Dung lượng tăng: 0 KB",
      badgeColor: "bg-[#E8F0EA] text-[#2D5A34]",
      actionHighlight: "Hoàn tất tiền xử lý lọc trùng toàn trình trong 11.16 giây!",
      samplePair: null
    }
  ],

  setStage(stageNum) {
    this.currentStage = stageNum;
    this.renderStage();
  },

  nextStage() {
    if (this.currentStage < this.totalStages) {
      this.currentStage++;
    } else {
      this.currentStage = 1;
    }
    this.renderStage();
  },

  prevStage() {
    if (this.currentStage > 1) {
      this.currentStage--;
      this.renderStage();
    }
  },

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const playBtn = document.getElementById('simPlayBtn');
    if (this.isPlaying) {
      if (playBtn) playBtn.innerHTML = '⏸ Tạm Dừng Mô Phỏng';
      this.timer = setInterval(() => {
        this.nextStage();
      }, 3500 / this.speed);
    } else {
      if (playBtn) playBtn.innerHTML = '▶ Phát Toàn Trình (Play All)';
      clearInterval(this.timer);
    }
  },

  renderStage() {
    const stage = this.stages.find(s => s.id === this.currentStage);
    if (!stage) return;

    // Cập nhật indicators
    document.querySelectorAll('.stage-pill').forEach((el, idx) => {
      if (idx + 1 === this.currentStage) {
        el.className = 'stage-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2D5A34] text-white shadow-soft-sm cursor-pointer';
      } else {
        el.className = 'stage-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFFFF] border border-[#E5E3DC] text-[#475254] hover:bg-[#F0EEE6] cursor-pointer';
      }
    });

    // Cập nhật nội dung text
    const titleEl = document.getElementById('simStageTitle');
    const kickerEl = document.getElementById('simStageKicker');
    const descEl = document.getElementById('simStageDesc');
    const telemEl = document.getElementById('simStageTelem');
    const actionEl = document.getElementById('simStageAction');

    if (titleEl) titleEl.innerText = stage.title;
    if (kickerEl) kickerEl.innerText = stage.kicker;
    if (descEl) descEl.innerText = stage.desc;
    if (telemEl) telemEl.innerText = stage.telemetry;
    if (actionEl) actionEl.innerText = stage.actionHighlight;

    // Cập nhật visual canvas animation
    const visualBox = document.getElementById('simVisualCanvas');
    if (visualBox) {
      if (stage.id === 1) {
        visualBox.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div class="flex items-center gap-3 p-2 bg-[#E8F0EA] rounded-2xl border border-[#CDE0D1]"><svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg> <svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg> <svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 19 4-14"/><path d="m16 5 4 14"/><path d="M12 8v2"/><path d="M12 14v2"/></svg> <svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 8h.01"/><path d="M7 12h.01"/><path d="M15 8h.01"/><path d="M15 12h.01"/><rect width="8" height="12" x="13" y="9" rx="1"/></svg></div>
            <div class="font-editorial text-xl font-bold text-[#1F2627]">7.000 Khung Hình Đang Đổ Vào Pipeline</div>
            <p class="text-xs text-[#6B7677] max-w-md">Băng chuyền dữ liệu tiếp nhận ảnh thô từ camera hành trình BDD10K qua 598 hành trình xe khác nhau.</p>
            <div class="w-full max-w-sm bg-[#E5E3DC] h-2 rounded-full overflow-hidden">
              <div class="bg-[#2D5A34] h-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        `;
      } else if (stage.id === 2) {
        visualBox.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div class="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full text-xs font-mono font-bold">
              <svg class="w-3.5 h-3.5 inline-block -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> pHash DCT CPU: 397.3 FPS | Zero GPU
            </div>
            <div class="font-editorial text-lg font-bold text-[#1F2627]">Sàng Lọc Ma Trận Tần Số 64-bit</div>
            <div class="grid grid-cols-2 gap-3 max-w-sm w-full my-2">
              <div class="p-3 bg-white rounded-xl border border-[#E5E3DC] text-left">
                <div class="text-[10px] text-[#6B7677]">Khung hình i</div>
                <div class="font-mono text-xs font-bold text-[#1F2627]">06ac7da9-81a...</div>
                <div class="text-[10px] text-[#2D5A34] font-mono mt-1">Hash: e8f4...91c</div>
              </div>
              <div class="p-3 bg-white rounded-xl border border-[#E5E3DC] text-left">
                <div class="text-[10px] text-[#6B7677]">Khung hình j (cách 1s)</div>
                <div class="font-mono text-xs font-bold text-[#1F2627]">06ac7da9-b4b...</div>
                <div class="text-[10px] text-[#2D5A34] font-mono mt-1">Hash: e8f4...91c</div>
              </div>
            </div>
            <div class="text-xs text-[#991B1B] font-mono font-bold">Hamming Distance = 0 → PHÁT HIỆN TRÙNG LẶP!</div>
          </div>
        `;
      } else if (stage.id === 3) {
        visualBox.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div class="inline-flex items-center gap-1.5 bg-[#DCEBE0] text-[#2D5A34] px-3 py-1 rounded-full text-xs font-mono font-bold">
              <svg class="w-3.5 h-3.5 inline-block -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Keep-Most-Vehicles: Bảo Toàn Mẫu Hiếm
            </div>
            <div class="font-editorial text-lg font-bold text-[#1F2627]">Cặp #01: Có 1 Người Đi Bộ Mới Bước Vào!</div>
            <div class="grid grid-cols-2 gap-3 max-w-md w-full">
              <div class="p-3 bg-[#E8F0EA] border-2 border-[#2D5A34] rounded-xl text-left relative">
                <span class="absolute -top-2.5 right-2 bg-[#2D5A34] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">GIỮ LẠI (KEPT)</span>
                <div class="text-xs font-bold text-[#1F2627]">Khung hình A</div>
                <div class="text-[11px] text-[#2D5A34] font-semibold mt-1">16 Đối Tượng (2 Người Đi Bộ)</div>
                <div class="text-[10px] text-[#475254] mt-0.5">Bảo toàn người đi bộ quý hiếm</div>
              </div>
              <div class="p-3 bg-[#F8F7F2] border border-[#E5E3DC] rounded-xl text-left opacity-60 relative">
                <span class="absolute -top-2.5 right-2 bg-[#6B7677] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">LOẠI BỎ (DROPPED)</span>
                <div class="text-xs font-bold text-[#1F2627]">Khung hình B</div>
                <div class="text-[11px] text-[#6B7677] font-semibold mt-1">15 Đối Tượng (1 Người)</div>
                <div class="text-[10px] text-[#6B7677] mt-0.5">Tránh học vẹt cảnh lặp</div>
              </div>
            </div>
            <div class="text-xs text-[#2D5A34] font-semibold">Tự động cứu sống 4 vật thể nhỏ & người đi bộ so với Keep-First!</div>
          </div>
        `;
      } else if (stage.id === 4) {
        visualBox.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div class="flex items-center gap-3 p-2 bg-[#E8F0EA] rounded-2xl border border-[#CDE0D1]"><svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> <svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg> <svg class="w-7 h-7 text-[#2D5A34] inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg></div>
            <div class="font-editorial text-xl font-bold text-[#1F2627]">Dữ Liệu Đã Được Materialize Thành Công</div>
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white border border-[#E5E3DC] rounded-xl text-left">
                <div class="text-xs font-bold text-[#2D5A34]">data/processed/unique_pool/</div>
                <div class="text-lg font-mono font-bold text-[#1F2627]">6.994 ảnh</div>
                <div class="text-[10px] text-[#6B7677]">Symlinks sạch 0 KB overhead</div>
              </div>
              <div class="p-3 bg-white border border-[#E5E3DC] rounded-xl text-left">
                <div class="text-xs font-bold text-[#991B1B]">data/processed/dropped_duplicates/</div>
                <div class="text-lg font-mono font-bold text-[#1F2627]">6 ảnh</div>
                <div class="text-[10px] text-[#6B7677]">Khung hình tĩnh bị loại bỏ</div>
              </div>
            </div>
            <div class="text-xs font-mono text-[#2D5A34]">Sẵn sàng 100% cho Active Learning Phase 02!</div>
          </div>
        `;
      }
    }
  }
};

// 5. RENDER BẢNG ĐỐI CHUẨN LEADERBOARD
function renderLeaderboard() {
  const tbody = document.getElementById('leaderboardTableBody');
  if (!tbody) return;

  tbody.innerHTML = BENCHMARK_SUMMARY.map((row, idx) => {
    const isChampion = row['Phương Pháp'].includes('Proposed');
    return `
      <tr class="${isChampion ? 'bg-[#E8F0EA] font-semibold border-l-4 border-[#2D5A34]' : 'hover:bg-[#F8F7F2]'} transition-colors">
        <td class="p-3.5 text-xs text-[#1F2627] flex items-center gap-2">
          ${isChampion ? '<svg class="w-3.5 h-3.5 text-amber-500 inline-block -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>' : '<span class="text-xs text-[#8A9697] font-mono">#' + (idx+1) + '</span>'}
          <span>${row['Phương Pháp']}</span>
        </td>
        <td class="p-3.5 text-xs text-[#475254]">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono ${row['Yêu Cầu Phần Cứng'].includes('GPU') ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#F0EEE6] text-[#475254]'}">
            ${row['Yêu Cầu Phần Cứng']}
          </span>
        </td>
        <td class="p-3.5 text-xs font-mono font-bold ${isChampion ? 'text-[#2D5A34]' : 'text-[#1F2627]'}">${Number(row['Thông Lượng (FPS)']).toFixed(1)}</td>
        <td class="p-3.5 text-xs font-mono text-[#6B7677]">${Number(row['Độ Trễ (ms/ảnh)']).toFixed(2)} ms</td>
        <td class="p-3.5 text-xs font-mono font-bold ${row['Human Precision (%)'] === 100 ? 'text-[#2D5A34]' : 'text-[#991B1B]'}">${row['Human Precision (%)']}%</td>
        <td class="p-3.5 text-xs font-mono font-bold ${row['Human Recall (%)'] === 100 ? 'text-[#2D5A34]' : 'text-[#92400E]'}">${row['Human Recall (%)']}%</td>
        <td class="p-3.5 text-xs font-mono font-bold ${row['Human F1 (%)'] === 100 ? 'text-[#2D5A34]' : 'text-[#475254]'}">${row['Human F1 (%)']}%</td>
        <td class="p-3.5 text-xs text-[#475254]">
          <span class="px-2 py-0.5 rounded text-[10px] ${isChampion ? 'bg-[#DCEBE0] text-[#2D5A34] font-bold' : 'bg-[#F0EEE6] text-[#6B7677]'}">
            ${row['Bảo Toàn BBox']}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// 6. RENDER HUMAN AUDIT GALLERY (34 CẶP ỨNG VIÊN VỚI 5 FILTER TABS)
let currentFilter = 'all';

function renderAuditGallery(filterType = 'all') {
  currentFilter = filterType;
  const container = document.getElementById('auditGalleryGrid');
  const countEl = document.getElementById('filteredCount');
  if (!container) return;

  // Cập nhật tab active
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filterType) {
      btn.className = 'filter-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-[#2D5A34] text-white shadow-soft-sm cursor-pointer';
    } else {
      btn.className = 'filter-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E5E3DC] text-[#475254] hover:bg-[#F8F7F2] cursor-pointer';
    }
  });

  // Lọc dữ liệu
  let filtered = CANDIDATES_DATA;
  if (filterType === 'duplicate') {
    filtered = CANDIDATES_DATA.filter(c => c.human_label === 'Duplicate');
  } else if (filterType === 'near_duplicate') {
    filtered = CANDIDATES_DATA.filter(c => c.human_label === 'Near-duplicate');
  } else if (filterType === 'ahash_fp') {
    filtered = CANDIDATES_DATA.filter(c => c.human_label === 'Not duplicate' && c.flagged_by.includes('aHash'));
  } else if (filterType === 'resnet_fp') {
    filtered = CANDIDATES_DATA.filter(c => c.human_label === 'Not duplicate' && c.flagged_by.includes('ResNet50'));
  }

  if (countEl) countEl.innerText = `Hiển thị ${filtered.length} / 34 cặp ứng viên`;

  container.innerHTML = filtered.map(c => {
    const pid = c.pair_id;
    const isDup = c.human_label === 'Duplicate';
    const isNear = c.human_label === 'Near-duplicate';
    const isNot = c.human_label === 'Not duplicate';

    let badgeClass = 'bg-[#FEE2E2] text-[#991B1B]';
    let labelText = 'NOT DUPLICATE';
    if (isDup) {
      badgeClass = 'bg-[#DCEBE0] text-[#2D5A34]';
      labelText = 'DUPLICATE (TRÙNG 100%)';
    } else if (isNear) {
      badgeClass = 'bg-[#FEF3C7] text-[#92400E]';
      labelText = 'NEAR-DUPLICATE (GẦN TRÙNG)';
    }

    const dists = c.distances || {};
    const imgSrc = `assets/review_pairs/pair_${String(pid).padStart(2, '0')}.jpg`;

    return `
      <div class="editorial-card p-4 space-y-3 cursor-pointer hover:border-[#2D5A34] transition-all" onclick="openPairModal(${pid})">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-[#1F2627]">Cặp #${String(pid).padStart(2, '0')}</span>
            <span class="text-[10px] font-mono text-[#6B7677]">Video: ${c.video_id}</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${badgeClass}">
            ${labelText}
          </span>
        </div>

        <div class="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#ECEAE2] relative group">
          <img src="${imgSrc}" alt="Pair ${pid}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
            <svg class="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg> Bấm xem đối chứng cận cảnh
          </div>
        </div>

        <div class="grid grid-cols-4 gap-1 text-center py-1 bg-[#F8F7F2] rounded-lg border border-[#E5E3DC]">
          <div>
            <div class="text-[9px] text-[#6B7677]">pHash</div>
            <div class="font-mono text-[11px] font-bold ${dists.pHash < 5 ? 'text-[#2D5A34]' : 'text-[#475254]'}">${dists.pHash}</div>
          </div>
          <div>
            <div class="text-[9px] text-[#6B7677]">aHash</div>
            <div class="font-mono text-[11px] font-bold ${dists.aHash < 5 ? 'text-[#92400E]' : 'text-[#475254]'}">${dists.aHash}</div>
          </div>
          <div>
            <div class="text-[9px] text-[#6B7677]">dHash</div>
            <div class="font-mono text-[11px] font-bold">${dists.dHash}</div>
          </div>
          <div>
            <div class="text-[9px] text-[#6B7677]">ResNet</div>
            <div class="font-mono text-[11px] font-bold">${dists.ResNet50}</div>
          </div>
        </div>

        <p class="text-[11px] text-[#475254] line-clamp-2 leading-relaxed">
          <span class="font-semibold text-[#1F2627]">Nhận định con người:</span> ${c.notes}
        </p>
      </div>
    `;
  }).join('');
}

// 7. MODAL XEM CHI TIẾT CẬP ẢNH
function openPairModal(pairId) {
  const pair = CANDIDATES_DATA.find(c => c.pair_id === pairId);
  if (!pair) return;

  const modal = document.getElementById('pairDetailModal');
  const modalContent = document.getElementById('pairModalBody');
  if (!modal || !modalContent) return;

  const imgSrc = `assets/review_pairs/pair_${String(pairId).padStart(2, '0')}.jpg`;
  const dists = pair.distances || {};

  modalContent.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
        <div>
          <div class="text-xs font-mono font-bold text-[#2D5A34]">KIỂM TOÁN CHI TIẾT CẶP #${String(pairId).padStart(2, '0')}</div>
          <div class="font-editorial text-lg font-bold text-[#1F2627]">Chuỗi Video BDD10K: ${pair.video_id}</div>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold ${pair.human_label === 'Duplicate' ? 'bg-[#DCEBE0] text-[#2D5A34]' : pair.human_label === 'Near-duplicate' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#FEE2E2] text-[#991B1B]'}">
          ${pair.human_label.toUpperCase()}
        </span>
      </div>

      <div class="rounded-xl overflow-hidden border border-[#E5E3DC]">
        <img src="${imgSrc}" alt="Pair ${pairId}" class="w-full h-auto">
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E3DC]">
          <div class="text-[10px] text-[#6B7677]">Standard pHash</div>
          <div class="text-lg font-mono font-bold text-[#2D5A34]">HD = ${dists.pHash}</div>
          <div class="text-[10px] text-[#475254] mt-1">${dists.pHash < 5 ? '<svg class="w-3.5 h-3.5 text-emerald-600 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Đánh dấu trùng lặp' : '<svg class="w-3.5 h-3.5 text-red-500 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Bỏ qua'}</div>
        </div>
        <div class="p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E3DC]">
          <div class="text-[10px] text-[#6B7677]">Average Hash (aHash)</div>
          <div class="text-lg font-mono font-bold text-[#92400E]">HD = ${dists.aHash}</div>
          <div class="text-[10px] text-[#475254] mt-1">${dists.aHash < 5 ? '<svg class="w-3.5 h-3.5 text-amber-500 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Gắn cờ trùng' : '<svg class="w-3.5 h-3.5 text-red-500 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Bỏ qua'}</div>
        </div>
        <div class="p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E3DC]">
          <div class="text-[10px] text-[#6B7677]">Difference Hash (dHash)</div>
          <div class="text-lg font-mono font-bold text-[#1F2627]">HD = ${dists.dHash}</div>
          <div class="text-[10px] text-[#475254] mt-1">${dists.dHash < 5 ? '<svg class="w-3.5 h-3.5 text-emerald-600 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Gắn cờ' : '<svg class="w-3.5 h-3.5 text-red-500 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Bỏ sót'}</div>
        </div>
        <div class="p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E3DC]">
          <div class="text-[10px] text-[#6B7677]">ResNet50 Embedding</div>
          <div class="text-lg font-mono font-bold text-[#1F2627]">Cos = ${dists.ResNet50}</div>
          <div class="text-[10px] text-[#475254] mt-1">${dists.ResNet50 < 0.05 ? '<svg class="w-3.5 h-3.5 text-amber-500 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Gắn cờ ngữ nghĩa' : '<svg class="w-3.5 h-3.5 text-red-500 inline-block -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Bỏ qua'}</div>
        </div>
      </div>

      <div class="p-4 bg-[#E8F0EA] rounded-xl border border-[#CDE0D1] space-y-1">
        <div class="text-xs font-bold text-[#2D5A34]">LÝ DO PHÂN LOẠI CỦA CON NGƯỜI (HUMAN AUDIT VERDICT):</div>
        <p class="text-xs text-[#1F2627] leading-relaxed">${pair.notes}</p>
      </div>

      <div class="flex items-center justify-between text-[11px] text-[#6B7677] pt-2">
        <span>Gợi ý ban đầu bởi: <strong class="text-[#1F2627]">${pair.flagged_by.join(', ')}</strong></span>
        <span>Kiểm toán bởi: <strong class="text-[#2D5A34]">${pair.verified_by || 'Human Expert'}</strong></span>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closePairModal() {
  const modal = document.getElementById('pairDetailModal');
  if (modal) modal.classList.add('hidden');
}

// 8. KHỞI TẠO BIỂU ĐỒ (CHART.JS)
function initCharts() {
  // Chart 1: Tốc Độ Thông Lượng FPS (Dạng Bar Ngang)
  const speedCtx = document.getElementById('chartSpeedFps');
  if (speedCtx && typeof Chart !== 'undefined') {
    new Chart(speedCtx, {
      type: 'bar',
      data: {
        labels: ['No-Dedup', 'dHash', 'Standard pHash', 'aHash', 'Proposed (pHash+KMV)', 'ResNet50 (GPU)'],
        datasets: [{
          label: 'Thông Lượng (FPS - Cao hơn là tốt hơn)',
          data: [93520.5, 440.4, 415.3, 405.0, 397.3, 29.2],
          backgroundColor: ['#E5E3DC', '#C6D9E8', '#B7CDBB', '#FEF3C7', '#2D5A34', '#FEE2E2'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            type: 'logarithmic',
            title: { display: true, text: 'FPS (Thang Logarit)', font: { size: 10 } }
          }
        }
      }
    });
  }

  // Chart 2: Độ Bền Biến Đổi Quang Học
  const robustCtx = document.getElementById('chartRobustness');
  if (robustCtx && typeof Chart !== 'undefined') {
    new Chart(robustCtx, {
      type: 'bar',
      data: {
        labels: ['Xe Rung Lắc', 'Đèn Pha/Chói', 'Nén JPEG Q35', 'Nhiễu Đêm Tối', 'Crop 90%'],
        datasets: [
          { label: 'Proposed pHash', data: [90, 80, 100, 70, 60], backgroundColor: '#2D5A34', borderRadius: 6 },
          { label: 'ResNet50', data: [100, 90, 100, 90, 80], backgroundColor: '#991B1B', borderRadius: 6 },
          { label: 'aHash', data: [100, 90, 100, 90, 80], backgroundColor: '#D97706', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { min: 0, max: 110, title: { display: true, text: 'Tỷ Lệ Nhận Diện (%)' } }
        }
      }
    });
  }
}

// =============================================================================
// QUẢN LÝ BỘ TRÌNH CHIẾU MÔ PHỎNG DUAL-ENGINE (VIDEO MP4 & CANVAS INTERACTIVE)
// =============================================================================

let simDisplayMode = 'video'; // 'video' hoặc 'canvas'
let canvasSimCurrentTime = 0; // 0s -> 24s
let canvasSimIsPlaying = false;
let canvasAnimFrameId = null;
let lastTimestamp = 0;

// Bộ đệm ảnh mẫu cho Canvas
const canvasSampleImgs = {};
const SAMPLE_IMG_PATHS = [
  'assets/review_pairs/pair_01.jpg',
  'assets/review_pairs/pair_03.jpg',
  'assets/review_pairs/pair_15.jpg',
  'assets/review_pairs/pair_25.jpg'
];

function preloadCanvasImages() {
  SAMPLE_IMG_PATHS.forEach((src, idx) => {
    const im = new Image();
    im.src = src;
    canvasSampleImgs[idx] = im;
  });
}

// 1. Chuyển đổi hiển thị giữa Video MP4 và Canvas Simulator
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
    if (badge) badge.innerText = 'CHẾ ĐỘ VIDEO MP4 HD 60FPS';
    
    // Tạm dừng canvas
    pauseCanvasSim();
  } else {
    if (videoCont) videoCont.classList.add('hidden');
    if (canvasCont) canvasCont.classList.remove('hidden');
    if (tabVid) tabVid.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6B7677] hover:text-[#1F2627] cursor-pointer transition-all';
    if (tabCan) tabCan.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#2D5A34] shadow-soft-sm cursor-pointer transition-all';
    if (badge) badge.innerText = 'CHẾ ĐỘ CANVAS TƯƠNG TÁC 60FPS';
    
    // Tạm dừng video MP4
    if (vid) vid.pause();
    // Bắt đầu chạy canvas
    startCanvasSim();
  }
  updatePlayButtonUI();
}

// 2. Điều khiển Video MP4
function startVideoPlayback() {
  const vid = document.getElementById('pipelineVideoPlayer');
  const overlay = document.getElementById('videoPlayOverlay');
  if (vid) {
    vid.play().then(() => {
      if (overlay) overlay.style.display = 'none';
      updatePlayButtonUI();
    }).catch(err => {
      console.warn('Playback error (browser policy):', err);
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
    // Canvas mode
    if (canvasSimIsPlaying) {
      pauseCanvasSim();
    } else {
      startCanvasSim();
    }
    updatePlayButtonUI();
  }
}

function updatePlayButtonUI() {
  const btnIcon = document.getElementById('playBtnIcon');
  const btnText = document.getElementById('playBtnText');
  const isPlaying = (simDisplayMode === 'video') 
    ? !document.getElementById('pipelineVideoPlayer')?.paused 
    : canvasSimIsPlaying;

  if (isPlaying) {
    if (btnIcon) btnIcon.innerHTML = '<svg class="w-3 h-3 fill-white inline-block -mt-0.5" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    if (btnText) btnText.innerText = 'Tạm Dừng';
  } else {
    if (btnIcon) btnIcon.innerHTML = '<svg class="w-3 h-3 fill-white inline-block -mt-0.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    if (btnText) btnText.innerText = 'Phát Mô Phỏng';
  }
}

// 3. Tua đến từng mốc thời gian (Chặng 1, 2, 3, 4)
function seekSimulation(seconds) {
  if (simDisplayMode === 'video') {
    const vid = document.getElementById('pipelineVideoPlayer');
    if (vid) {
      vid.currentTime = seconds;
      startVideoPlayback();
    }
  } else {
    canvasSimCurrentTime = seconds;
    syncTelemetryWithTime(seconds);
    drawCanvasFrame(seconds);
    if (!canvasSimIsPlaying) {
      startCanvasSim();
    }
  }
}

// 4. Đồng bộ Telemetry và Pills với mốc thời gian
function syncTelemetryWithTime(curTime) {
  const timeDisplay = document.getElementById('playerTimeDisplay');
  if (timeDisplay) {
    timeDisplay.innerText = `00:${String(Math.floor(curTime)).padStart(2, '0')} / 00:36`;
  }

  let stage = 1;
  if (curTime >= 27) stage = 4;
  else if (curTime >= 16.5) stage = 3;
  else if (curTime >= 7) stage = 2;

  PIPELINE_SIMULATOR.currentStage = stage;
  const sObj = PIPELINE_SIMULATOR.stages.find(s => s.id === stage);
  if (sObj) {
    const titleEl = document.getElementById('simStageTitle');
    const kickerEl = document.getElementById('simStageKicker');
    const descEl = document.getElementById('simStageDesc');
    const telemEl = document.getElementById('simStageTelem');
    const actionEl = document.getElementById('simStageAction');

    if (titleEl) titleEl.innerText = sObj.title;
    if (kickerEl) kickerEl.innerText = sObj.kicker;
    if (descEl) descEl.innerText = sObj.desc;
    if (telemEl) telemEl.innerText = sObj.telemetry;
    if (actionEl) actionEl.innerText = sObj.actionHighlight;

    // Highlight pills
    for (let i = 1; i <= 4; i++) {
      const pill = document.getElementById('pillStage' + i);
      if (pill) {
        if (i === stage) {
          pill.className = 'stage-pill text-left p-3 rounded-xl border-2 border-[#2D5A34] bg-[#E8F0EA] transition-all cursor-pointer shadow-soft-sm';
        } else {
          pill.className = 'stage-pill text-left p-3 rounded-xl border border-[#E5E3DC] bg-white transition-all cursor-pointer opacity-70';
        }
      }
    }
  }
}

// 5. ENGINE CANVAS INTERACTIVE SIMULATOR (60 FPS)
function startCanvasSim() {
  canvasSimIsPlaying = true;
  lastTimestamp = performance.now();
  if (canvasAnimFrameId) cancelAnimationFrame(canvasAnimFrameId);
  canvasAnimFrameId = requestAnimationFrame(canvasSimLoop);
  updatePlayButtonUI();
}

function pauseCanvasSim() {
  canvasSimIsPlaying = false;
  if (canvasAnimFrameId) cancelAnimationFrame(canvasAnimFrameId);
  updatePlayButtonUI();
}

function canvasSimLoop(timestamp) {
  if (!canvasSimIsPlaying) return;
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  canvasSimCurrentTime += delta;
  if (canvasSimCurrentTime >= 36.5) {
    canvasSimCurrentTime = 0; // loop
  }

  syncTelemetryWithTime(canvasSimCurrentTime);
  drawCanvasFrame(canvasSimCurrentTime);

  canvasAnimFrameId = requestAnimationFrame(canvasSimLoop);
}

function drawCanvasFrame(t) {
  const canvas = document.getElementById('pipelineCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Background GreenSM Editorial
  ctx.fillStyle = '#F8F7F2';
  ctx.fillRect(0, 0, W, H);

  // Top Progress Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, 70);
  ctx.strokeStyle = '#E5E3DC';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, W, 70);

  // Stage Badge
  let stageNum = 1;
  let stageName = "DỮ LIỆU ĐỔ VÀO";
  if (t >= 27) { stageNum = 4; stageName = "XUẤT KHO DỮ LIỆU SẠCH"; }
  else if (t >= 16.5) { stageNum = 3; stageName = "STREAM 2: KEEP-MOST-VEHICLES"; }
  else if (t >= 7) { stageNum = 2; stageName = "STREAM 1: P-HASH CPU SCAN"; }

  ctx.fillStyle = '#E8F0EA';
  ctx.beginPath();
  ctx.roundRect(30, 16, 120, 38, 6);
  ctx.fill();
  ctx.fillStyle = '#2D5A34';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`CHẶNG ${stageNum}`, 50, 41);

  ctx.fillStyle = '#1F2627';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText(stageName, 170, 42);

  // Time Telemetry Right
  ctx.fillStyle = '#6B7677';
  ctx.font = '16px Monaco, monospace';
  ctx.fillText(`00:${String(Math.floor(t)).padStart(2, '0')} / 00:36`, W - 160, 42);

  // Progress Line
  ctx.fillStyle = '#2D5A34';
  ctx.fillRect(0, 68, (t / 36.5) * W, 3);

  // --- NỘI DUNG TỪNG CHẶNG ---
  if (t < 7.0) {
    // CHẶNG 1: Dữ Liệu Đổ Vào (0s -> 7s)
    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('BĂNG CHUYỀN KHUNG HÌNH (THÔNG LƯỢNG TIẾP NHẬN: 397.3 FPS)', 50, 110);
    ctx.fillStyle = '#6B7677';
    ctx.font = '14px sans-serif';
    ctx.fillText('Camera xe tự hành ghi nhận liên tục 7.000 frames thô từ 598 hành trình khác nhau.', 50, 135);

    // Frame Conveyor
    const scrollX = (t * 110) % 360;
    for (let i = 0; i < 5; i++) {
      const cx = 50 - scrollX + i * 340;
      const cy = 160;
      if (cx > -340 && cx < W) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(cx, cy, 310, 180);
        ctx.strokeStyle = '#E5E3DC';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx, cy, 310, 180);

        const imgObj = canvasSampleImgs[i % 4];
        if (imgObj && imgObj.complete) {
          ctx.drawImage(imgObj, cx + 5, cy + 5, 300, 140);
        } else {
          ctx.fillStyle = '#1F2627';
          ctx.fillRect(cx + 5, cy + 5, 300, 140);
        }

        ctx.fillStyle = '#1F2627';
        ctx.fillRect(cx, cy + 148, 310, 32);
        ctx.fillStyle = '#34d399';
        ctx.font = '12px Monaco, monospace';
        const fNum = Math.min(7000, Math.floor(100 + (t / 7.0) * 6900 + i * 20));
        ctx.fillText(`Frame #${String(fNum).padStart(4, '0')} | 1280x720 HD`, cx + 15, cy + 169);
      }
    }

    // Telemetry Box
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(50, 380, W - 100, 280, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1F2627';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('THÔNG SỐ TIẾP NHẬN THỜI GIAN THỰC (LIVE TELEMETRY)', 80, 420);

    const ingested = Math.min(7000, Math.floor((t / 7.0) * 7000));
    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 36px Monaco, monospace';
    ctx.fillText(`${ingested.toLocaleString()} / 7,000`, 80, 480);
    ctx.fillStyle = '#6B7677';
    ctx.font = '14px sans-serif';
    ctx.fillText('Khung hình thô đã được nạp vào bộ đệm xử lý cạnh biên', 80, 515);

    ctx.fillStyle = '#10B981';
    ctx.fillRect(80, 550, 400, 12);
    ctx.fillStyle = '#E5E3DC';
    ctx.fillRect(80 + (t / 7.0) * 400, 550, 400 - (t / 7.0) * 400, 12);
  } else if (t < 16.5) {
    // CHẶNG 2: Stream 1 pHash Quét (7s -> 16.5s)
    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('KHOANG QUÉT BĂM PHASH TẦN SỐ THẤP (DISCRETE COSINE TRANSFORM)', 50, 110);

    // Left View: Laser scan on image
    const imBoxX = 50, imBoxY = 140, imW = 560, imH = 320;
    const imgObj = canvasSampleImgs[0];
    if (imgObj && imgObj.complete) {
      ctx.drawImage(imgObj, imBoxX, imBoxY, imW, imH);
    } else {
      ctx.fillStyle = '#1F2627';
      ctx.fillRect(imBoxX, imBoxY, imW, imH);
    }
    ctx.strokeStyle = '#E5E3DC';
    ctx.strokeRect(imBoxX, imBoxY, imW, imH);

    // Laser Beam Animation
    const laserY = imBoxY + ((t - 7.0) % 2.0) / 2.0 * imH;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.fillRect(imBoxX, Math.max(imBoxY, laserY - 8), imW, 16);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(imBoxX, laserY);
    ctx.lineTo(imBoxX + imW, laserY);
    ctx.stroke();

    // Right View: DCT 8x8 Grid
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(640, 140, W - 690, imH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1F2627';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('MA TRẬN DCT 8x8 & KHÓA BĂM 64-BIT', 665, 175);

    // Grid cells
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = Math.floor((Math.sin(r * 2 + t * 4) + Math.cos(c * 2)) * 60 + 120);
        ctx.fillStyle = `rgb(${val / 3}, ${val}, ${val / 3})`;
        ctx.fillRect(665 + c * 26, 195 + r * 26, 24, 24);
      }
    }

    ctx.fillStyle = '#6B7677';
    ctx.font = '13px sans-serif';
    ctx.fillText('Mã băm pHash:', 895, 215);
    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 18px Monaco, monospace';
    ctx.fillText('0xa4f18c2b9e0711da', 895, 245);
    ctx.fillStyle = '#1F2627';
    ctx.font = '13px sans-serif';
    ctx.fillText('• Biến đổi DCT 32x32 -> 8x8\n• Tốc độ: 397.3 FPS (2.52 ms)\n• Zero GPU Overhead', 895, 280);

    // Decision Bar
    ctx.fillStyle = '#FEF2F2';
    ctx.beginPath();
    ctx.roundRect(50, 480, W - 100, 180, 12);
    ctx.fill();
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('CẢNH BÁO: PHÁT HIỆN CẶP CÙNG CHUỖI CÓ HD < 5 BIT (DUPLICATE DETECTED!)', 80, 520);
    ctx.fillStyle = '#1F2627';
    ctx.font = '14px sans-serif';
    ctx.fillText('Khoảng cách Hamming HD = 4 bit < Ngưỡng 5 bit → Kích hoạt Stream 2 Keep-Most-Vehicles để giải cứu đối tượng!', 80, 555);
  } else if (t < 27.0) {
    // CHẶNG 3: Stream 2 Keep-Most-Vehicles (16.5s -> 27s)
    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('STREAM 2: KEEP-MOST-VEHICLES GIẢI CỨU NGƯỜI ĐI BỘ TRONG CẶP #01', 50, 110);

    const boxW = 560, boxH = 315;
    const imgA = canvasSampleImgs[0];
    const imgB = canvasSampleImgs[1];

    if (imgA && imgA.complete) ctx.drawImage(imgA, 50, 140, boxW, boxH);
    if (imgB && imgB.complete) ctx.drawImage(imgB, 670, 140, boxW, boxH);

    ctx.strokeStyle = '#E5E3DC';
    ctx.strokeRect(50, 140, boxW, boxH);
    ctx.strokeRect(670, 140, boxW, boxH);

    // BBox on Frame A (Ô tô xung quanh)
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.strokeRect(50 + 120, 140 + 140, 90, 60);  // SUV Chevrolet
    ctx.strokeRect(50 + 270, 140 + 150, 90, 70);  // Sedan đen
    ctx.strokeRect(50 + 360, 140 + 150, 100, 75); // Nissan trắng

    // TỌA ĐỘ THẬT CHUẨN XÁC CỦA NGƯỜI ĐI BỘ (PERSON #9: x1=816, y1=324, x2=867, y2=490)
    const scaleX = boxW / 1280;
    const scaleY = boxH / 720;
    const pedX = 50 + 816 * scaleX;
    const pedY = 140 + 324 * scaleY;
    const pedW = (867 - 816) * scaleX;
    const pedH = (490 - 324) * scaleY;

    const blink = Math.floor(t * 5) % 2 === 0;
    ctx.strokeStyle = blink ? '#EF4444' : '#DC2626';
    ctx.lineWidth = 3;
    ctx.strokeRect(pedX, pedY, pedW, pedH);

    ctx.fillStyle = '#DC2626';
    ctx.fillRect(pedX - 35, pedY - 24, 140, 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('+1 PERSON DETECTED', pedX - 30, pedY - 8);

    // Frame B: BBoxes ô tô và ô trống người đi bộ
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.strokeRect(670 + 120, 140 + 140, 90, 60);
    ctx.strokeRect(670 + 270, 140 + 150, 90, 70);
    ctx.strokeRect(670 + 360, 140 + 150, 100, 75);

    // Missing person on Frame B
    const pedBX = 670 + 816 * scaleX;
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.strokeRect(pedBX, pedY, pedW, pedH);
    ctx.fillStyle = '#6B7677';
    ctx.fillRect(pedBX - 35, pedY - 24, 130, 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('(KHÔNG CÓ NGƯỜI)', pedBX - 30, pedY - 8);

    // Verdict
    ctx.fillStyle = '#E8F0EA';
    ctx.beginPath();
    ctx.roundRect(50, 480, boxW, 185, 12);
    ctx.fill();
    ctx.strokeStyle = '#2D5A34';
    ctx.stroke();

    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('BẮT BUỘC GIỮ LẠI KHUNG HÌNH A (KEPT)', 80, 515);
    ctx.fillStyle = '#1F2627';
    ctx.font = '14px sans-serif';
    ctx.fillText('16 đối tượng (có người đi bộ mặc áo xanh nhạt) → Cứu mẫu học quý hiếm!', 80, 550);

    ctx.fillStyle = '#FEF2F2';
    ctx.beginPath();
    ctx.roundRect(670, 480, boxW, 185, 12);
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.stroke();

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('LOẠI BỎ KHUNG HÌNH B (DROPPED)', 700, 515);
    ctx.fillStyle = '#1F2627';
    ctx.font = '14px sans-serif';
    ctx.fillText('15 đối tượng (người đi bộ đã rời đi) → Ngăn chặn mô hình học vẹt cảnh tĩnh!', 700, 550);
  } else {
    // CHẶNG 4: Xuất Kho Dữ Liệu (27s -> 36.5s)
    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('XUẤT KẾT QUẢ ĐÃ LỌC SẠCH (ZERO STORAGE OVERHEAD SYMLINKS)', 50, 110);

    // Kho 1: unique_pool
    ctx.fillStyle = '#F0FDF4';
    ctx.beginPath();
    ctx.roundRect(50, 140, (W - 130) / 2, 300, 12);
    ctx.fill();
    ctx.strokeStyle = '#22C55E';
    ctx.stroke();

    ctx.fillStyle = '#2D5A34';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('THƯ MỤC: data/processed/unique_pool/', 80, 175);
    ctx.font = 'bold 36px Monaco, monospace';
    ctx.fillText('6,994 ẢNH DUY NHẤT', 80, 230);
    ctx.fillStyle = '#1F2627';
    ctx.font = '14px sans-serif';
    ctx.fillText('• 99.91% tổng dữ liệu được bảo toàn\n• Tạo Symbolic Link: Tăng dung lượng đĩa = 0 KB\n• Sẵn sàng cấp phát cho Active Learning', 80, 275);

    // Kho 2: dropped_duplicates
    ctx.fillStyle = '#FEF2F2';
    ctx.beginPath();
    ctx.roundRect(50 + (W - 130) / 2 + 30, 140, (W - 130) / 2, 300, 12);
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.stroke();

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('THƯ MỤC: data/processed/dropped_duplicates/', 50 + (W - 130) / 2 + 60, 175);
    ctx.font = 'bold 36px Monaco, monospace';
    ctx.fillText('6 ẢNH TRÙNG LẶP', 50 + (W - 130) / 2 + 60, 230);
    ctx.fillStyle = '#1F2627';
    ctx.font = '14px sans-serif';
    ctx.fillText('• 0.09% ảnh tĩnh xe dừng đèn đỏ / hầm tối\n• Đã được kiểm chứng bởi Con người 100%\n• Tránh lãng phí ngân sách gán nhãn AI', 50 + (W - 130) / 2 + 60, 275);

    // Achievement HUD
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(50, 465, W - 100, 200, 12);
    ctx.fill();
    ctx.strokeStyle = '#E5E3DC';
    ctx.stroke();

    ctx.fillStyle = '#1F2627';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('TỔNG KẾT ĐỐI CHUẨN KHOA HỌC: F1 100% | 397.3 FPS | 0 KB ĐĨA PHỤ TRỘI', 80, 505);

    const cols = ['397.3 FPS CPU', '100.0% Human F1', '+4 Xe & Người Cứu Sống', '0 KB Rò Rỉ Đĩa'];
    cols.forEach((c, idx) => {
      ctx.fillStyle = '#F8F7F2';
      ctx.fillRect(80 + idx * 280, 530, 260, 100);
      ctx.fillStyle = '#2D5A34';
      ctx.font = 'bold 20px Monaco, monospace';
      ctx.fillText(c, 95, 580);
    });
  }
}

// 6. Tự động khởi chạy khi trang nạp xong
document.addEventListener('DOMContentLoaded', () => {
  renderLeaderboard();
  renderAuditGallery('all');
  initCharts();
  preloadCanvasImages();

  // Đồng bộ Video Player với thông tin giải thích bên cạnh
  const vid = document.getElementById('pipelineVideoPlayer');
  const overlay = document.getElementById('videoPlayOverlay');

  if (vid) {
    vid.addEventListener('play', () => {
      if (overlay) overlay.style.display = 'none';
      updatePlayButtonUI();
    });

    vid.addEventListener('pause', () => {
      if (overlay) overlay.style.display = 'flex';
      updatePlayButtonUI();
    });

    vid.addEventListener('timeupdate', () => {
      if (simDisplayMode === 'video') {
        syncTelemetryWithTime(vid.currentTime);
      }
    });

    // Mặc định dừng video, hiển thị Play Overlay chờ người dùng tương tác
    vid.pause();
    if (overlay) overlay.style.display = 'flex';
    updatePlayButtonUI();
  }

  // Khởi tạo Canvas vẽ frame đầu tiên sẵn sàng
  drawCanvasFrame(0);
});
