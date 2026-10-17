# Báo Cáo Thực Nghiệm 01: Lọc Trùng Băm Tri Giác (Fast Deduplication)

> **Giai đoạn**: Phase 01 — Dual-Stream Fast Deduplication  
> **Notebook tham chiếu**: `notebooks/01_dual_stream_fastdedup_benchmark.ipynb`  
> **Trạng thái**: Khung sườn tài liệu (Skeleton) — Chờ cập nhật số liệu chi tiết.

---

## 1. Objective — Mục Tiêu
- Loại bỏ các khung hình trùng lặp gần kề trong cùng chuỗi video (video sequences) từ camera hành trình với tốc độ thông lượng cao trên CPU.
- Ngăn ngừa hiện tượng vứt nhầm các khung hình xuất hiện người đi bộ hoặc xe máy mới bước vào khung cảnh (Keep-Most-Vehicles).
- Thiết lập kho ảnh sạch duy nhất (**Unique Pool**) bằng liên kết tượng trưng (Symbolic Links) với chi phí đĩa phụ trội 0 KB.

---

## 2. Research Question — Câu Hỏi Nghiên Cứu
- *RQ1.1*: Thuật toán mã băm nhận thức (pHash, aHash, dHash, wHash) nào cho độ phân giải tốt nhất và khả năng kháng nhiễu quang học cao nhất trên chuỗi khung hình camera hành trình?
- *RQ1.2*: Ngưỡng khoảng cách Hamming nào phân định ranh giới tối ưu giữa "trùng lặp cảnh tĩnh" và "chuyển động xe thực tế"?
- *RQ1.3*: Làm thế nào để cơ chế chọn lọc khung hình giữ lại (Selection Policy) không loại bỏ oan các đối tượng yếu thế xuất hiện muộn?

---

## 3. Inputs and Preconditions — Đầu Vào và Điều Kiện Tiên Quyết
- **Tập dữ liệu đầu vào**: Khối lượng khung hình thô trích xuất từ BDD10K Raw Video Sequences.
- **Điều kiện phần cứng**: Kiểm thử thông lượng trên CPU đa nhân tiêu chuẩn (không yêu cầu GPU).
- **Trạng thái tiền đề**: `TBD — Ghi nhận đường dẫn thư mục dữ liệu gốc và số lượng frame nạp vào.`

---

## 4. Candidate Methods — Các Phương Pháp Đã Thực Nghiệm
1. **Phương pháp 1 (Baseline)**: Average Hash (aHash) + Keep-First (giữ khung hình xuất hiện trước).
2. **Phương pháp 2**: Perceptual Hash (pHash qua DCT 32x32 &rarr; 8x8) + Random-Drop.
3. **Phương pháp 3**: Deep Embedding Feature (ResNet50 Cosine Similarity > 0.95).
4. **Phương pháp 4 (Đề xuất)**: **Dual-Stream pHash + Keep-Most-Vehicles (KMV)** ưu tiên bảo tồn đối tượng yếu thế.

---

## 5. Experimental Protocol — Thiết Lập và Quy Trình Thực Nghiệm
- **Kích thước ảnh quét**: Co tỷ lệ ảnh về kích thước chuẩn trước khi áp dụng DCT 2D.
- **Quét theo chuỗi (Sequence-constrained scan)**: Giới hạn quét khoảng cách Hamming giữa các khung hình thuộc cùng mã chuỗi video `video_name`.
- **Thông số đo lường**: Thời gian xử lý từng frame, mức chiếm dụng RAM, và số lượng cặp phát hiện trùng lặp.
- **Trạng thái**: `TBD — Mô tả chi tiết các bước thiết lập trong notebook 01.`

---

## 6. Metrics — Các Chỉ Số Đánh Giá
- **Tốc độ thông lượng (Throughput)**: Frames Per Second (FPS) đo trên CPU.
- **Tỷ lệ lọc trùng (Deduplication Rate)**: Tỷ lệ % khung hình bị loại bỏ khỏi pool.
- **Độ bảo toàn đối tượng (Object Preservation Recall)**: Tỷ lệ bảo toàn các hộp nhãn người đi bộ và xe máy không bị xóa nhầm.
- **Dung lượng phụ trội (Disk Overhead)**: Kích thước tệp sinh ra khi materialize kho dữ liệu sạch.

---

## 7. Results — Kết Quả Thực Tế
- *Bảng tổng hợp đối chuẩn thông lượng & độ chính xác giữa các phương pháp*: `TBD`
- *Số lượng khung hình trùng lặp thực tế phát hiện được*: `TBD`
- *Số lượng khung hình duy nhất đưa vào Unique Pool*: `TBD`

---

## 8. Decision and Rationale — Phương Án Được Chọn và Lý Do
- **Phương án được chọn**: `TBD — Ghi nhận phương án chiến thắng và cơ sở kỹ thuật lựa chọn.`
- **Lý do lựa chọn**:
  - `TBD — Đánh giá về tương quan giữa tốc độ FPS và độ an toàn đối với đối tượng yếu thế.`

---

## 9. Limitations — Hạn Chế
- Chưa giải quyết triệt để trùng lặp ngữ nghĩa giữa các xe khác nhau di chuyển qua cùng một ngã tư ở các thời điểm khác nhau.
- `TBD — Các hạn chế kỹ thuật khác được ghi nhận trong quá trình chạy thực nghiệm.`

---

## 10. Reproducibility and Artifacts — Khả Năng Tái Lập và Sản Phẩm Đầu Ra
- **Lệnh thực thi**:
  ```bash
  python -m jupyter nbconvert --to notebook --execute notebooks/01_dual_stream_fastdedup_benchmark.ipynb
  ```
- **Artifacts đầu ra**:
  - `data/processed/unique_pool/` (Thư mục chứa symlinks đến ảnh sạch).
  - `results/phase_01/tables/dedup_benchmark_summary.json` (Bảng chỉ số đối chuẩn).

---
[Quay lại Mục Lục Thực Nghiệm](README.md) | [Giai Đoạn Kế Tiếp: Data Profiling &rarr;](02_data_profiling.md)
