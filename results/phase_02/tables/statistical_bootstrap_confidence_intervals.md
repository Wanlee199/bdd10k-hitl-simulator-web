### 📊 Bảng Đối Chuẩn: Statistical Bootstrap Confidence Intervals

| Giải Đấu / Bài Toán        | Thuật Toán Thử Nghiệm          | F1-Score (95% CI)        | Precision (95% CI)       | Recall (95% CI)          |
|:---------------------------|:-------------------------------|:-------------------------|:-------------------------|:-------------------------|
| Che Khuất Tôpô (Human GT)  | Naive 2D Overlap (Baseline)    | 57.8% [55.4% - 60.0%]    | 99.3% [98.6% - 99.9%]    | 40.7% [38.4% - 43.0%]    |
| Che Khuất Tôpô (Human GT)  | Directed Occlusion Graph (DAG) | 93.8% [93.0% - 94.6%]    | 96.5% [95.5% - 97.3%]    | 91.3% [90.0% - 92.5%]    |
| Độ Mờ Mắt Người (Human GT) | laplacian                      | 100.0% [100.0% - 100.0%] | 100.0% [100.0% - 100.0%] | 100.0% [100.0% - 100.0%] |
| Độ Mờ Mắt Người (Human GT) | tenengrad                      | 60.7% [45.2% - 72.7%]    | 100.0% [100.0% - 100.0%] | 43.6% [29.2% - 57.2%]    |
| Độ Mờ Mắt Người (Human GT) | fft_frequency                  | 19.1% [6.5% - 31.2%]     | 33.3% [12.5% - 55.0%]    | 13.5% [4.3% - 23.6%]     |
| Độ Mờ Mắt Người (Human GT) | hybrid_ensemble                | 100.0% [100.0% - 100.0%] | 100.0% [100.0% - 100.0%] | 100.0% [100.0% - 100.0%] |
