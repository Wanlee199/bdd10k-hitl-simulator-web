### 📊 Bảng Đối Chuẩn: Phase 02 Paper Ready Summary Table

| Lát Cắt / Bài Toán       | Thuật Toán Đối Chuẩn        | Loại Ground-Truth                   | Accuracy   | Precision   | Recall   | F1-Score   | Đóng Góp Khoa Học                                            |
|:-------------------------|:----------------------------|:------------------------------------|:-----------|:------------|:---------|:-----------|:-------------------------------------------------------------|
| 1. Ban Đêm (Night)       | 🏆 Hybrid Ensemble          | BDD10K timeofday (Human)            | 97.65%     | 97.78%      | 96.47%   | 97.12%     | Khử triệt để đèn pha xe đối diện bằng YCbCr + Retinex        |
| 2. Độ Mờ (Controlled)    | 🏆 Dual-Domain Ensemble     | Controlled Perturbation (300 ảnh)   | 97.33%     | 96.15%      | 100.0%   | 98.04%     | Không gian Tenengrad + Tần số 2D-FFT bắt vệt rung lắc        |
| 2b. Độ Mờ Thực Tế (HITL) | 🏆 Dual-Domain Ensemble     | Human Verification Audit (100 ảnh)  | 100.0%     | 100.0%      | 100.0%   | 100.0%     | Xác nhận thực nghiệm trên camera xe thực tế                  |
| 3. Thời Tiết Suy Giảm    | 🏆 C5 Multi-Domain Ensemble | BDD10K weather (Human)              | 41.05%     | 14.65%      | 76.19%   | 24.57%     | Clear Day Guard dập tắt báo động giả bầu trời sáng           |
| 4. Che Khuất Xe Cộ       | 🏆 Directed Occlusion Graph | BDD10K occluded: true (UC Berkeley) | 89.15%     | 96.47%      | 91.27%   | 93.8%      | Bắt trọn chuỗi kẹt xe nối đuôi, vượt Naive Overlap +36.0% F1 |
