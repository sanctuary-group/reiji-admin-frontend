/**
 * Users Page - REIJI Admin
 */
(function () {
  var STATUS_LABELS = {
    active: 'アクティブ',
    suspended: '停止中',
    deleted: '削除済み'
  };

  var currentSearchQuery = '';
  var currentStatusFilter = 'all';

  document.addEventListener('DOMContentLoaded', function () {
    renderUserTable();
    bindFilterEvents();
    bindModalEvents();
  });

  /* ---- Filtering ---- */
  function bindFilterEvents() {
    var searchInput = document.getElementById('userSearch');
    var statusSelect = document.getElementById('userStatusFilter');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentSearchQuery = this.value.trim().toLowerCase();
        renderUserTable();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        currentStatusFilter = this.value;
        renderUserTable();
      });
    }
  }

  function getFilteredUsers() {
    return MOCK_USERS.filter(function (user) {
      // Status filter
      if (currentStatusFilter !== 'all' && user.status !== currentStatusFilter) {
        return false;
      }

      // Search filter (name or email)
      if (currentSearchQuery) {
        var nameMatch = user.name.toLowerCase().indexOf(currentSearchQuery) !== -1;
        var emailMatch = user.email.toLowerCase().indexOf(currentSearchQuery) !== -1;
        if (!nameMatch && !emailMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /* ---- Table Rendering ---- */
  function renderUserTable() {
    var tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    var filtered = getFilteredUsers();

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-state" style="padding:var(--space-12) var(--space-6)">' +
        '<i class="fa-solid fa-users" style="display:block;font-size:var(--text-4xl);color:var(--text-tertiary);margin-bottom:var(--space-4)"></i>' +
        '<p>該当するユーザーが見つかりません</p>' +
        '</td></tr>';
      updatePaginationInfo(0);
      return;
    }

    tbody.innerHTML = filtered.map(function (user) {
      var avatarInitial = user.name.charAt(0);
      var pnlClass = user.pnlTotal >= 0 ? 'pnl-positive' : 'pnl-negative';
      var statusBadgeClass = user.status === 'active' ? 'badge-success' :
                              user.status === 'suspended' ? 'badge-warning' : 'badge-danger';

      return '<tr>' +
        '<td>' +
          '<div class="user-cell">' +
            '<div class="avatar avatar-sm" style="display:flex;align-items:center;justify-content:center;font-weight:var(--font-semibold);font-size:var(--text-xs);color:var(--text-secondary)">' +
              (user.avatar ? '<img src="' + user.avatar + '" alt="">' : avatarInitial) +
            '</div>' +
            '<div>' +
              '<div class="user-cell-name">' + user.name + '</div>' +
              '<div class="user-cell-email">' + user.email + '</div>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td>' + formatDate(user.registeredAt) + '</td>' +
        '<td><span class="status-dot ' + user.status + '">' + STATUS_LABELS[user.status] + '</span></td>' +
        '<td><span class="font-mono" style="font-size:var(--text-xs)">' + formatDateTime(user.lastLogin) + '</span></td>' +
        '<td><span class="' + pnlClass + '">' + formatYen(user.pnlTotal) + '</span></td>' +
        '<td>' +
          '<div class="actions-cell">' +
            '<button class="btn btn-ghost btn-sm" data-action="detail" data-user-id="' + user.id + '" title="詳細">' +
              '<i class="fa-solid fa-eye"></i>' +
            '</button>' +
            (user.status === 'active' ?
              '<button class="btn btn-ghost btn-sm" data-action="suspend" data-user-id="' + user.id + '" title="停止" style="color:var(--color-warning)">' +
                '<i class="fa-solid fa-ban"></i>' +
              '</button>' : '') +
            (user.status !== 'deleted' ?
              '<button class="btn btn-ghost btn-sm" data-action="delete" data-user-id="' + user.id + '" title="削除" style="color:var(--color-danger)">' +
                '<i class="fa-solid fa-trash"></i>' +
              '</button>' : '') +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    updatePaginationInfo(filtered.length);
    bindRowActions();
  }

  function updatePaginationInfo(count) {
    var info = document.getElementById('paginationInfo');
    if (info) {
      info.textContent = '全 ' + formatNumber(count) + ' 件';
    }
  }

  /* ---- Row Actions ---- */
  function bindRowActions() {
    var tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;

      var action = btn.getAttribute('data-action');
      var userId = parseInt(btn.getAttribute('data-user-id'), 10);
      var user = MOCK_USERS.find(function (u) { return u.id === userId; });
      if (!user) return;

      if (action === 'detail') {
        openUserDetail(user);
      } else if (action === 'suspend') {
        if (confirm(user.name + ' を停止しますか？')) {
          user.status = 'suspended';
          renderUserTable();
          showToast(user.name + ' を停止しました', 'warning');
        }
      } else if (action === 'delete') {
        if (confirm(user.name + ' を削除しますか？この操作は取り消せません。')) {
          user.status = 'deleted';
          renderUserTable();
          showToast(user.name + ' を削除しました', 'error');
        }
      }
    });
  }

  /* ---- User Detail Modal ---- */
  function openUserDetail(user) {
    var overlay = document.getElementById('userDetailModal');
    if (!overlay) return;

    var avatarInitial = user.name.charAt(0);
    var pnlClass = user.pnlTotal >= 0 ? 'profit' : 'loss';
    var statusBadgeClass = user.status === 'active' ? 'badge-success' :
                            user.status === 'suspended' ? 'badge-warning' : 'badge-danger';

    var body = document.getElementById('userDetailBody');
    if (!body) return;

    body.innerHTML =
      // Profile header
      '<div class="user-detail-profile">' +
        '<div class="avatar avatar-lg" style="display:flex;align-items:center;justify-content:center;font-weight:var(--font-bold);font-size:var(--text-xl);color:var(--text-secondary)">' +
          (user.avatar ? '<img src="' + user.avatar + '" alt="">' : avatarInitial) +
        '</div>' +
        '<div class="user-detail-profile-info">' +
          '<div class="user-detail-profile-name">' + user.name + '</div>' +
          '<div class="user-detail-profile-email">' + user.email + '</div>' +
          '<div style="margin-top:var(--space-2)"><span class="badge ' + statusBadgeClass + '">' + STATUS_LABELS[user.status] + '</span></div>' +
        '</div>' +
      '</div>' +

      // Stats
      '<div class="user-detail-stats">' +
        '<div class="user-detail-stat">' +
          '<div class="user-detail-stat-label">総損益</div>' +
          '<div class="user-detail-stat-value ' + pnlClass + '">' + formatYen(user.pnlTotal) + '</div>' +
        '</div>' +
        '<div class="user-detail-stat">' +
          '<div class="user-detail-stat-label">取引回数</div>' +
          '<div class="user-detail-stat-value">' + formatNumber(user.tradeCount) + '</div>' +
        '</div>' +
      '</div>' +

      // Detail sections
      '<div class="user-detail-grid">' +
        '<div class="user-detail-section">' +
          '<div class="user-detail-section-title">アカウント情報</div>' +
          '<div class="user-detail-row">' +
            '<span class="user-detail-row-label">ユーザーID</span>' +
            '<span class="user-detail-row-value">#' + user.id + '</span>' +
          '</div>' +
          '<div class="user-detail-row">' +
            '<span class="user-detail-row-label">登録日</span>' +
            '<span class="user-detail-row-value">' + formatDate(user.registeredAt) + '</span>' +
          '</div>' +
          '<div class="user-detail-row">' +
            '<span class="user-detail-row-label">最終ログイン</span>' +
            '<span class="user-detail-row-value">' + formatDateTime(user.lastLogin) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="user-detail-section">' +
          '<div class="user-detail-section-title">取引サマリー</div>' +
          '<div class="user-detail-row">' +
            '<span class="user-detail-row-label">総損益</span>' +
            '<span class="user-detail-row-value ' + (user.pnlTotal >= 0 ? 'pnl-positive' : 'pnl-negative') + '">' + formatYen(user.pnlTotal) + '</span>' +
          '</div>' +
          '<div class="user-detail-row">' +
            '<span class="user-detail-row-label">取引回数</span>' +
            '<span class="user-detail-row-value">' + formatNumber(user.tradeCount) + '</span>' +
          '</div>' +
          '<div class="user-detail-row">' +
            '<span class="user-detail-row-label">ステータス</span>' +
            '<span class="user-detail-row-value"><span class="status-dot ' + user.status + '">' + STATUS_LABELS[user.status] + '</span></span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Actions
      '<div class="user-status-actions">' +
        (user.status === 'active' ?
          '<button class="btn btn-secondary btn-sm" data-modal-action="suspend" data-user-id="' + user.id + '">' +
            '<i class="fa-solid fa-ban"></i> アカウント停止' +
          '</button>' : '') +
        (user.status === 'suspended' ?
          '<button class="btn btn-secondary btn-sm" data-modal-action="activate" data-user-id="' + user.id + '">' +
            '<i class="fa-solid fa-check"></i> アカウント復旧' +
          '</button>' : '') +
        (user.status !== 'deleted' ?
          '<button class="btn btn-danger btn-sm" data-modal-action="delete" data-user-id="' + user.id + '">' +
            '<i class="fa-solid fa-trash"></i> アカウント削除' +
          '</button>' : '') +
      '</div>';

    // Bind modal action buttons
    bindModalActions(overlay, user);

    overlay.classList.add('open');
  }

  function bindModalActions(overlay, user) {
    var body = document.getElementById('userDetailBody');
    if (!body) return;

    body.addEventListener('click', function handler(e) {
      var btn = e.target.closest('[data-modal-action]');
      if (!btn) return;

      var action = btn.getAttribute('data-modal-action');
      var userId = parseInt(btn.getAttribute('data-user-id'), 10);
      var targetUser = MOCK_USERS.find(function (u) { return u.id === userId; });
      if (!targetUser) return;

      if (action === 'suspend') {
        if (confirm(targetUser.name + ' を停止しますか？')) {
          targetUser.status = 'suspended';
          closeModal();
          renderUserTable();
          showToast(targetUser.name + ' を停止しました', 'warning');
        }
      } else if (action === 'activate') {
        targetUser.status = 'active';
        closeModal();
        renderUserTable();
        showToast(targetUser.name + ' を復旧しました', 'success');
      } else if (action === 'delete') {
        if (confirm(targetUser.name + ' を削除しますか？この操作は取り消せません。')) {
          targetUser.status = 'deleted';
          closeModal();
          renderUserTable();
          showToast(targetUser.name + ' を削除しました', 'error');
        }
      }

      body.removeEventListener('click', handler);
    });
  }

  /* ---- Modal Open / Close ---- */
  function bindModalEvents() {
    var overlay = document.getElementById('userDetailModal');
    if (!overlay) return;

    // Close on X button
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    var overlay = document.getElementById('userDetailModal');
    if (overlay) {
      overlay.classList.remove('open');
    }
  }

  /* ---- Toast Notification ---- */
  function showToast(message, type) {
    // Remove any existing toast
    var existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    var iconMap = {
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      error: 'fa-circle-xmark'
    };

    var toast = document.createElement('div');
    toast.className = 'admin-toast ' + (type || 'success');
    toast.innerHTML = '<i class="fa-solid ' + (iconMap[type] || iconMap.success) + '"></i>' +
      '<span>' + message + '</span>';

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  }
})();
