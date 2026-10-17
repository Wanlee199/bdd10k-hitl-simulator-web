# Bảng Đánh Giá Độ Bền Vững Trên 4 Lát Cắt Khó & Vector Điều Phối W_i

Đánh giá độc lập trên Frozen Gold Test (`fixed_test`, 1.400 ảnh) theo 4 lát cắt khó nhằm định lượng tỷ lệ bỏ sót (Recall Gap) và sinh Vector trọng số điều phối Active Learning ($W_i$) cho Phase 05.

| Lát Cắt Khó | Thuộc Tính Môi Trường / Đối Tượng | Số Lượng Ảnh | Precision (%) | Recall (%) | mAP@50 (%) | mAP@50-95 (%) | Tỷ Lệ Lỗi (Error Gap) | Trọng Số Điều Phối ($W_i$) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Night** | Ban đêm, thiếu sáng, lóa đèn pha đối diện | 468 | 26.95% | 21.85% | 20.39% | 9.82% | 78.15% | **0.2493** |
| **Small Object** | Vật thể nhỏ ($< 32^2$ pixels, người đi bộ xa) | 1,353 | 28.94% | 21.33% | 19.26% | 9.61% | 78.67% | **0.2509** |
| **Occlusion** | Bị che khuất một phần ($> 30\%$ diện tích) | 1,349 | 29.24% | 21.51% | 19.41% | 9.74% | 78.49% | **0.2504** |
| **Day (Baseline)** | Ban ngày, ánh sáng lý tưởng (Lát cắt đối chứng) | 814 | 29.65% | 21.79% | 19.53% | 9.97% | 78.21% | **0.2494** |
| **Tổng / Trung bình** | **Đánh giá toàn diện trên 1.400 ảnh Test** | **1,400** | **28.70%** | **21.62%** | **19.65%** | **9.79%** | **78.38%** | **1.0000** |

### Công Thức Toán Học Điều Phối:
$$W_s = \frac{100 - \text{Recall}_s}{\sum_{j} (100 - \text{Recall}_j)}, \quad \sum_{s} W_s = 1.0$$

*Ý nghĩa*: Lát cắt **Small Object** có tỷ lệ bỏ sót cao nhất (Recall 21.33%, Error Gap 78.67%), nhận trọng số lớn nhất ($W_{\text{small}} = 0.2509$), tiếp theo là **Occlusion** ($W_{\text{occ}} = 0.2504$). Vector $W_i$ này đóng vai trò tham số tiên nghiệm bắt buộc để Phase 05 thực hiện Active Mining phân tầng.
