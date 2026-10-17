# Báo Cáo Thực Nghiệm 05: Khai Phá Chủ Động & Điều Hướng Đồng Thuận HITL (Active Mining)

> **Giai đoạn**: Phase 05 — Active Mining Tournament & Human-in-the-Loop Consensus Router  
> **Notebook tham chiếu**: `notebooks/05_active_mining_tournament_and_hitl.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Khai phá các mẫu ảnh giàu giá trị thông tin nhất từ kho Unlabeled Pool dựa trên mô hình hiện tại ($V_{k-1}$).
- Tổ chức giải đấu giữa các chiến lược khai phá mẫu (Active Mining Strategies) để tối đa hóa hiệu năng học tập của vòng lặp kế tiếp.
- Thiết lập bộ điều hướng đồng thuận hai tầng (**Consensus Router**) phân luồng giữa AI tự động gán nhãn (Tier 1) và chuyên gia con người thẩm định (Tier 2).

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ5.1*: Chiến lược tính điểm khai phá nào (Entropy bất định, Độ tương phản biên, Độ đa dạng cụm, hay Siêu dung hợp C6) mang lại mức tăng mAP cao nhất trên mỗi mẫu gán nhãn?
- *RQ5.2*: Làm thế nào để giải quyết mâu thuẫn giữa việc khai thác mẫu khó (Exploitation) và khám phá vùng dữ liệu mới chưa biết (Exploration)?
- *RQ5.3*: Ngưỡng phân luồng đồng thuận nào giữa AI và Chuyên gia con người giúp tiết kiệm tối đa thời gian mà vẫn đảm bảo độ chính xác nhãn mác tiệm cận 100%?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Checkpoint mô hình**: Mô hình vòng lặp trước ($V_{k-1}$) đã huấn luyện hoàn tất.
- **Tập dữ liệu khả dụng**: Kho Unlabeled Pool chứa các ảnh chưa gán nhãn kèm hồ sơ quang học 5D.
- **Ràng buộc ngân sách**: Mỗi đợt khai phá chỉ được chọn một lượng mẫu cố định theo quota vòng lặp.

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Chiến lược 1 (Baseline)**: Random Pool Sampling (Lấy mẫu ngẫu nhiên).
2. **Chiến lược 2**: Least Confidence Sampling (Lấy mẫu theo độ tự tin thấp nhất).
3. **Chiến lược 3**: Prediction Entropy Sampling (Độ hỗn loạn thông tin phân bố lớp).
4. **Chiến lược 4**: Diversity K-Means Clustering on Embeddings (Lấy mẫu đa dạng cụm).
5. **Chiến lược 5 (Đề xuất)**: **C6 Super-Fusion Active Mining**:
   - Kết hợp độ bất định mô hình, độ hiếm thuộc tính, điểm thâm hụt lớp và độ đa dạng đặc trưng không gian.

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- Chạy suy luận mô hình $V_{k-1}$ trên toàn bộ Unlabeled Pool để thu thập tensor dự đoán và vector đặc trưng.
- Áp dụng các thuật toán khai phá mẫu ứng viên để bốc ra các batch ứng viên tương ứng.
- Mô phỏng quy trình gán nhãn:
  - *Tier 1 Pre-labeling*: Tự động gán nhãn đối với các đối tượng có độ tự tin cao ($\ge \tau_{\text{high}}$).
  - *Tier 2 Human Verification*: Chuyển giao các ca xung đột, mẫu phân loại nhầm lẫn và đối tượng yếu thế cho chuyên gia thẩm định.
- `TBD — Ghi nhận thông số chi tiết của hàm tính điểm C6.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **Tác động tăng trưởng (&Delta; mAP)** sau khi bổ sung batch mới vào huấn luyện.
- **Tỷ lệ đóng góp thông tin mới**: Tỷ lệ phát hiện các đối tượng thuộc lớp hiếm trong batch khai phá.
- **Hiệu quả tiết kiệm thời gian (HITL Speedup)**: % thời gian gán nhãn giảm tải cho chuyên gia con người.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng so sánh mức tăng mAP giữa 5 chiến lược khai phá*: `TBD`
- *Phân bố các lớp đối tượng được tìm thấy trong batch khai phá C6*: `TBD`
- *Tỷ lệ phân luồng thực tế giữa Tier 1 và Tier 2 qua Consensus Router*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Chiến lược khai phá được chọn**: `TBD — Ghi nhận thuật toán quán quân.`
- **Lý do lựa chọn**:
  - `TBD — Phân tích cơ sở lý thuyết về khả năng cân bằng giữa mẫu bất định và mẫu đa dạng đại diện.`

---

## 9. Limitations — Hạn Chế
- Chi phí tính toán trích xuất vector đặc trưng trên tập pool lớn tăng theo quy mô dữ liệu.
- `TBD — Các trường hợp biên trong cơ chế đồng thuận HITL.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/05_active_mining_tournament_and_hitl.ipynb
  ```
- **Artifacts đầu ra**:
  - `data/batches/mined_batch_v{k}.json` (Danh sách ảnh và nhãn được chọn).
  - `results/phase_05/tables/` (Bảng so sánh đối chuẩn các chiến lược mining).

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: Model Retraining &rarr;](06_retraining.md)
