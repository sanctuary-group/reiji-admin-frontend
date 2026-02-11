/**
 * Posts Page - REIJI Admin
 */
(function () {
  var ITEMS_PER_PAGE = 10;
  var currentPage = 1;
  var filteredPosts = [];

  document.addEventListener('DOMContentLoaded', function () {
    populateCategoryFilter();
    applyFilters();
    bindEvents();
  });

  /* ---- Event Bindings ---- */
  function bindEvents() {
    var searchInput = document.getElementById('postSearch');
    var statusFilter = document.getElementById('postStatusFilter');
    var categoryFilter = document.getElementById('postCategoryFilter');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentPage = 1;
        applyFilters();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', function () {
        currentPage = 1;
        applyFilters();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', function () {
        currentPage = 1;
        applyFilters();
      });
    }
  }

  /* ---- Populate Category Filter ---- */
  function populateCategoryFilter() {
    var select = document.getElementById('postCategoryFilter');
    if (!select) return;

    MOCK_CATEGORIES.forEach(function (cat) {
      var option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  }

  /* ---- Filtering ---- */
  function applyFilters() {
    var searchInput = document.getElementById('postSearch');
    var statusFilter = document.getElementById('postStatusFilter');
    var categoryFilter = document.getElementById('postCategoryFilter');

    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var statusValue = statusFilter ? statusFilter.value : 'all';
    var categoryValue = categoryFilter ? categoryFilter.value : 'all';

    filteredPosts = MOCK_POSTS.filter(function (post) {
      // Search by title or author
      var title = (post.title || post.name || '').toLowerCase();
      var author = (post.author || '').toLowerCase();
      var matchesSearch = !query || title.indexOf(query) !== -1 || author.indexOf(query) !== -1;

      // Status filter
      var matchesStatus = statusValue === 'all' || post.status === statusValue;

      // Category filter
      var matchesCategory = categoryValue === 'all' || post.category === categoryValue;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    renderTable();
    renderPagination();
  }

  /* ---- Table Rendering ---- */
  function renderTable() {
    var tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var end = start + ITEMS_PER_PAGE;
    var pagePosts = filteredPosts.slice(start, end);

    if (pagePosts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state" style="padding:var(--space-12) var(--space-6)">' +
        '<i class="fa-solid fa-newspaper" style="display:block;font-size:var(--text-4xl);color:var(--text-tertiary);margin-bottom:var(--space-4)"></i>' +
        '<p>該当する投稿が見つかりません</p></td></tr>';
      return;
    }

    tbody.innerHTML = pagePosts.map(function (post) {
      var postTitle = post.title || post.name || '(無題)';
      var category = getCategoryById(post.category);
      var categoryName = category ? category.name : post.category;
      var categoryCss = category ? category.cssClass : '';

      return '<tr>' +
        '<td>' +
          '<div class="post-title-cell">' +
            '<span class="post-title-text">' + escapeHtml(postTitle) + '</span>' +
          '</div>' +
        '</td>' +
        '<td>' + escapeHtml(post.author) + '</td>' +
        '<td><span class="category-tag ' + categoryCss + '">' + escapeHtml(categoryName) + '</span></td>' +
        '<td><span class="font-mono" style="font-size:var(--text-xs)">' + formatDateTime(post.createdAt) + '</span></td>' +
        '<td>' + renderStatusBadge(post.status) + '</td>' +
        '<td>' +
          '<div class="actions-cell">' +
            '<button class="btn-icon" title="詳細を見る" onclick="PostsPage.viewPost(' + post.id + ')">' +
              '<i class="fa-solid fa-eye"></i>' +
            '</button>' +
            renderFlagButton(post) +
            '<button class="btn-icon" title="削除" onclick="PostsPage.deletePost(' + post.id + ')" style="color:var(--color-danger)">' +
              '<i class="fa-solid fa-trash"></i>' +
            '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  /* ---- Status Badge ---- */
  function renderStatusBadge(status) {
    var map = {
      published: { css: 'badge-success', label: '公開' },
      draft: { css: 'badge-neutral', label: '下書き' },
      flagged: { css: 'badge-danger', label: 'フラグ付き' }
    };
    var info = map[status] || { css: 'badge-neutral', label: status };
    return '<span class="badge ' + info.css + '">' + info.label + '</span>';
  }

  /* ---- Flag / Unflag Button ---- */
  function renderFlagButton(post) {
    if (post.status === 'flagged') {
      return '<button class="btn-icon" title="フラグ解除" onclick="PostsPage.unflagPost(' + post.id + ')" style="color:var(--color-warning)">' +
        '<i class="fa-solid fa-flag"></i>' +
      '</button>';
    }
    return '<button class="btn-icon" title="フラグを付ける" onclick="PostsPage.flagPost(' + post.id + ')">' +
      '<i class="fa-regular fa-flag"></i>' +
    '</button>';
  }

  /* ---- Pagination ---- */
  function renderPagination() {
    var info = document.getElementById('postsPaginationInfo');
    var controls = document.getElementById('postsPaginationControls');
    if (!info || !controls) return;

    var total = filteredPosts.length;
    var totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    var start = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    var end = Math.min(currentPage * ITEMS_PER_PAGE, total);

    info.textContent = total + '件中 ' + start + '-' + end + '件を表示';

    var buttons = '';

    // Previous
    buttons += '<button class="admin-pagination-btn" onclick="PostsPage.goToPage(' + (currentPage - 1) + ')"' +
      (currentPage <= 1 ? ' disabled' : '') + '>' +
      '<i class="fa-solid fa-chevron-left"></i></button>';

    // Page numbers
    for (var i = 1; i <= totalPages; i++) {
      buttons += '<button class="admin-pagination-btn' + (i === currentPage ? ' active' : '') + '" ' +
        'onclick="PostsPage.goToPage(' + i + ')">' + i + '</button>';
    }

    // Next
    buttons += '<button class="admin-pagination-btn" onclick="PostsPage.goToPage(' + (currentPage + 1) + ')"' +
      (currentPage >= totalPages ? ' disabled' : '') + '>' +
      '<i class="fa-solid fa-chevron-right"></i></button>';

    controls.innerHTML = buttons;
  }

  /* ---- Utility ---- */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function findPostById(id) {
    return MOCK_POSTS.find(function (p) { return p.id === id; });
  }

  function showToast(message, type) {
    // Remove existing toast
    var existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'admin-toast ' + (type || 'success');
    toast.innerHTML = '<i class="fa-solid ' + (type === 'error' ? 'fa-circle-xmark' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check') + '"></i> ' + message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  /* ---- Public API (for inline onclick handlers) ---- */
  window.PostsPage = {
    goToPage: function (page) {
      var totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      renderTable();
      renderPagination();
    },

    viewPost: function (id) {
      var post = findPostById(id);
      if (post) {
        var title = post.title || post.name || '(無題)';
        showToast('投稿「' + title + '」の詳細画面は準備中です', 'warning');
      }
    },

    flagPost: function (id) {
      var post = findPostById(id);
      if (post) {
        post.status = 'flagged';
        var title = post.title || post.name || '(無題)';
        showToast('投稿「' + title + '」にフラグを付けました', 'warning');
        applyFilters();
      }
    },

    unflagPost: function (id) {
      var post = findPostById(id);
      if (post) {
        post.status = 'published';
        var title = post.title || post.name || '(無題)';
        showToast('投稿「' + title + '」のフラグを解除しました', 'success');
        applyFilters();
      }
    },

    deletePost: function (id) {
      var post = findPostById(id);
      if (!post) return;
      var title = post.title || post.name || '(無題)';
      if (confirm('投稿「' + title + '」を削除してもよろしいですか？')) {
        var index = MOCK_POSTS.indexOf(post);
        if (index !== -1) {
          MOCK_POSTS.splice(index, 1);
        }
        showToast('投稿「' + title + '」を削除しました', 'success');
        applyFilters();
      }
    }
  };
})();
