/**
 * BDD10K ActiveLab — Media Viewer & Video Controller
 * 1. Image & Chart Lightbox: Phóng to hình ảnh/biểu đồ sắc nét toàn màn hình khi click
 * 2. Video Controller: Phóng to toàn màn hình (Fullscreen) & Chặn autoplay ngầm
 * Chuẩn GreenSM Nordic Editorial — 100% Zero AI Emoji, Lucide SVG
 */

(function () {
  'use strict';

  let modalEl = null;
  let modalImg = null;
  let modalCaption = null;
  let isZoomedOriginal = false;

  // ---------------------------------------------------------------------------
  // 1. Khởi tạo Image Lightbox Modal DOM
  // ---------------------------------------------------------------------------
  function createLightboxModal() {
    if (document.getElementById('al-media-lightbox')) return;

    modalEl = document.createElement('div');
    modalEl.id = 'al-media-lightbox';
    modalEl.className = 'fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-all duration-300 select-none';
    
    modalEl.innerHTML = `
      <!-- Toolbar Góc Trên -->
      <div class="w-full max-w-6xl flex items-center justify-between pb-3 text-white/90">
        <div class="flex items-center gap-2 text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-[#2D5A34]"></span>
          <span class="font-bold text-white tracking-wide uppercase">ActiveLab Visual Inspector</span>
          <span class="text-white/40">•</span>
          <span id="al-lightbox-title" class="text-white/80 truncate max-w-md">Ảnh nghiên cứu 300 DPI</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- Nút Zoom 100% / Fit -->
          <button id="al-lightbox-zoom-btn" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-mono" title="Phóng to 100% / Vừa khung">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span class="hidden sm:inline">Phóng to</span>
          </button>
          <!-- Nút Đóng -->
          <button id="al-lightbox-close-btn" class="p-2 rounded-lg bg-white/10 hover:bg-red-600/80 text-white transition-colors" title="Đóng (Esc)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Khung chứa ảnh hiển thị -->
      <div id="al-lightbox-body" class="relative max-w-6xl max-h-[82vh] w-full flex items-center justify-center overflow-auto rounded-xl">
        <img id="al-lightbox-img" src="" alt="Zoomed view" class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-200 cursor-zoom-out" />
      </div>

      <!-- Caption dưới chân -->
      <div id="al-lightbox-caption" class="w-full max-w-4xl text-center text-xs font-mono text-white/70 pt-3 truncate"></div>
    `;

    document.body.appendChild(modalEl);

    modalImg = document.getElementById('al-lightbox-img');
    modalCaption = document.getElementById('al-lightbox-caption');

    // Sự kiện đóng
    document.getElementById('al-lightbox-close-btn').addEventListener('click', closeImageLightbox);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl || e.target.id === 'al-lightbox-body') {
        closeImageLightbox();
      }
    });

    // Toggle Zoom Original Size
    document.getElementById('al-lightbox-zoom-btn').addEventListener('click', toggleZoomOriginal);
    modalImg.addEventListener('click', toggleZoomOriginal);

    // Bắt phím Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalEl.classList.contains('pointer-events-none')) {
        closeImageLightbox();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Mở & Đóng Lightbox
  // ---------------------------------------------------------------------------
  window.openImageLightbox = function (src, caption) {
    if (!modalEl) createLightboxModal();
    if (!src) return;

    modalImg.src = src;
    modalCaption.textContent = caption || '';
    document.getElementById('al-lightbox-title').textContent = caption ? caption.split('—')[0].trim() : 'Biểu đồ chi tiết';

    isZoomedOriginal = false;
    modalImg.className = 'max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-200 cursor-zoom-out';

    modalEl.classList.remove('opacity-0', 'pointer-events-none');
    modalEl.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  };

  window.closeImageLightbox = function () {
    if (!modalEl) return;
    modalEl.classList.remove('opacity-100');
    modalEl.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    if (modalImg) modalImg.src = '';
  };

  function toggleZoomOriginal() {
    if (!modalImg) return;
    isZoomedOriginal = !isZoomedOriginal;
    if (isZoomedOriginal) {
      modalImg.className = 'max-w-none max-h-none object-none rounded-lg shadow-2xl transition-transform duration-200 cursor-zoom-out';
      document.getElementById('al-lightbox-zoom-btn').innerHTML = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <span class="hidden sm:inline">Vừa khung</span>
      `;
    } else {
      modalImg.className = 'max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-200 cursor-zoom-out';
      document.getElementById('al-lightbox-zoom-btn').innerHTML = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <span class="hidden sm:inline">Phóng to</span>
      `;
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Tự động gắn con trỏ zoom & sự kiện click cho tất cả ảnh trên trang
  // ---------------------------------------------------------------------------
  function attachImageZoomEvents() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      // Bỏ qua các ảnh icon rất nhỏ (<36px) hoặc ảnh nằm trong lightbox
      if (img.closest('#al-media-lightbox')) return;
      if (img.width > 0 && img.width < 36 && img.height < 36) return;

      img.classList.add('cursor-zoom-in');
      img.addEventListener('click', (e) => {
        // Nếu ảnh không nằm trong link thẻ a
        const parentLink = img.closest('a');
        if (parentLink && parentLink.getAttribute('href') && !parentLink.getAttribute('href').startsWith('#')) {
          return; // Để link hoạt động bình thường nếu có link ngoài
        }
        e.preventDefault();
        const caption = img.getAttribute('alt') || img.getAttribute('title') || '';
        window.openImageLightbox(img.currentSrc || img.src, caption);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Video Controller: Phóng To Toàn Màn Hình (Fullscreen)
  // ---------------------------------------------------------------------------
  window.toggleVideoFullscreen = function (elementId) {
    const target = document.getElementById(elementId) || document.querySelector('video');
    if (!target) return;

    // Tìm container cha có aspect-video hoặc chính video
    const container = target.closest('#videoContainer') || target.parentElement || target;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          if (target.requestFullscreen) target.requestFullscreen();
        });
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (target.webkitEnterFullscreen) {
        target.webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 5. Khởi chạy & Chặn Video Autoplay Ngầm Khi Nạp Trang
  // ---------------------------------------------------------------------------
  function initMediaViewer() {
    createLightboxModal();
    attachImageZoomEvents();

    // Tìm tất cả các thẻ video và gỡ bỏ thuộc tính autoplay nếu có
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
      v.removeAttribute('autoplay');
      v.autoplay = false;
      // Nếu video đang tự phát ngầm do script nào đó, dừng ngay
      if (!v.paused) {
        v.pause();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaViewer);
  } else {
    initMediaViewer();
  }
})();
