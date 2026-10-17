# BẢNG TỔNG KẾT KIỂM TOÁN RÒ RỈ DỮ LIỆU KÉP 4 CHIỀU (ANTI-LEAKAGE DUAL AUDIT)

> **Trạng thái kiểm toán tổng thể**: `PASS` | Thời gian quét: `4.93s`
> Tổng số cặp quét chéo pHash nhị phân 64-bit: **13.454.400 cặp**.

| Tiêu Chí Kiểm Toán | Định Nghĩa An Toàn | Kết Quả Thực Đo | Ngưỡng Cho Phép | Kết Luận |
|---|---|:---:|:---:|:---:|
| **1. Video Sequence Overlap** | Không trùng video_id giữa 6 cặp phân tách | **0 Video Overlap** | Overlap == 0 | ✅ TUYỆT ĐỐI KHÔNG RÒ RỈ |
| **2. Test vs Val Min HD** | Khoảng cách Hamming nhỏ nhất giữa Test & Val | **HD = 10.0 bit** | HD >= 5 bit | ✅ AN TOÀN TUYỆT ĐỐI |
| **3. Test vs Seed Min HD** | Khoảng cách Hamming nhỏ nhất giữa Test & Seed V0 | **HD = 10.0 bit** | HD >= 5 bit | ✅ AN TOÀN TUYỆT ĐỐI |
| **4. Test vs Pool Min HD** | Khoảng cách Hamming nhỏ nhất giữa Test & Pool | **HD = 6.0 bit** | HD >= 5 bit | ✅ AN TOÀN TUYỆT ĐỐI |
| **5. Val vs Pool Min HD** | Khoảng cách Hamming nhỏ nhất giữa Val & Pool | **HD = 6.0 bit** | HD >= 5 bit | ✅ AN TOÀN TUYỆT ĐỐI |
| **6. Seed vs Pool Min HD** | Khoảng cách Hamming nhỏ nhất giữa Seed & Pool | **HD = 8.0 bit** | HD >= 5 bit | ✅ AN TOÀN TUYỆT ĐỐI |
| **7. Tổng Số Cặp Vi Phạm HD < 5** | Số cặp ảnh gần trùng bị lọt qua các tập | **0 Cặp Vi Phạm** | Vi phạm == 0 | ✅ ZERO LEAKAGE CONFIRMED |
| **8. Bảo Toàn Lớp Giao Thông** | Số lớp BDD10K xuất hiện trong tập Test | **10 / 10 Lớp** | 10 / 10 Lớp | ✅ ĐẦY ĐỦ 100% |
