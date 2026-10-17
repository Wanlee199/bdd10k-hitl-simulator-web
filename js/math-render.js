/**
 * math-render.js - Trình kích hoạt và kết xuất công thức toán học KaTeX
 * Hỗ trợ block math ($$...$$) và inline math ($...$)
 * Chuẩn phong cách Nordic Editorial - BDD10K HITL Simulator
 */

function triggerKaTeXAutoRender(root = document.body) {
  if (typeof renderMathInElement === 'function') {
    try {
      renderMathInElement(root, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
        ignoredClasses: ['no-math', 'calc-control-val', 'roi-big-val', 'font-mono-code'],
        throwOnError: false
      });
    } catch (e) {
      console.warn('[KaTeX AutoRender] Lưu ý:', e);
    }
  }
}

// Kích hoạt khi DOM sẵn sàng và kích hoạt bù khi CDN script hoàn tất nạp
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    triggerKaTeXAutoRender();
    setTimeout(triggerKaTeXAutoRender, 200);
    setTimeout(triggerKaTeXAutoRender, 800);
  });
} else {
  triggerKaTeXAutoRender();
  setTimeout(triggerKaTeXAutoRender, 200);
  setTimeout(triggerKaTeXAutoRender, 800);
}

// Đảm bảo window gọi được khi có phần tử sinh động (dynamic DOM update)
window.triggerKaTeXAutoRender = triggerKaTeXAutoRender;
