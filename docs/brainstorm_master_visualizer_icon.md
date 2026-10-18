# Báo Cáo Brainstorm: Bổ Sung Biểu Tượng Icon Cho Master Visualizer Khi Thu Nhỏ Sidebar

**Tài liệu:** `docs/brainstorm_master_visualizer_icon.md`  
**Mục tiêu:** Cung cấp icon hiển thị khi thu nhỏ sidebar (`html.sidebar-is-collapsed`) cho mục `Master Visualizer`  
**Ngày thực hiện:** 2026-10-18  
**Phương pháp:** `/ck:scout` & `/ck:brainstorm`  

---

## 1. Vấn Đề Kỹ Thuật & Hiện Trạng (Problem Statement)

### 1.1 Nguyên nhân thiếu icon khi thu nhỏ sidebar
- Khi người dùng bấm nút thu nhỏ sidebar (`toggleSidebar()`), class `sidebar-is-collapsed` được gán vào `<html>`, kích hoạt quy tắc CSS:
  ```css
  html.sidebar-is-collapsed .sidebar-text-expand { display: none !important; }
  html.sidebar-is-collapsed .sidebar-item-link { justify-content: center !important; }
  ```
- Ở các mục Point 01 đến Point 06:
  - Có sẵn khối badge ô vuông:
    ```html
    <span class="w-6 h-6 rounded-lg bg-[#F0EEE6] text-[#475254] ... shrink-0">01</span>
    ```
  - Khối này **không** mang class `sidebar-text-expand`, nên khi thu nhỏ nó vẫn hiển thị và được căn giữa hoàn hảo.
- Ở mục `<!-- Master Visualizer (Trang Gốc) -->` (và trên `index.html`):
  - Hiện tại cấu trúc thẻ là:
    ```html
    <div class="flex items-center gap-2 overflow-hidden">
      <span class="text-xs font-semibold ... sidebar-text-expand">Master Visualizer</span>
    </div>
    <span class="text-xs font-mono ... sidebar-text-expand">8 STAGES</span>
    ```
  - Cả tiêu đề chữ và badge `8 STAGES` đều mang class `sidebar-text-expand`.
  - **Hệ quả:** Khi thu nhỏ sidebar, toàn bộ nội dung con bên trong thẻ `<a>` đều bị ẩn (`display: none`), khiến nút `Master Visualizer` trở thành một ô trống rỗng, không có icon nhận diện!

---

## 2. Đánh Giá Các Phương Án (Evaluated Approaches)

| Tiêu Chí | Phương Án 1: Icon SVG Dashboard (ĐƯỢC CHỌN) | Phương Án 2: Text Badge "MV" | Phương Án 3: Ký Hiệu "00" / "★" |
| :--- | :--- | :--- | :--- |
| **Nhận diện trực quan** | ⭐⭐⭐⭐⭐ Biểu tượng dashboard 4 ô thể hiện vị thế "Trung tâm chỉ huy tổng thể" | ⭐⭐⭐⭐ Ký tự chữ tắt dễ hiểu nhưng kém bắt mắt hơn icon | ⭐⭐⭐ "00" dễ nhầm là điểm số 0, "★" hơi chung chung |
| **Tính đồng bộ giao diện** | ⭐⭐⭐⭐⭐ Kích thước `w-6 h-6 rounded-lg` chuẩn xác 100% với các ô số 01-06 | ⭐⭐⭐⭐⭐ Cùng kiểu font-mono và kích cỡ | ⭐⭐⭐⭐ Đồng bộ về kích cỡ |
| **Phân cấp kiến trúc** | ⭐⭐⭐⭐⭐ Tách biệt rõ ràng Master Visualizer (Trang gốc) với 6 Deep-Dive points | ⭐⭐⭐ Phẳng hóa như một point thông thường | ⭐⭐⭐ Không rõ nét |

### Thống nhất lựa chọn của Người Dùng:
- Sử dụng **Icon SVG Dashboard / Workflow Grid** đặt trong khối `w-6 h-6 rounded-lg`.
- Áp dụng cho mục **Master Visualizer** trên toàn bộ các trang:
  - `index.html` (Trạng thái Active: nền xanh rừng `#2D5A34`, icon trắng).
  - `fastdedup-point1.html`, `profiling-point2.html`, `splits-point3.html`, `training-point4.html`, `active-mining-point5.html`, `retraining-point6.html` (Trạng thái Inactive: nền `#F0EEE6`, hover xanh `#2D5A34`).

---

## 3. Thiết Kế Chi Tiết & Mã Nguồn (Detailed Design Specification)

### 3.1 Cấu Trúc HTML Cho `index.html` (Trạng Thái Đang Xem - Active)
```html
<!-- 07 Master Visualizer (Active) -->
<a href="index.html"
  class="flex items-center justify-between p-2 rounded-xl bg-[#E8F0EA] border border-[#2D5A34] shadow-soft-sm transition-all sidebar-item-link"
  title="Master Visualizer (8 STAGES • Đang xem)">
  <div class="flex items-center gap-2 overflow-hidden">
    <!-- Icon hiển thị cố định khi thu nhỏ sidebar -->
    <span
      class="w-6 h-6 rounded-lg bg-[#2D5A34] text-white flex items-center justify-center shrink-0 shadow-2xs">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    </span>
    <span class="text-xs font-bold text-[#2D5A34] truncate sidebar-text-expand">Master
      Visualizer</span>
  </div>
  <span
    class="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-white text-[#2D5A34] border border-[#CDE0D1] shrink-0 sidebar-text-expand">8
    STAGES</span>
</a>
```

### 3.2 Cấu Trúc HTML Cho 6 Trang Point 01 $\rightarrow$ 06 (Trạng Thái Trang Gốc - Default/Hover)
Áp dụng trên:
- [fastdedup-point1.html](file:///d:/QuanProject/bdd10k-hitl-simulator-web/fastdedup-point1.html#L146)
- [profiling-point2.html](file:///d:/QuanProject/bdd10k-hitl-simulator-web/profiling-point2.html#L146)
- [splits-point3.html](file:///d:/QuanProject/bdd10k-hitl-simulator-web/splits-point3.html#L191)
- [training-point4.html](file:///d:/QuanProject/bdd10k-hitl-simulator-web/training-point4.html#L146)
- [active-mining-point5.html](file:///d:/QuanProject/bdd10k-hitl-simulator-web/active-mining-point5.html#L187)
- [retraining-point6.html](file:///d:/QuanProject/bdd10k-hitl-simulator-web/retraining-point6.html#L187)

```html
<!-- Master Visualizer (Trang Gốc) -->
<a href="index.html"
  class="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5E3DC] hover:border-[#B7CDBB] hover:bg-[#F9FAFB] transition-all group sidebar-item-link"
  title="Master Visualizer (8 STAGES)">
  <div class="flex items-center gap-2 overflow-hidden">
    <!-- Icon hiển thị cố định khi thu nhỏ sidebar -->
    <span
      class="w-6 h-6 rounded-lg bg-[#F0EEE6] text-[#475254] group-hover:bg-[#2D5A34] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    </span>
    <span
      class="text-xs font-semibold text-[#1F2627] group-hover:text-[#2D5A34] transition-colors truncate sidebar-text-expand">Master
      Visualizer</span>
  </div>
  <span
    class="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-white text-[#2D5A34] border border-[#CDE0D1] shrink-0 sidebar-text-expand">8
    STAGES</span>
</a>
```

---

## 4. Hành Vi Tương Tác Khi Thu Nhỏ & Mở Rộng

1. **Khi Sidebar Mở Rộng (`w-72`):**
   - Icon Dashboard hiển thị bên trái tiêu đề `Master Visualizer`.
   - Tiêu đề chữ và badge `8 STAGES` hiển thị đầy đủ, ngay ngắn, cân đối tuyệt đối với các mục Point 01 $\rightarrow$ 06 bên dưới.
2. **Khi Sidebar Thu Nhỏ (`w-20` / `5rem`):**
   - Tiêu đề `Master Visualizer` và badge `8 STAGES` ẩn đi.
   - Thẻ `<a>` áp dụng `justify-content: center !important;`.
   - Ô vuông `w-6 h-6` chứa icon Dashboard nằm chính giữa nút, nổi bật và sắc nét.
   - Khi hover vào icon thu nhỏ, tooltip native `title="Master Visualizer (8 STAGES)"` hiển thị tức thì.

---

## 5. Kế Hoạch Triển Khai (Implementation Steps)

1. **Bước 1:** Cập nhật `index.html` tại dòng ~281.
2. **Bước 2:** Cập nhật đồng loạt 6 file point chuyên đề (`fastdedup-point1.html`, `profiling-point2.html`, `splits-point3.html`, `training-point4.html`, `active-mining-point5.html`, `retraining-point6.html`).
3. **Bước 3:** Kiểm tra đối soát trạng thái toggle sidebar để đảm bảo tính đồng bộ 100%.
