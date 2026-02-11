/**
 * Notifications Page - REIJI Admin
 */
(function () {
  var currentPage = 1;
  var perPage = 10;

  document.addEventListener('DOMContentLoaded', function () {
    renderNotificationsTable();
    bindCreateFormToggle();
    bindFormEvents();
  });

  /* ---- Render Notifications Table ---- */
  function renderNotificationsTable() {
    var tbody = document.getElementById('notifTableBody');
    if (!tbody) return;

    var data = MOCK_NOTIFICATIONS;
    var totalItems = data.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    var start = (currentPage - 1) * perPage;
    var end = Math.min(start + perPage, totalItems);
    var pageData = data.slice(start, end);

    if (pageData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state" style="padding:var(--space-8)">' +
        '<i class="fa-solid fa-bell-slash"></i>' +
        '<p>お知らせはまだありません</p>' +
        '</td></tr>';
      updatePagination(0, 0, 0, 1);
      return;
    }

    tbody.innerHTML = pageData.map(function (notif) {
      var sentAtDisplay = notif.sentAt ? formatDateTime(notif.sentAt) : '予定';
      var statusBadge = notif.status === 'sent'
        ? '<span class="badge badge-success">送信済み</span>'
        : '<span class="badge badge-info">予定</span>';

      var targetBadgeClass = notif.target === '全ユーザー' ? 'all-users' : '';

      return '<tr>' +
        '<td><span style="font-weight:var(--font-medium)">' + escapeHtml(notif.title) + '</span></td>' +
        '<td><span class="notif-target-badge ' + targetBadgeClass + '">' +
          '<i class="fa-solid ' + (notif.target === '全ユーザー' ? 'fa-users' : 'fa-user') + '"></i>' +
          escapeHtml(notif.target) +
        '</span></td>' +
        '<td><span class="font-mono" style="font-size:var(--text-xs)">' + sentAtDisplay + '</span></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td>' +
          '<div class="actions-cell">' +
            '<button class="btn-icon" title="詳細" onclick="NotifActions.view(' + notif.id + ')"><i class="fa-solid fa-eye"></i></button>' +
            '<button class="btn-icon" title="編集" onclick="NotifActions.edit(' + notif.id + ')"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="btn-icon" title="削除" onclick="NotifActions.remove(' + notif.id + ')" style="color:var(--color-danger)"><i class="fa-solid fa-trash"></i></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    updatePagination(start + 1, end, totalItems, totalPages);
  }

  /* ---- Pagination ---- */
  function updatePagination(from, to, total, totalPages) {
    var info = document.getElementById('notifPaginationInfo');
    var controls = document.getElementById('notifPaginationControls');
    if (!info || !controls) return;

    info.textContent = total > 0
      ? from + '〜' + to + '件 / ' + total + '件中'
      : '0件';

    var html = '';

    html += '<button class="admin-pagination-btn" ' +
      (currentPage <= 1 ? 'disabled' : '') +
      ' onclick="NotifActions.goPage(' + (currentPage - 1) + ')">' +
      '<i class="fa-solid fa-chevron-left"></i></button>';

    for (var i = 1; i <= totalPages; i++) {
      html += '<button class="admin-pagination-btn ' + (i === currentPage ? 'active' : '') + '" ' +
        'onclick="NotifActions.goPage(' + i + ')">' + i + '</button>';
    }

    html += '<button class="admin-pagination-btn" ' +
      (currentPage >= totalPages ? 'disabled' : '') +
      ' onclick="NotifActions.goPage(' + (currentPage + 1) + ')">' +
      '<i class="fa-solid fa-chevron-right"></i></button>';

    controls.innerHTML = html;
  }

  /* ---- Toggle Create Form ---- */
  function bindCreateFormToggle() {
    var btn = document.getElementById('createNotifBtn');
    var form = document.getElementById('createNotifForm');
    var closeBtn = document.getElementById('closeNotifForm');
    if (!btn || !form) return;

    btn.addEventListener('click', function () {
      var isOpen = form.classList.contains('open');
      if (isOpen) {
        form.classList.remove('open');
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> 新規作成';
      } else {
        form.classList.add('open');
        btn.innerHTML = '<i class="fa-solid fa-times"></i> 閉じる';
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        form.classList.remove('open');
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> 新規作成';
      });
    }
  }

  /* ---- Form Events ---- */
  function bindFormEvents() {
    var previewBtn = document.getElementById('notifPreviewBtn');
    var sendBtn = document.getElementById('notifSendBtn');
    var titleInput = document.getElementById('notifTitle');
    var bodyInput = document.getElementById('notifBody');
    var targetSelect = document.getElementById('notifTarget');

    // Preview
    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        var preview = document.getElementById('notifPreview');
        if (!preview) return;

        var title = titleInput ? titleInput.value.trim() : '';
        var body = bodyInput ? bodyInput.value.trim() : '';
        var target = targetSelect ? targetSelect.options[targetSelect.selectedIndex].text : '';

        if (!title) {
          showToast('タイトルを入力してください', 'warning');
          return;
        }

        var previewTitle = document.getElementById('notifPreviewTitle');
        var previewBody = document.getElementById('notifPreviewBody');
        var previewTarget = document.getElementById('notifPreviewTarget');

        if (previewTitle) previewTitle.textContent = title;
        if (previewBody) previewBody.textContent = body || '(本文なし)';
        if (previewTarget) previewTarget.textContent = target;

        preview.style.display = 'block';
      });
    }

    // Send
    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        var title = titleInput ? titleInput.value.trim() : '';
        var body = bodyInput ? bodyInput.value.trim() : '';

        if (!title) {
          showToast('タイトルを入力してください', 'warning');
          return;
        }
        if (!body) {
          showToast('本文を入力してください', 'warning');
          return;
        }

        var timing = document.querySelector('input[name="notifTiming"]:checked');
        var timingValue = timing ? timing.value : 'immediate';

        if (timingValue === 'immediate') {
          showToast('お知らせを送信しました', 'success');
        } else {
          showToast('お知らせをスケジュールしました', 'success');
        }

        // Reset form
        if (titleInput) titleInput.value = '';
        if (bodyInput) bodyInput.value = '';
        if (targetSelect) targetSelect.selectedIndex = 0;

        var preview = document.getElementById('notifPreview');
        if (preview) preview.style.display = 'none';

        var form = document.getElementById('createNotifForm');
        var btn = document.getElementById('createNotifBtn');
        if (form) form.classList.remove('open');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i> 新規作成';
      });
    }
  }

  /* ---- Toast ---- */
  function showToast(message, type) {
    // Remove existing toast
    var existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    var iconMap = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle'
    };

    var toast = document.createElement('div');
    toast.className = 'admin-toast ' + (type || 'success');
    toast.innerHTML = '<i class="fa-solid ' + (iconMap[type] || 'fa-info-circle') + '"></i>' +
      '<span>' + message + '</span>';
    document.body.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  /* ---- HTML Escape ---- */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ---- Expose Actions (for inline onclick) ---- */
  window.NotifActions = {
    view: function (id) {
      var notif = MOCK_NOTIFICATIONS.find(function (n) { return n.id === id; });
      if (!notif) return;
      showToast('「' + notif.title + '」の詳細を表示', 'success');
    },
    edit: function (id) {
      var notif = MOCK_NOTIFICATIONS.find(function (n) { return n.id === id; });
      if (!notif) return;
      showToast('「' + notif.title + '」を編集モードで開きます', 'success');
    },
    remove: function (id) {
      var notif = MOCK_NOTIFICATIONS.find(function (n) { return n.id === id; });
      if (!notif) return;
      if (confirm('「' + notif.title + '」を削除しますか？')) {
        showToast('お知らせを削除しました', 'success');
      }
    },
    goPage: function (page) {
      currentPage = page;
      renderNotificationsTable();
    }
  };
})();
