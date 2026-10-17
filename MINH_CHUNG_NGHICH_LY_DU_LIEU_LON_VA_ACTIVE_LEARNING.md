# BÁO CÁO KHOA HỌC: MINH CHỨNG NGHỊCH LÝ DỮ LIỆU LỚN, CHI PHÍ GÁN NHÃN VÀ SỰ SỤP ĐỔ HIỆU NĂNG Ở CÁC CẢNH HIẾM TRONG XE TỰ HÀNH

> **Dự án**: BDD10K Active Learning Lab: Hệ Thống Tự Động Hóa Vòng Lặp Dữ Liệu Học Tập Chủ Động (Human-in-the-Loop)  
> **Tác giả / Nhóm nghiên cứu**: T018  
> **Kho lưu trữ mã nguồn chính (GitHub)**: [Wanlee199/bdd10k-hitl-simulator-web](https://github.com/Wanlee199/bdd10k-hitl-simulator-web)  
> **Kho lưu trữ nghiên cứu gốc (Upstream)**: [nguyenhuynhdt37/autonomous-driving-active-learning-lab](https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab)  
> **Tài liệu tham chiếu chuẩn**: Berkeley DeepDrive (BDD10K Dataset — Yu et al., CVPR 2020)  

---

## 📑 MỤC LỤC
1. [Tóm Tắt Điều Hành & Luận Điểm Cốt Lõi](#1-tóm-tắt-điều-hành--luận-điểm-cốt-lõi)
2. [Cơ Sở Khoa Học Quốc Tế Về "Nghịch Lý Dữ Liệu Lớn"](#2-cơ-sở-khoa-học-quốc-tế-về-nghịch-lý-dữ-liệu-lớn)
3. [Căn Cứ Định Giá Chi Phí Gán Nhãn (~$3.00 USD / Ảnh)](#3-căn-cứ-định-giá-chi-phí-gán-nhãn-300-usd--ảnh)
4. [Minh Chứng Phân Bố Lệch Cực Đoan & Sự Sụp Đổ Của Mô Hình Ở Cảnh Hiếm](#4-minh-chứng-phân-bố-lệch-cực-đoan--sự-sụp-đổ-của-mô-hình-ở-cảnh-hiếm)
5. [Bằng Chứng Thực Nghiệm Đo Đạc Trực Tiếp Trong Dự Án (Kèm Link GitHub)](#5-bằng-chứng-thực-nghiệm-đo-đạc-trực-tiếp-trong-dự-án-kèm-link-github)
6. [Danh Mục Bài Báo Khoa Học & Báo Cáo Công Nghiệp Quốc Tế (Kèm Link Truy Cập)](#6-danh-mục-bài-báo-khoa-học--báo-cáo-công-nghiệp-quốc-tế-kèm-link-truy-cập)

---

## 1. TÓM TẮT ĐIỀU HÀNH & LUẬN ĐIỂM CỐT LÕI

Trong lĩnh vực xe tự hành (Autonomous Driving), một giả định phổ biến nhưng sai lầm là: *"Cứ thu thập thật nhiều dữ liệu và gán nhãn toàn bộ thì mô hình AI sẽ tự động thông minh hơn"*. Thực tế ngành công nghiệp và bằng chứng khoa học chỉ ra một bài toán hóc búa được gọi là **Nghịch lý Dữ liệu lớn (Big Data Paradox)**:

1. **Lãng phí 80% – 85% chi phí gán nhãn**: Hơn 85% khung hình video thu được từ camera hành trình là các cảnh lặp lại, dư thừa tri giác (xe dừng đèn đỏ, kẹt xe thẳng hàng, chạy trên cao tốc quang đãng). Việc gán nhãn ngẫu nhiên toàn bộ các khung hình này tiêu tốn ngân sách khổng lồ vào những dữ liệu không đem lại gradient học tập mới cho mô hình.
2. **Chi phí gán nhãn thủ công rất đắt đỏ**: Một khung hình giao thông 2D Object Detection chất lượng cao có từ 12–18 bounding boxes với các thuộc tính phức tạp (che khuất, cắt xén, kiểm duyệt 2 vòng QA), tiêu tốn trung bình **xấp xỉ $3.00 USD / ảnh** (theo chuẩn công nghiệp của Scale AI, iMerit).
3. **Sụp đổ hiệu năng ở các cảnh hiếm (Long-Tail Performance Collapse)**: Các đối tượng nguy hiểm sống còn nhưng hiếm gặp (người điều khiển xe máy `rider`, xe gắn máy `motor`, xe lửa `train`) chỉ chiếm **dưới 1% – 2%** tổng dữ liệu. Nếu huấn luyện trên tập mẫu ngẫu nhiên, mô hình sẽ đạt điểm cao trên xe con (`car`) nhưng **sụp đổ hoàn toàn về độ chính xác (Precision = 0.0%, mAP = 0% – 2%) trên các lớp hiếm**, đe dọa trực tiếp đến tính mạng con người.
4. **Giải pháp đột phá**: Hệ sinh thái **Active Learning (Học tập chủ động)** kết hợp **Human-in-the-Loop** chỉ chọn lọc những khung hình có giá trị thông tin cao nhất, giúp mô hình vượt trần độ chính xác của 100% dữ liệu ngẫu nhiên nhưng **tiết kiệm tới 40.1% chi phí gán nhãn**.

---

## 2. CƠ SỞ KHOA HỌC QUỐC TẾ VỀ "NGHỊCH LÝ DỮ LIỆU LỚN"

### 2.1 Bằng chứng từ bộ dữ liệu BDD100K (UC Berkeley - CVPR 2020)
* **Công trình**: *BDD100K: A Diverse Driving Dataset for Heterogeneous Multitask Learning* — Fisher Yu, Trevor Darrell et al. (UC Berkeley), công bố tại hội nghị thị giác máy tính hàng đầu thế giới **CVPR 2020**.
* **Phát hiện**:
  * Nhóm nghiên cứu thu thập hơn **100.000 video** hành trình (mỗi video 40 giây @ 30 FPS = 1.200 khung hình/video $\approx$ **120 triệu khung hình**).
  * Họ phát hiện rằng giữa các khung hình liên tiếp trong cùng một video, **độ tương đồng tri giác (perceptual redundancy) lên tới >90%**.
  * Vì vậy, để tối ưu tài nguyên, UC Berkeley bắt buộc phải lấy mẫu thưa: chỉ trích đúng **1 khung hình tại giây thứ 10** trong mỗi video để đưa đi gán nhãn chuyên gia, minh chứng rằng việc gán nhãn dày đặc từng giây là cực kỳ lãng phí.

### 2.2 Báo cáo của Andrej Karpathy về kiến trúc "Data Engine" (Tesla AI Day 2021)
* **Báo cáo**: *AI for Full Self-Driving at Tesla — The Data Engine* — Andrej Karpathy (nguyên Giám đốc AI của Tesla) trình bày tại **CVPR 2021 Workshop on Autonomous Driving** và **Tesla AI Day 2021**.
* **Luận điểm**:
  * Hơn **90% – 99%** dữ liệu video camera hành trình từ hàng triệu xe Tesla chạy ngoài đường là các cảnh "nhàm chán và dư thừa" (boring & redundant highway driving).
  * Nếu nạp tất cả dữ liệu này vào huấn luyện, mô hình sẽ bị thiên vị nặng nề vào các mẫu dễ và làm loãng khả năng phát hiện các trường hợp góc khuất (edge cases).
  * Tesla giải quyết bằng cách cài đặt các **"trigger"** trên xe: chỉ khi nào xe gặp tình huống phanh khẩn cấp, người lái can thiệp vô-lăng, hoặc mạng nơ-ron có độ bất định cao (Uncertainty) thì đoạn video ngắn đó mới được cắt và truyền về máy chủ để chuyên gia gán nhãn. Đây chính là bản chất của **Active Learning trong công nghiệp**.

### 2.3 Khảo sát lý thuyết Active Learning (Burr Settles, 2009)
* **Công trình**: *Active Learning Literature Survey* — Burr Settles (University of Wisconsin–Madison).
* **Chứng minh toán học**: Việc lấy mẫu ngẫu nhiên đồng đều (Uniform Random Sampling) trên các phân bố dữ liệu không cân bằng sẽ tạo ra các **Gradient tiệm cận 0 (Zero-Information Gradients)**:
  $$\nabla_\theta \mathcal{L}(f_\theta(x), y) \approx 0 \quad \text{khi} \quad P(y \mid x, \theta) \to 1$$
  Nghĩa là khi mô hình đã quá quen thuộc với một cảnh xe con ban ngày, việc tiếp tục gán nhãn các bức ảnh tương tự chỉ tiêu tốn ngân sách mà không làm thay đổi trọng số của mạng học sâu.

---

## 3. CĂN CỨ ĐỊNH GIÁ CHI PHÍ GÁN NHÃN (~$3.00 USD / ẢNH)

Theo các báo cáo định giá dịch vụ gán nhãn dữ liệu xe tự hành của các tập đoàn công nghệ hàng đầu (**Scale AI, Labelbox, iMerit, Cognata 2021–2023**):

1. **Đặc thù bài toán 2D Bounding Box trong xe tự hành**:
   * Khác với phân loại ảnh đơn giản (chỉ chọn 1 nhãn cho toàn ảnh với giá vài cent), bài toán Object Detection trong xe tự hành đòi hỏi kỹ thuật viên phải:
     * Vẽ bounding box chính xác từng pixel cho từng vật thể.
     * Gán phân loại chính xác trong 10 danh mục.
     * Bật cờ che khuất (`occluded: true/false`).
     * Bật cờ bị cắt mép ảnh (`truncated: true/false`).
     * Trải qua 2 tầng thẩm định độc lập (Consensus QA & Senior Expert Audit) để bảo đảm nguyên tắc Zero Label Noise.
2. **Đơn giá thực tế**:
   * Đơn giá chuẩn thị trường: **$0.15 đến $0.30 USD cho mỗi bounding box** chất lượng cao.
   * Thống kê trên tập dữ liệu BDD10K: Mỗi khung hình chứa trung bình từ **12 đến 18 bounding boxes**.
3. **Công thức tính chi phí trung bình**:
   $$\text{Chi phí bình quân} = 15 \text{ bounding boxes} \times \$0.20 \text{ USD/box} \approx \mathbf{\$3.00 \text{ USD / ảnh}}$$

> 💡 **Phân tích thiệt hại tài chính**:
> Đối với một dự án nghiên cứu hoặc phát triển xe tự hành thu thập **100.000 ảnh**, chi phí gán nhãn toàn bộ là **$300.000 USD**. Nếu 85% trong số đó là các cảnh đường cao tốc lặp lại, doanh nghiệp đã **ném qua cửa sổ $255.000 USD** vào dữ liệu rác.

---

## 4. MINH CHỨNG PHÂN BỐ LỆCH CỰC ĐOAN & SỰ SỤP ĐỔ CỦA MÔ HÌNH Ở CẢNH HIẾM

### 4.1 Thống kê thực tế 10 lớp trong BDD10K: Lớp hiếm chỉ chiếm 1.14%
Trích xuất từ bảng phân rã thực tế 6.994 ảnh của dự án ([Xem chi tiết trên GitHub](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/results/phase_03/tables/table_02_per_class_10_distribution.md)):

| Nhóm Đối Tượng | Danh Mục Lớp BDD10K | Số Lượng Hộp Nhãn (BBox) | Tỷ Trọng (%) | Nhận Xét Khoa Học |
| :--- | :--- | :---: | :---: | :--- |
| **Nhóm Đa Số**<br>*(Head Classes)* | **`car`** (Xe con)<br>**`traffic sign`** (Biển báo)<br>**`traffic light`** (Đèn giao thông)<br>**`person`** (Người đi bộ) | 72.021<br>24.244<br>19.053<br>8.929 | 55.44%<br>18.66%<br>14.67%<br>6.87% | **4 lớp này chiếm tới 95.64%** toàn bộ dữ liệu. Mô hình rất dễ bị thiên vị và học vẹt vào các lớp này. |
| **Nhóm "Đuôi Dài" Hiếm Gặp**<br>*(Tail Classes)* | **`bus`** (Xe buýt)<br>**`bike`** (Xe đạp)<br>**`rider`** (Người lái xe máy)<br>**`motor`** (Xe gắn máy)<br>**`train`** (Xe lửa) | 1.156<br>729<br>457<br>291<br>14 | 0.89%<br>0.56%<br>**0.35%**<br>**0.22%**<br>**0.01%** | **Cả 5 lớp hiếm chỉ chiếm ~2.0%**.<br>Riêng `rider` chỉ chiếm 0.35%, và `train` chỉ có 14 hộp nhãn trên gần 7.000 ảnh! |

### 4.2 Hiện tượng sụp đổ hiệu năng (Performance Collapse)
Khi huấn luyện mô hình cơ sở ban đầu (Seed V0 với 500 ảnh lấy mẫu ngẫu nhiên), kết quả đo đạc trên tập kiểm thử độc lập cho thấy:
* **Lớp đa số đạt điểm rất cao**: Lớp `car` đạt **60.40% mAP@50** (Precision 60.3%, Recall 58.9%).
* **Lớp hiếm sụp đổ hoàn toàn**:
  * Lớp `rider` (người điều khiển xe máy): **Precision = 0.0%**, **Recall = 0.0%**, mAP@50 chỉ đạt **2.20%**. Mô hình bị "mù hoàn toàn", không nhận diện được bất kỳ người lái xe máy nào.
  * Lớp `motor` (xe gắn máy): **Precision = 0.0%**, mAP@50 chỉ đạt **2.13%**.
  * Lớp `train` (xe lửa): mAP@50 rớt thẳng về **0.00%**.
* **Sự sụp đổ toàn diện của Vision Transformer (RT-DETR-L)**: Khi thử nghiệm kiến trúc Transformer thời gian thực trên ít mẫu, do thiếu độ lệch quy nạp tích chập (Convolutional Inductive Bias), mô hình sụp đổ về **0.12% mAP@50** toàn cục (9/10 lớp đạt 0.0%).

---

## 5. BẰNG CHỨNG THỰC NGHIỆM ĐO ĐẠC TRỰC TIẾP TRONG DỰ ÁN (KÈM LINK GITHUB)

Toàn bộ các số liệu, mã nguồn và bảng kiểm toán đều được công khai minh bạch tại kho lưu trữ GitHub:

### 🔗 1. Bảng phân rã 10 lớp BDD10K (Minh chứng dữ liệu mất cân bằng)
* **Tệp trên GitHub**: [`results/phase_03/tables/table_02_per_class_10_distribution.md`](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/results/phase_03/tables/table_02_per_class_10_distribution.md)
* **Ý nghĩa**: Phân rã chính xác 129.914 hộp nhãn qua 4 phân tập (Full Pool, Test, Val, Seed V0), chứng minh sự chênh lệch gấp **5.144 lần** giữa lớp `car` (72.021 nhãn) và lớp `train` (14 nhãn).

### 🔗 2. Báo cáo đo đạc thực nghiệm Seed V0 & Sự sụp đổ của lớp hiếm
* **Tệp trên GitHub**: [`docs/experiments/04_seed_baseline.md`](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/docs/experiments/04_seed_baseline.md#L183-L196)
* **Ý nghĩa**: Bảng đối đầu per-class 10 lớp giữa YOLO11n và RT-DETR-L, cung cấp bằng chứng thực nghiệm về việc `rider`, `motor` và `train` bị sụp đổ về 0% Precision trên mô hình mầm ngẫu nhiên.

### 🔗 3. Báo cáo đấu trường Active Mining C6 Super-Fusion (Săn vật thể hiếm)
* **Tệp trên GitHub**: [`docs/03_experiment_results.md`](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/docs/03_experiment_results.md#L240-L250)
* **Ý nghĩa**: Chứng minh chiến lược khai phá chủ động `C6 Super-Fusion` bắt được **655 vật thể hiếm** từ kho chưa gán nhãn, vượt trội gấp **3.45 lần** so với lấy mẫu ngẫu nhiên `C1 Random` (chỉ bắt được 190 vật thể).

### 🔗 4. Bảng đối chuẩn 3 trục và chứng minh tiết kiệm 40.1% ngân sách tại V5
* **Tệp trên GitHub**: [`docs/03_experiment_results.md`](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/docs/03_experiment_results.md#L325-L340)
* **Ý nghĩa**: Chứng minh tại vòng V5, thuật toán đạt **27.85% mAP@50** (vượt trần 100% Full Pool là 26.85%), kích hoạt rào chắn dừng thông minh tại **3.336 ảnh** thay vì phải gán nhãn toàn bộ 5.565 ảnh $\rightarrow$ **Tiết kiệm 40.1% chi phí gán nhãn (2.229 ảnh $\times$ $3.00 USD $\approx$ $6.687 USD)**.

### 🔗 5. Kiến trúc Pipeline & Báo cáo tổng quan dự án
* **Tổng quan dự án**: [`docs/01_project_overview.md`](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/docs/01_project_overview.md)
* **Kiến trúc luồng dữ liệu 7 công đoạn**: [`docs/02_pipeline_architecture.md`](https://github.com/Wanlee199/bdd10k-hitl-simulator-web/blob/main/docs/02_pipeline_architecture.md)
* **Kho lưu trữ nghiên cứu gốc (Upstream Core Engine)**: [`nguyenhuynhdt37/autonomous-driving-active-learning-lab`](https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab)

---

## 6. DANH MỤC BÀI BÁO KHOA HỌC & BÁO CÁO CÔNG NGHIỆP QUỐC TẾ (KÈM LINK TRUY CẬP)

1. **Fisher Yu, Trevor Darrell et al. (UC Berkeley)** — *BDD100K: A Diverse Driving Dataset for Heterogeneous Multitask Learning*, IEEE/CVF CVPR 2020.  
   👉 [Đọc toàn văn tại CVF Open Access](https://openaccess.thecvf.com/content_CVPR_2020/html/Yu_BDD100K_A_Diverse_Driving_Dataset_for_Heterogeneous_Multitask_Learning_CVPR_2020_paper.html) | [arXiv:1805.04687](https://arxiv.org/abs/1805.04687) | [Website BDD100K](https://www.bdd100k.com/)

2. **Andrej Karpathy (Tesla)** — *AI for Full Self-Driving at Tesla (The Data Engine Loop)*, CVPR 2021 Workshop on Autonomous Driving & Tesla AI Day 2021.  
   👉 [Xem Video bài thuyết trình tại CVPR Workshop (YouTube)](https://www.youtube.com/watch?v=g6bOwQdAJrc) | [Trang nghiên cứu Karpathy.ai](https://karpathy.ai/)

3. **Burr Settles (University of Wisconsin–Madison)** — *Active Learning Literature Survey*, Computer Sciences Technical Report 1648, 2009.  
   👉 [Tải PDF tại Thư viện Đại học Wisconsin-Madison](http://digital.library.wisc.edu/1793/60660) | [Bản lưu trữ CMU (PDF)](https://www.cs.cmu.edu/~bsettles/pub/settles.activelearning.pdf)

4. **Ozan Sener, Silvio Savarese (Stanford University / Intel Labs)** — *Active Learning for Convolutional Neural Networks: A Core-Set Approach*, ICLR 2018.  
   👉 [Đọc toàn văn tại arXiv:1708.00489](https://arxiv.org/abs/1708.00489) | [Thảo luận tại OpenReview ICLR 2018](https://openreview.net/forum?id=H1Wh-WgC-)

5. **Yin Cui, Serge Belongie et al. (Cornell Tech / Google Brain)** — *Class-Balanced Loss Based on Effective Number of Samples*, IEEE/CVF CVPR 2019.  
   👉 [Đọc toàn văn tại CVF Open Access](https://openaccess.thecvf.com/content_CVPR_2019/html/Cui_Class-Balanced_Loss_Based_on_Effective_Number_of_Samples_CVPR_2019_paper.html) | [arXiv:1901.05555](https://arxiv.org/abs/1901.05555)

6. **Scale AI & iMerit Autonomous Driving Annotation Reports (2021–2023)** — *The True Cost of High-Quality 2D/3D Perception Labeling in Autonomous Driving*.  
   👉 [Báo cáo chuyên đề gán nhãn xe tự hành iMerit AI](https://imerit.ai/solutions/autonomous-vehicles/) | [Scale AI Autonomous Vehicle Perception Hub](https://scale.com/automotive)

---
*Bản quyền báo cáo thuộc Nhóm Nghiên Cứu T018 — BDD10K Active Learning Lab (2026).*
