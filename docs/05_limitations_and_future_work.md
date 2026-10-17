# 05. Hạn Chế & Hướng Phát Triển (Limitations and Future Work)

## 1. Các Giả Định & Ranh Giới Nghiên Cứu (Assumptions and Scope Boundaries)
- Nghiên cứu tập trung chủ yếu vào tác vụ **2D Bounding Box Object Detection** trên ảnh đơn lẻ (monocular camera).
- Các thực nghiệm đối chuẩn hiện tại sử dụng kiến trúc mô hình **YOLOv11n** để cân bằng giữa tốc độ huấn luyện/suy luận và độ chính xác thực nghiệm.
- Ngân sách và thời gian gán nhãn được ước lượng dựa trên các mốc tiêu chuẩn công nghiệp và các phiên thử nghiệm định mức thực tế.

---

## 2. Hạn Chế Kỹ Thuật Hiện Tại (Current Technical Limitations)
1. **Lọc trùng dựa trên pHash**: Mặc dù pHash kết hợp KMV đạt thông lượng cực cao trên CPU, phương pháp này chủ yếu bắt các cặp khung hình gần kề theo thời gian trong cùng video sequence; khả năng phát hiện trùng lặp ngữ nghĩa sâu trên toàn bộ kho dữ liệu lớn vẫn cần thêm embedding học sâu.
2. **Số lượng thuộc tính quang học**: Bộ hồ sơ 5D (ánh sáng, mờ nhòe, thời tiết, che khuất, mật độ) đã bao quát các lát cắt chính nhưng chưa xử lý chuyên sâu các hiện tượng đặc thù như chói nắng cục bộ (glare) hay mưa đọng giọt trên ống kính.
3. **Mô hình định lượng bất định (Uncertainty Estimation)**: Hiện đang dựa trên Entropy của phân bố xác suất đầu ra và độ tự tin dự đoán; chưa tích hợp các kỹ thuật Bayesian Deep Learning hoặc Monte Carlo Dropout do hạn chế về chi phí tính toán khi huấn luyện lại.
4. **`TBD — Các hạn chế phát sinh khác từ quá trình phân tích số liệu thực tế.`**

---

## 3. Hướng Nghiên Cứu & Phát Triển Tương Lai (Future Work)
- **Mở rộng sang hệ thống đa camera (Multi-Camera & 3D Bounding Box)**: Áp dụng Active Learning cho dữ liệu không gian 3D và chuỗi video hành trình liên tục (temporal consistency).
- **Tích hợp Foundation Models (SAM, CLIP, VLM)**: Ứng dụng mô hình nền tảng thị giác để hỗ trợ gán nhãn tự động cấp độ điểm ảnh và tăng cường khả năng định tuyến đồng thuận.
- **Tự động hóa toàn diện với Reinforcement Learning**: Sử dụng học tăng cường để tự động điều chỉnh siêu tham số khai phá mẫu và trọng số cân bằng lớp $C_w$ qua từng vòng lặp.
- **Tối ưu hóa suy luận thời gian thực trên thiết bị biên**: Lượng tử hóa sau huấn luyện (Post-Training Quantization - INT8) với TensorRT trên nền tảng phần cứng nhúng ô tô (NVIDIA DRIVE / Jetson Orin).

---

## 4. Liên Kết Tài Liệu Liên Quan
- [Tổng Quan Dự Án](01_project_overview.md)
- [Tổng Hợp Kết Quả Thực Nghiệm](03_experiment_results.md)
- [Báo Cáo Từng Giai Đoạn](experiments/README.md)
