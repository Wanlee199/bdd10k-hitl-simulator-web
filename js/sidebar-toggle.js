/**
 * BDD10K ActiveLab — Sidebar Toggle Controller
 * Quản lý tính năng Thu nhỏ / Phóng to Sidebar (Collapse / Expand)
 * Chuẩn GreenSM Nordic Editorial — Tương thích 100% Tailwind CSS
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'al_sidebar_collapsed';

  // Khởi tạo trạng thái ban đầu từ localStorage
  function initSidebarState() {
    const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
    applySidebarState(isCollapsed, false);
  }

  // Áp dụng trạng thái cho DOM
  function applySidebarState(isCollapsed, animate) {
    const sidebar = document.getElementById('app-sidebar');
    const wrapper = document.getElementById('main-wrapper');
    const toggleIcon = document.getElementById('sidebar-toggle-icon');

    if (!sidebar || !wrapper) return;

    if (animate) {
      sidebar.classList.add('transition-all', 'duration-300', 'ease-in-out');
      wrapper.classList.add('transition-all', 'duration-300', 'ease-in-out');
    }

    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-is-collapsed');
      
      // Thu nhỏ Sidebar sang w-20 (80px)
      sidebar.classList.remove('w-72');
      sidebar.classList.add('w-20');

      // Thu hẹp padding của Main Wrapper sang pl-20 (80px)
      wrapper.classList.remove('pl-72');
      wrapper.classList.add('pl-20');

      // Cập nhật icon sang PanelLeftOpen (icon mở rộng)
      if (toggleIcon) {
        toggleIcon.innerHTML = `
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M9 3v18"/>
          <path d="m11 9 3 3-3 3"/>
        `;
      }
    } else {
      document.documentElement.classList.remove('sidebar-is-collapsed');

      // Mở rộng Sidebar về w-72 (288px)
      sidebar.classList.remove('w-20');
      sidebar.classList.add('w-72');

      // Mở rộng padding của Main Wrapper về pl-72 (288px)
      wrapper.classList.remove('pl-20');
      wrapper.classList.add('pl-72');

      // Cập nhật icon sang PanelLeftClose (icon thu nhỏ)
      if (toggleIcon) {
        toggleIcon.innerHTML = `
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M9 3v18"/>
          <path d="m14 9-3 3 3 3"/>
        `;
      }
    }
  }

  // Hàm chuyển đổi trạng thái (Public API)
  window.toggleSidebar = function () {
    const currentState = localStorage.getItem(STORAGE_KEY) === 'true';
    const newState = !currentState;
    localStorage.setItem(STORAGE_KEY, newState ? 'true' : 'false');
    applySidebarState(newState, true);
  };

  // Lắng nghe khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initSidebarState());
  } else {
    initSidebarState();
  }
})();
