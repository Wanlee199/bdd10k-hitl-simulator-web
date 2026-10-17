# Tổng Quan Dự Án: BDD10K Active Learning Lab

> **Mã tài liệu**: `docs/01_project_overview.md`  
> **Dự án**: BDD10K Active Learning Lab (Hệ Thống Tự Động Hóa Dữ Liệu Thị Giác Xe Tự Hành HITL)  
> **Nguồn thực nghiệm gốc**: `/Users/huynh/orca/workspaces/BuildPhase/tang`  
> **Đối tượng độc giả**: Nhà nghiên cứu, Kỹ sư Thị giác máy tính (CV) và Kiến trúc sư MLOps  
> **Tác giả / Nhóm nghiên cứu**: T018  
> **Trạng thái**: Bản tài liệu hoàn chỉnh / Đồng bộ 100% với số liệu thực nghiệm  

---

## 1. Tổng Quan Dự Án (Project Overview)

### 1.1 Tên Dự Án
**BDD10K Active Learning Lab: Hệ thống Tự động hóa Vòng lặp Dữ liệu Học tập Chủ động (Human-in-the-Loop) cho Thị giác Xe Tự Hành**

### 1.2 Tóm Tắt Định Hướng
**BDD10K Active Learning Lab** là một khuôn khổ nghiên cứu và kỹ thuật thực nghiệm toàn trình nhằm giải quyết triệt để **nghịch lý dữ liệu lớn (Big Data Paradox)** trong ngành công nghiệp xe tự hành: Các đội xe thương mại trang bị camera hành trình (Dashcam) thu thập hàng triệu khung hình video mỗi ngày. Tuy nhiên, hơn **80% đến 85%** khối lượng khung hình này là cảnh tượng dư thừa, lặp lại (dừng đèn đỏ, kẹt xe, đường cao tốc tĩnh dưới trời nắng). Ngược lại, các tình huống nguy hiểm sống còn ở "đuôi dài" (Long-Tail Edge Cases)—như người đi bộ ban đêm, xe máy trong điểm mù, sương mù dày đặc và các trường hợp bị che khuất nghiêm trọng—chỉ chiếm chưa đầy **1% đến 3%** tổng dữ liệu.

Dự án nghiên cứu và kiểm chứng một hệ sinh thái **Học tập Chủ động (Active Learning - AL)** theo định hướng **Data-Centric AI** trên tập dữ liệu chuẩn BDD10K (Berkeley DeepDrive). Thay vì gán nhãn dàn trải ngẫu nhiên (Uniform Random), hệ thống tích hợp:
1. **Lọc trùng băm tri giác tại cạnh biên (Dual-Stream FastDedup)**: Đạt thông lượng $>360$ FPS trên CPU đơn nhân nhờ biến đổi Cosine rời rạc 2 chiều (2D-DCT pHash) kết hợp cơ chế giải cứu đối tượng yếu thế **Keep-Most-Vehicles (KMV)**;
2. **Hồ sơ hóa thuộc tính vật lý không giám sát (Multi-Domain Profiling 5D)**: Tự động phân loại độ sáng ban đêm, độ sắc nét/rung mờ Tenengrad, độ suy thoái thời tiết và phân cấp che khuất hình học bằng đồ thị có hướng DAG mà không cần đọc nhãn người gán;
3. **Phân chia dữ liệu cách ly chuỗi video (Stratified Video-Isolated Splitting)**: Áp dụng thuật toán tối ưu hóa đa mục tiêu **Hybrid Mix 80/20** (kết hợp Submodular Facility Location và Gonzalez Minimax $k$-Center), thiết lập tập kiểm thử độc lập đóng băng với **Zero Data Leakage** tuyệt đối;
4. **Động cơ khai phá chủ động C6 Super-Fusion & Định tuyến đồng thuận HITL**: Chấm điểm mẫu dựa trên độ bất định mô hình, khoảng cách làn đường và vector trọng số thâm hụt lớp động ($C_w$), kết hợp cơ chế **Quality-Gated Pre-labeling** duy trì nguyên tắc **100% Zero Label Noise**;
5. **Tái huấn luyện thích ứng liên tục**: Huấn luyện kế thừa trọng số (Warm-Start) với tập mỏ neo tích lũy và **Bộ cân bằng thâm hụt lớp động ($C_w$ Equalizer)** nhằm triệt tiêu hiện tượng quên tri thức (Catastrophic Forgetting) và vượt qua rào cản hình phạt trung bình vĩ mô (Macro-Average Penalty) trên các lớp hiếm.

### 1.3 Bài Toán Nghiên Cứu Cốt Lõi
Làm thế nào để một hệ thống thị giác xe tự hành có thể tự động nhận diện, sàng lọc, kiểm duyệt và tích hợp các khung hình giàu giá trị thông tin nhất từ kho video thô khổng lồ, nhằm tối đa hóa độ chính xác nhận diện ($\text{mAP}@50$) trên các lát cắt nguy hiểm với chi phí gán nhãn thủ công tối thiểu?

### 1.4 Hướng Tiếp Cận Tổng Quát
Dự án kiên định theo đuổi triết lý **Data-Centric AI**: Tập trung nâng cao chất lượng thông tin, độ đa dạng không gian và tính cân bằng phân bố của dữ liệu đưa vào huấn luyện thay vì chỉ thử nghiệm các kiến trúc mô hình một cách thụ động. Mọi thuật toán trong từng mắt xích đều phải trải qua các **Giải đấu Thực nghiệm Đối đầu (Ablation Tournaments)** có kiểm soát trước khi được chọn làm chuẩn xuất bản.

---

## 2. Bối Cảnh và Động Lực Nghiên Cứu (Background and Motivation)

### 2.1 Nhận Diện Vật Thể Trong Dữ Liệu Giao Thông Thực Tế
Nhiệm vụ nhận diện vật thể 2D (Bounding Box Detection) là nền tảng cốt tử cho các tính năng an toàn từ cấp độ L2+ đến L4. Bộ dữ liệu BDD10K [Yu et al., 2020] là một trong những chuẩn đánh giá khắt khe nhất hiện nay với 10 danh mục đối tượng giao thông di chuyển trong điều kiện thời tiết, địa lý và ánh sáng vô cùng phức tạp.

### 2.2 Chi Phí và Công Sức Gán Nhãn Thủ Công
Trong bài toán Object Detection trên ảnh độ phân giải cao ($1280 \times 720$):
- Mỗi khung hình BDD10K chứa trung bình từ **12 đến 18 bounding boxes**.
- Đơn giá gán nhãn chuẩn công nghiệp dao động từ **$0.15 đến $0.30 USD cho mỗi bounding box** chất lượng cao (gồm tọa độ chuẩn xác, cờ che khuất `occluded` và cờ cắt xén `truncated`).
- Chi phí gán nhãn trung bình lên tới xấp xỉ **$3.00 USD / ảnh** ($15 \text{ boxes} \times \$0.20 \text{ USD}$).
- Đối với một quy mô đội xe thu thập hàng triệu ảnh mỗi năm, việc gán nhãn đại trà là bất khả thi về mặt tài chính và gây lãng phí nghiêm trọng nguồn lực chuyên gia.

### 2.3 Hạn Chế Của Cách Tiếp Cận Ngẫu Nhiên và Thiên Vị "Mẫu Dễ"
Phương pháp huấn luyện truyền thống thường lấy mẫu ngẫu nhiên đồng đều (Uniform Random Sampling) từ kho dữ liệu thu thập được. Cách làm này dẫn tới hai hệ lụy nghiêm trọng:
1. **Lạm phát dữ liệu dư thừa**: Mô hình học vẹt (overfit) trên các cảnh ban ngày râm mát, xe con chạy thẳng, tiêu tốn tài nguyên tính toán vào các gradient có giá trị thông tin tiệm cận 0.
2. **Sụp đổ trên lát cắt đuôi dài (Tail Collapse)**: Các đối tượng hiếm gặp nhưng có nguy cơ va chạm chết người (xe lửa `train`, người điều khiển xe máy `rider`, xe gắn máy `motorcycle`) và các điều kiện thời tiết khắc nghiệt gần như không xuất hiện đủ trong tập huấn luyện ngẫu nhiên.

### 2.4 Vai Trò Của Active Learning và Data-Centric AI
Kỹ thuật Học tập Chủ động (Active Learning) [Settles, 2009] biến bài toán xây dựng dữ liệu thành một quá trình tối ưu hóa lặp: Hệ thống tự đánh giá mức độ thiếu hụt tri thức của mô hình hiện tại để truy vấn chuyên gia con người (Oracle) gán nhãn đúng những mẫu có giá trị thông tin cao nhất. Kết hợp với tư duy Data-Centric AI, dự án chứng minh bằng thực nghiệm rằng: **Dữ liệu ít hơn nhưng thông tin cô đặc hơn sẽ đánh bại dữ liệu khổng lồ nhưng loãng thông tin.**

### 2.5 Tính Cấp Thiết Của Một Quy Trình Pipeline Chuẩn Mực
Để ứng dụng thành công Active Learning vào xe tự hành, không thể chỉ dùng các công thức tính điểm đơn lẻ trên lý thuyết, mà bắt buộc phải giải quyết toàn diện các bài toán kỹ thuật hạ tầng:
- Thuật toán lọc trùng phải chạy cực nhanh trên CPU ngay tại biên xe tự hành mà không được vứt nhầm người đi bộ.
- Phải ngăn chặn tuyệt đối hiện tượng rò rỉ dữ liệu giữa tập huấn luyện và tập kiểm thử.
- Phải có cơ chế kiểm soát chất lượng nhãn (Quality Gate) để chống suy thoái mô hình do nhãn giả (Pseudo-label Noise).
- Phải bảo toàn tri thức cũ qua từng chu kỳ huấn luyện tiếp sức.

---

## 3. Định Nghĩa Bài Toán Nghiên Cứu (Problem Statement)

### 3.1 Mô Hình Hóa Toán Học
Cho $\mathcal{U} = \{x_1, x_2, \dots, x_N\}$ là kho dữ liệu khung hình dashcam chưa gán nhãn thu thập từ tập hợp các chuỗi video $\mathcal{V}$. Gọi $\mathcal{Y}$ là không gian nhãn bounding box $b = (x, y, w, h, c)$ trên $C = 10$ lớp giao thông.

Với tổng ngân sách gán nhãn giới hạn $B \ll N$ được phân bổ qua $K$ vòng lặp liên hoàn $\{B_1, B_2, \dots, B_K\}$, mục tiêu là tìm chuỗi chính sách khai phá mẫu $\pi_k: \mathcal{U}_k \to \mathcal{S}_k \subset \mathcal{U}_k$ với $|\mathcal{S}_k| = B_k$, sao cho mô hình thị giác $f_{\theta_k}$ được huấn luyện trên tập tích lũy $\mathcal{D}_k = \mathcal{D}_{k-1} \cup \mathcal{S}_k$ tối đa hóa độ chính xác trung bình vĩ mô ($\text{mAP}@50$) trên tập kiểm thử độc lập đóng băng vĩnh viễn $\mathcal{D}_{\text{test}}$:

$$\max_{\{\pi_1, \dots, \pi_K\}} \text{mAP}@50(f_{\theta_K}; \mathcal{D}_{\text{test}}) \quad \text{với ràng buộc} \quad \sum_{k=1}^K |\mathcal{S}_k| \le B$$

### 3.2 Đầu Vào và Đầu Ra Của Hệ Thống
- **Đầu vào (Inputs)**:
  1. Dữ liệu video dashcam thô BDD10K (10.000 khung hình từ 598 chuỗi video hành trình).
  2. Nguồn nhãn chuyên gia Oracle (chỉ được tra cứu đối với các batch được hệ thống Active chọn ra).
  3. Trọng số mô hình nền tảng khởi tạo (`yolo11n.pt`, 2.6M tham số).
- **Đầu ra (Outputs)**:
  1. Chuỗi checkpoint mô hình tối ưu qua từng vòng ($f_{\theta_0}, \dots, f_{\theta_5}$).
  2. Tập kiểm thử độc lập đóng băng vĩnh viễn ($\mathcal{D}_{\text{test}}$, 1.400 ảnh) và tập kiểm định cố định ($\mathcal{D}_{\text{val}}$, 700 ảnh).
  3. Hệ thống tệp kê khai dữ liệu và kết quả thực nghiệm có chữ ký bảo mật SHA-256 (`manifest.json`).
  4. Mô hình xuất bản tối ưu hóa cho thiết bị biên (ONNX / INT8 engine).

### 3.3 Những Khó Khăn Cốt Lõi Cần Giải Quyết
1. **Trùng lặp tri giác không gian (Perceptual Redundancy)**: Các khung hình kề nhau trong video có cấu trúc nền giống hệt nhau nhưng có thể xuất hiện vật thể mới ở góc quay.
2. **Khởi đầu lạnh (Cold-Start Bias)**: Tập mầm ban đầu nếu bốc ngẫu nhiên sẽ thừa xe con và thiếu trắng các lớp hiếm.
3. **Rò rỉ dữ liệu vô hình (Visual Data Leakage)**: Hai khung hình thuộc cùng một video sequence xuất hiện ở cả tập Train và tập Test sẽ làm sai lệch hoàn toàn kết quả đối chuẩn.
4. **Hình phạt trung bình vĩ mô (Macro-Average Penalty)**: Vì $\text{mAP}_{\text{macro}}$ chia đều trọng số cho 10 lớp, nên việc tăng mạnh lớp xe con (`car`) không thể bù đắp cho điểm 0% của lớp xe lửa (`train`).
5. **Hiện tượng thiên lệch xác nhận (Confirmation Bias)**: Tự động gán nhãn máy (Pseudo-labels) thiếu kiểm soát sẽ đưa box sai vào huấn luyện, làm suy thoái mô hình ở các vòng sau.

### 3.4 Giả Định và Giới Hạn Nghiên Cứu
- **Cấu hình cảm biến**: Camera đơn (Monocular Dashcam) góc nhìn phía trước ($1280 \times 720$).
- **Hệ thống phân loại**: Cố định đúng 10 danh mục chuẩn của BDD10K.
- **Tính chuẩn xác của Oracle**: Giả định chuyên gia con người thẩm định ở Tier 2 cung cấp nhãn vàng sạch 100% (Nguyên tắc Zero Label Noise).
- **Kiến trúc mô hình**: Tập trung vào kiến trúc mạng nơ-ron tích chập thời gian thực (Ultralytics YOLOv11n).

---

## 4. Mục Tiêu Nghiên Cứu Cụ Thể (Research Objectives)

Dự án xác lập 8 mục tiêu kỹ thuật định lượng có thể kiểm chứng bằng thực nghiệm:

1. **Lọc trùng cạnh biên thông lượng siêu cao**: Xây dựng thuật toán lọc trùng đạt tốc độ $>350$ FPS trên CPU đơn nhân, phát hiện chính xác $\ge 99.0\%$ khung hình trùng lặp mà không xóa nhầm bất kỳ khung hình nào có người đi bộ hoặc xe máy mới xuất hiện.
2. **Lập hồ sơ quang học 5D không giám sát**: Thiết kế bộ trích xuất đặc trưng vật lý không dùng nhãn đạt F1-Score $\ge 90.0\%$ trong việc phân định các lát cắt môi trường khắc nghiệt.
3. **Phân chia dữ liệu chứng minh 0% rò rỉ**: Thiết lập quy trình phân cụm theo chuỗi video đạt 0 vi phạm video overlap và 0 cặp ảnh có khoảng cách pHash $D_H < 5$ giữa tập Test và Pool.
4. **Khởi tạo tập mầm cân bằng tối ưu**: Chứng minh thuật toán phân tầng Hybrid Mix 80/20 đạt điểm số bao phủ ($R_{\text{cov}}$) và dàn đều ($F_{\text{loc}}$) vượt trội so với phân chia ngẫu nhiên.
5. **Khai phá chủ động đa tiêu chí (C6 Super-Fusion)**: Chứng minh phương pháp đề xuất vượt trội hơn hẳn các phương pháp Entropy đơn lẻ và Random Baseline từ $\ge 3.0\% \text{ mAP}@50$.
6. **Bù đắp thâm hụt lớp hiếm**: Thiết kế cơ chế cân bằng trọng số động $C_w$ giúp vực dậy các lớp điểm liệt (nâng `train` từ $0.0\%$ lên $>10.0\% \text{ mAP}@50$) mà không làm giảm hiệu năng của lớp phổ biến.
7. **Đánh bại trần dữ liệu toàn phần**: Chứng minh thực nghiệm rằng mô hình Active Learning chỉ cần sử dụng $\le 65\%$ dữ liệu pool để đạt hoặc vượt trần hiệu năng của mô hình học trên $100\%$ dữ liệu ngẫu nhiên.
8. **Đo lường hiệu quả kinh tế định lượng (ROI)**: Xây dựng bài toán kinh tế chứng minh hệ thống cắt giảm thực tế $\ge 35\%$ ngân sách gán nhãn và rút ngắn $50\%$ thời gian bàn giao dữ liệu.

---

## 5. Các Câu Hỏi Nghiên Cứu (Research Questions)

| Mã RQ | Câu Hỏi Nghiên Cứu Cốt Lõi | Tiêu Chí / Biến Đo Lường So Sánh | Nguồn Bằng Chứng Thực Nghiệm | Trạng Thái Xác Minh |
| :--- | :--- | :--- | :--- | :---: |
| **RQ1** | Thuật toán băm tri giác kết hợp KMV có thể đạt thông lượng CPU $>300$ FPS và vượt trội mô hình Deep Feature (ResNet50) trong việc bảo vệ đối tượng yếu thế không? | Thông lượng (FPS), Độ trễ (ms), Tỷ lệ bảo tồn người đi bộ và xe máy | `notebooks/01_dual_stream_fastdedup_benchmark.ipynb`, `results/phase_01/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ2** | Các chỉ số quang học kinh điển (YCbCr P50, Tenengrad, Dark Channel Prior) có phân loại chính xác các lát cắt khó mà không cần mạng học sâu không? | F1-Score, Precision, Recall so với siêu dữ liệu gốc BDD10K | `notebooks/02_automated_data_profiling_benchmark.ipynb`, `results/phase_02/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ3** | Thuật toán Hybrid Mix 80/20 có đạt điểm CBS tổng hợp và độ bao phủ không gian đặc trưng cao hơn phân chia ngẫu nhiên không? | Điểm số CBS (0-100), Bán kính phủ $R_{\text{cov}}$, Cosine Similarity 10 lớp | `notebooks/03_shared_frozen_test_val_splits.ipynb`, `results/phase_03/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ4** | Việc phân bổ quota tập mầm theo 4 lát cắt khó có giúp mô hình xuất phát tốt hơn và hội tụ nhanh hơn phân bổ ngẫu nhiên không? | $\text{mAP}@50$ mô hình mầm V0, Số epoch hội tụ, mAP trên lát cắt đêm/nhỏ | `notebooks/04_seed_v0_training_ablation.ipynb`, `results/phase_04/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ5** | Việc kết hợp vector trọng số thâm hụt lớp động ($C_w$) vào hàm khai phá C6 có đẩy nhanh tốc độ phục hồi các lớp hiếm ở đuôi dài không? | $\text{mAP}@50$ các lớp hiếm (`train`, `rider`, `motor`), Macro $\text{mAP}@50$ | `notebooks/05_active_mining_tournament_and_hitl.ipynb`, `results/phase_05/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ6** | Cơ chế huấn luyện tiếp sức (Warm-Start) gộp lũy kế dữ liệu mỏ neo có ngăn chặn triệt để hiện tượng quên tri thức không? | Đường cong hàm mất mát, Thời gian huấn luyện (epochs), Độ ổn định lớp cũ | `notebooks/06_model_v1_retraining_and_gold_benchmark.ipynb`, `results/phase_06/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ7** | Quy trình bánh đà đề xuất có thể đánh bại trần hiệu năng 100% Target với chỉ 60% ngân sách dữ liệu không? | Macro $\text{mAP}@50$, Tổng số ảnh gán nhãn, Ngân sách tiết kiệm ($) | `notebooks/07_end_to_end_autonomous_active_loop.ipynb`, `results/phase_07/` | **Đã Có Bằng Chứng Thực Nghiệm** |
| **RQ8** | Sự đánh đổi giữa độ trễ suy luận và độ chính xác khi lượng tử hóa INT8 trên thiết bị nhúng diễn ra như thế nào? | Độ trễ suy luận (ms), Dung lượng mô hình (MB), Mức suy giảm mAP | `notebooks/08_production_hitl/` *(kế hoạch mở rộng)* | `NEEDS_EVIDENCE` *(Đang Thực Nghiệm)* |

---

## 6. Phạm Vi và Các Giả Định (Scope and Assumptions)

### 6.1 Trong Phạm Vi Nghiên Cứu
- **Bộ dữ liệu**: Tập con tiêu chuẩn BDD10K gồm 10.000 ảnh (7.000 ảnh pool huấn luyện, 1.400 ảnh Test đóng băng, 700 ảnh Val cố định).
- **Nhiệm vụ thị giác**: Phát hiện vật thể 2D với Bounding Box trên 10 lớp giao thông chính thống.
- **Kiến trúc mô hình**: Ultralytics YOLOv11n thực thi trên môi trường PyTorch hiện đại.
- **Phạm vi thuật toán**: pHash DCT, Phương sai Tenengrad/Laplacian, Tăng cường Retinex, Submodular Facility Location, Gonzalez $k$-Center, Predictive Entropy, và Focal Loss.
- **Quy chuẩn đánh giá**: Đánh giá nghiêm ngặt trên tập kiểm thử độc lập không giao thoa với các tham số cố định (`imgsz=1280`, `conf=0.25`, `iou=0.60`).

### 6.2 Nằm Ngoài Phạm Vi Nghiên Cứu
- Phát hiện vật thể 3D trong không gian không gian điểm ảnh (LiDAR / 3D Bounding Box).
- Phân đoạn ngữ nghĩa cấp độ pixel (Semantic / Panoptic Segmentation).
- Huấn luyện các mô hình Vision Transformer khổng lồ (thực nghiệm song mã chỉ ra RT-DETR bị bỏ đói dữ liệu và đạt 0% mAP trên tập mầm nhỏ).
- Thích ứng miền không giám sát (Domain Adaptation) giữa các tập dữ liệu tổng hợp và thực tế.

### 6.3 Các Giả Định Kỹ Thuật
- Khung hình video được lấy mẫu ở tần số 1 Hz từ video hành trình 30 FPS, bảo tồn tính tương quan thời gian tự nhiên.
- Chuyên gia gán nhãn con người (Oracle) ở bước thẩm định cung cấp nhãn vàng sạch 100%.
- Hệ thống thực thi có đủ CPU đa nhân cho việc trích xuất đặc trưng song song và tối thiểu một GPU/MPS hỗ trợ huấn luyện YOLO.

---

## 7. Đóng Góp Khoa Học và Kỹ Thuật Thực Nghiệm (Research Contributions)

Dự án mang lại các đóng góp kỹ thuật và thực nghiệm có giá trị thực tiễn cao:

1. **Xây Dựng Pipeline Data-Centric Khép Kín Hoàn Chỉnh**: Thiết lập và công khai mã nguồn một quy trình 8 chặng tự động hóa liên hoàn kết nối từ video thô, lọc trùng, phân tầng, khai phá, kiểm duyệt HITL đến đóng gói mô hình xuất xưởng.
2. **Minh Chứng Thực Nghiệm: Chất Lượng Đánh Bại Số Lượng**: Chứng minh thuyết phục trên dữ liệu BDD10K rằng việc chọn lọc thông minh **3.336 ảnh chất lượng cao (60% pool)** giúp mô hình đạt **$27.85\% \text{ mAP}@50$**, đánh bại hoàn toàn trần lý thuyết **$26.85\% \text{ mAP}@50$** khi huấn luyện trên toàn bộ **5.565 ảnh (100% pool)**, tiết kiệm trực tiếp **40.1% chi phí gán nhãn**.
3. **Thuật Toán FastDedup CPU Kết Hợp Cơ Chế KMV**: Đề xuất và kiểm chuẩn thuật toán lọc trùng đạt **$360.3$ FPS trên CPU đơn nhân** (nhanh gấp **$15.4\times$** so với ResNet50 Deep Feature), loại bỏ 100% rủi ro xóa nhầm người đi bộ và phương tiện nhỏ ở xa.
4. **Giải Thuật Phân Chia Dữ Liệu Hybrid Mix 80/20**: Kết hợp tối ưu giữa Submodular Facility Location và Gonzalez $k$-Center, đạt điểm số đối chuẩn CBS cao nhất giải đấu (**93.59 điểm**) và xác nhận 0% rò rỉ dữ liệu qua 13.45M cặp quét kiểm toán.
5. **Khắc Phục Rào Cản Macro-Average Nhờ Bộ Cân Bằng $C_w$**: Thiết kế vector trọng số phạt động tự động ghìm lớp xe con `car` ở mức sàn an toàn ($0.20\times$) để giải phóng gradient, giúp các lớp hiếm bứt phá ngoạn mục (`train` từ $0.0\%$ lên $16.2\%$, `motor` từ $2.1\%$ lên $14.8\%$, `rider` từ $2.2\%$ lên $10.1\%$).
6. **Bộ Rào Chắn Dừng An Toàn 5 Tầng (5-Tier Stopping Barrier)**: Xây dựng cơ chế kiểm soát chất lượng tự động xác nhận chiến thắng (`VICTORY_CONFIRMED`) và tự động ngắt vòng lặp mà không cần can thiệp thủ công.

---

## 8. Thuật Ngữ Then Chốt (Key Terminology)

- **Object Detection (Nhận diện vật thể)**: Tác vụ thị giác máy tính nhằm định danh danh mục ngữ nghĩa và xác định vị trí vật thể qua tọa độ hộp bao 2D $(x_{\min}, y_{\min}, x_{\max}, y_{\max})$.
- **Active Learning (Học tập chủ động)**: Cơ chế học máy trong đó thuật toán chủ động tương tác và lựa chọn các mẫu chưa gán nhãn có giá trị thông tin cao nhất để yêu cầu chuyên gia dán nhãn.
- **Data-Centric AI (Trí tuệ nhân tạo lấy dữ liệu làm trung tâm)**: Tư duy kỹ thuật ưu tiên tối ưu hóa chất lượng, tính cân bằng và độ sạch của dữ liệu đầu vào hơn là liên tục thay đổi kiến trúc mô hình.
- **Perceptual Hash (Băm tri giác - pHash)**: Dấu vân tay kỹ thuật số của hình ảnh tạo ra từ biến đổi Cosine rời rạc 2D, cho mã băm tương tự nhau đối với các hình ảnh có cấu trúc thị giác tương đồng bất chấp biến đổi ánh sáng nhỏ.
- **Hamming Distance (Khoảng cách Hamming)**: Số lượng vị trí bit khác nhau giữa hai chuỗi nhị phân cùng độ dài, dùng để đo lường mức độ sai khác thị giác giữa hai mã pHash.
- **Dataset Profiling (Lập hồ sơ dữ liệu)**: Quá trình phân tích định lượng các đặc tính quang học, không gian và môi trường của tập dữ liệu trước khi huấn luyện mô hình.
- **Hard Slices (Lát cắt khó)**: Các tập con dữ liệu đặc thù bởi điều kiện vận hành bất lợi (ban đêm, mưa gió, rung mờ, che khuất cao) nơi mô hình thông thường có tỷ lệ lỗi vượt trội.
- **Submodular Optimization (Tối ưu hóa tựa mô-đun)**: Lớp bài toán tối ưu tổ hợp có tính chất lợi tức giảm dần, áp dụng để chọn tập mẫu đại diện đa dạng cao nhất (Facility Location).
- **Gonzalez Minimax $k$-Center**: Giải thuật hình học nhằm thu hẹp khoảng cách tối đa từ bất kỳ điểm nào trong không gian đến tâm cụm gần nhất, bảo đảm độ phủ kín biên dữ liệu.
- **Annotation Budget (Ngân sách gán nhãn)**: Giới hạn tối đa số lượng khung hình hoặc hộp nhãn được phép gửi cho con người gán nhãn thủ công trong suốt dự án.
- **Baseline (Đường cơ sở đối chứng)**: Cấu hình chuẩn so sánh đối đầu trong đó các mẫu được bốc ngẫu nhiên đồng đều (Uniform Random) từ kho dữ liệu chưa nhãn.
- **Frozen Test Set (Tập kiểm thử đóng băng)**: Tập dữ liệu kiểm định độc lập được niêm phong vĩnh viễn, không bao giờ xuất hiện trong tập huấn luyện hay khai phá active.
- **Macro-Average Penalty (Hình phạt trung bình vĩ mô)**: Sự méo mó điểm số khi lấy trung bình cộng không trọng số giữa 10 lớp, khiến điểm số tổng quát bị kéo sụt nghiêm trọng nếu có lớp bị 0%.
- **Human-in-the-Loop (Con người trong vòng lặp - HITL)**: Kiến trúc hệ thống kết hợp trí tuệ con người tại các điểm chốt chặn kiểm duyệt quan trọng, song hành cùng tự động hóa máy học.
- **Quality-Gated Pre-labeling (Vẽ sẵn hộp có rào chắn chất lượng)**: Cơ chế chỉ tự động gợi ý bounding box cho các lớp đã đạt độ chính xác cao ($\ge 75\%$), khóa cứng các lớp yếu để triệt tiêu nguy cơ gây nhiễu nhãn.

---

## 9. Hướng Dẫn Tra Cứu Tài Liệu (Document Guide)

Hệ thống tài liệu chuyên sâu trong thư mục `docs/` được tổ chức liên kết chặt chẽ:

```
docs/
├── README.md                           # Mục lục tổng thể & Hướng dẫn tra cứu toàn dự án
├── 01_project_overview.md              # Tài liệu hiện tại: Bài toán, Động lực & Phạm vi nghiên cứu
├── 02_pipeline_architecture.md         # Sơ đồ kiến trúc toàn trình & Luồng dữ liệu 8 chặng
├── 03_experiment_results.md            # Bảng tổng hợp đối chuẩn vĩ mô & Chi tiết 10 lớp V0 -> V5
├── 04_reproduction_guide.md            # Hướng dẫn tái lập thực nghiệm từng bước qua CLI & Notebooks
├── 05_limitations_and_future_work.md   # Phân tích ranh giới kỹ thuật, góc khuất & Hướng phát triển
└── experiments/
    ├── README.md                       # Quy chuẩn 10 mục báo cáo thực nghiệm các giai đoạn
    ├── 01_fast_dedup.md                # Phase 01: Báo cáo giải đấu lọc trùng Dual-Stream FastDedup
    ├── 02_data_profiling.md            # Phase 02: Báo cáo lập hồ sơ quang học 5D không giám sát
    ├── 03_frozen_splits.md             # Phase 03: Báo cáo phân chia tập đóng băng Hybrid Mix 80/20
    ├── 04_seed_baseline.md             # Phase 04: Báo cáo huấn luyện tập mầm V0 & Cấu hình Cfg-3
    ├── 05_active_mining.md             # Phase 05: Báo cáo đấu trường khai phá C6 & HITL Router
    ├── 06_retraining.md                # Phase 06: Báo cáo tái huấn luyện & Vector thâm hụt lớp C_w
    ├── 07_end_to_end_loop.md           # Phase 07: Báo cáo vận hành bánh đà tự động V0 -> V5
    └── 08_production_hitl.md           # Phase 08: Báo cáo rào chắn sản xuất & Lượng tử hóa INT8
```

### Liên Kết Nhanh
- [Quay lại Mục Lục Tài Liệu Tổng Thể](README.md)
- [Xem Kiến Trúc Pipeline & Luồng Dữ Liệu](02_pipeline_architecture.md)
- [Xem Bảng Tổng Hợp Kết Quả Thực Nghiệm](03_experiment_results.md)
- [Xem Danh Mục Báo Cáo Thực Nghiệm Chi Tiết](experiments/README.md)
