/**
 * Admin Navigation - Sidebar & Mobile Menu
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var sidebar = document.querySelector('.admin-sidebar');
    var overlay = document.querySelector('.admin-sidebar-overlay');
    var toggleBtn = document.querySelector('.admin-sidebar-toggle');

    // Toggle sidebar
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var isMobile = window.innerWidth <= 768;
        if (isMobile) {
          sidebar.classList.toggle('open');
          overlay.classList.toggle('open');
          document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        } else {
          sidebar.classList.toggle('expanded');
          if (overlay) overlay.classList.toggle('open');
        }
      });
    }

    // Close sidebar on overlay click
    if (overlay) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('open', 'expanded');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close sidebar on nav item click (mobile)
    var navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Active nav item based on current URL
    var currentPath = window.location.pathname;
    var currentPage = currentPath.split('/').pop() || 'dashboard.html';
    navItems.forEach(function (item) {
      var href = item.getAttribute('href');
      if (href && (href === currentPage || (currentPage === '' && href === 'dashboard.html'))) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Handle window resize
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (window.innerWidth > 1024) {
        sidebar.classList.remove('expanded');
        if (overlay) overlay.classList.remove('open');
      }
    });

    // Escape key to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        sidebar.classList.remove('open', 'expanded');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
})();
