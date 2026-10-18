/**
 * BDD10K ActiveLab — Page Preloader Controller
 * Tự động quản lý màn hình chờ trang (Zero FOUC / Smooth Transition)
 * Đảm bảo chạy trọn vẹn ít nhất 1 chu kỳ loading (0% -> 100%) trước khi mở trang
 * Phong cách GreenSM Nordic Editorial
 */
(function () {
  'use strict';

  const startTime = Date.now();
  // Đảm bảo tối thiểu 850ms để hoàn thành 1 chu kỳ loading 0% -> 100% trọn vẹn
  const MIN_CYCLE_TIME = 850;
  // Dừng 120ms khi thanh tiến trình đạt 100% để người dùng cảm nhận trạng thái hoàn tất
  const COMPLETION_HOLD = 120;
  // Fallback tối đa 2200ms phòng ngừa trường hợp mạng ngoài bị nghẽn
  const MAX_FALLBACK_TIMEOUT = 2200;

  let isDismissed = false;

  function dismissPreloader() {
    if (isDismissed) return;
    isDismissed = true;

    const preloader = document.getElementById('al-global-preloader');
    if (!preloader) return;

    // Đảm bảo thanh tiến trình đạt 100%
    const bar = preloader.querySelector('.preloader-progress-bar');
    if (bar) {
      bar.style.width = '100%';
    }

    // Chờ 120ms sau khi đạt 100% rồi mới bắt đầu mờ dần (fade-out)
    setTimeout(function () {
      preloader.classList.add('preloader-hidden');
      setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 450);
    }, COMPLETION_HOLD);
  }

  function scheduleDismissal() {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_CYCLE_TIME - elapsed);
    setTimeout(dismissPreloader, remainingTime);
  }

  // Lắng nghe khi toàn bộ tài nguyên trang đã hoàn tất tải
  if (document.readyState === 'complete') {
    scheduleDismissal();
  } else {
    window.addEventListener('load', scheduleDismissal);
  }

  // Fallback an toàn tuyệt đối
  setTimeout(dismissPreloader, MAX_FALLBACK_TIMEOUT);
})();
