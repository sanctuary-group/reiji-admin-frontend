/**
 * Videos Page - REIJI Admin
 */
(function () {
  var currentPage = 1;
  var perPage = 10;

  document.addEventListener('DOMContentLoaded', function () {
    renderVideosTable();
    bindCreateFormToggle();
    bindFormEvents();
  });

  /* ---- Render Videos Table ---- */
  function renderVideosTable() {
    var tbody = document.getElementById('videoTableBody');
    if (!tbody) return;

    var data = MOCK_VIDEOS;
    var totalItems = data.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    var start = (currentPage - 1) * perPage;
    var end = Math.min(start + perPage, totalItems);
    var pageData = data.slice(start, end);

    if (pageData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="padding:var(--space-8)">' +
        '<i class="fa-solid fa-video-slash"></i>' +
        '<p>動画はまだありません</p>' +
        '</td></tr>';
      updatePagination(0, 0, 0, 1);
      return;
    }

    tbody.innerHTML = pageData.map(function (video) {
      var statusBadge = video.status === 'published'
        ? '<span class="badge badge-success">公開中</span>'
        : '<span class="badge badge-info">下書き</span>';

      return '<tr>' +
        '<td><span class="video-thumb-cell" style="background:' + escapeHtml(video.bgColor) + '"></span></td>' +
        '<td><span style="font-weight:var(--font-medium)">' + escapeHtml(video.title) + '</span></td>' +
        '<td><a href="' + escapeHtml(video.url) + '" target="_blank" rel="noopener" style="color:var(--color-primary);font-size:var(--text-xs)">' + escapeHtml(video.url) + '</a></td>' +
        '<td><span class="font-mono" style="font-size:var(--text-xs)">' + escapeHtml(video.date) + '</span></td>' +
        '<td><span style="font-size:var(--text-sm)">' + escapeHtml(video.views) + '</span></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td>' +
          '<div class="actions-cell">' +
            '<button class="btn-icon" title="詳細" onclick="VideoActions.view(' + video.id + ')"><i class="fa-solid fa-eye"></i></button>' +
            '<button class="btn-icon" title="編集" onclick="VideoActions.edit(' + video.id + ')"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="btn-icon" title="削除" onclick="VideoActions.remove(' + video.id + ')" style="color:var(--color-danger)"><i class="fa-solid fa-trash"></i></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    updatePagination(start + 1, end, totalItems, totalPages);
  }

  /* ---- Pagination ---- */
  function updatePagination(from, to, total, totalPages) {
    var info = document.getElementById('videoPaginationInfo');
    var controls = document.getElementById('videoPaginationControls');
    if (!info || !controls) return;

    info.textContent = total > 0
      ? from + '〜' + to + '件 / ' + total + '件中'
      : '0件';

    var html = '';

    html += '<button class="admin-pagination-btn" ' +
      (currentPage <= 1 ? 'disabled' : '') +
      ' onclick="VideoActions.goPage(' + (currentPage - 1) + ')">' +
      '<i class="fa-solid fa-chevron-left"></i></button>';

    for (var i = 1; i <= totalPages; i++) {
      html += '<button class="admin-pagination-btn ' + (i === currentPage ? 'active' : '') + '" ' +
        'onclick="VideoActions.goPage(' + i + ')">' + i + '</button>';
    }

    html += '<button class="admin-pagination-btn" ' +
      (currentPage >= totalPages ? 'disabled' : '') +
      ' onclick="VideoActions.goPage(' + (currentPage + 1) + ')">' +
      '<i class="fa-solid fa-chevron-right"></i></button>';

    controls.innerHTML = html;
  }

  /* ---- Toggle Create Form ---- */
  function bindCreateFormToggle() {
    var btn = document.getElementById('createVideoBtn');
    var form = document.getElementById('createVideoForm');
    var closeBtn = document.getElementById('closeVideoForm');
    if (!btn || !form) return;

    btn.addEventListener('click', function () {
      var isOpen = form.classList.contains('open');
      if (isOpen) {
        form.classList.remove('open');
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> 動画を追加';
      } else {
        form.classList.add('open');
        btn.innerHTML = '<i class="fa-solid fa-times"></i> 閉じる';
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        form.classList.remove('open');
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> 動画を追加';
      });
    }
  }

  /* ---- Form Events ---- */
  function bindFormEvents() {
    var saveBtn = document.getElementById('videoSaveBtn');
    var titleInput = document.getElementById('videoTitle');
    var urlInput = document.getElementById('videoUrl');
    var colorInput = document.getElementById('videoColor');
    var dateInput = document.getElementById('videoDate');
    var swatches = document.querySelectorAll('.video-color-swatch');

    // Color swatch click
    for (var i = 0; i < swatches.length; i++) {
      (function (swatch) {
        swatch.addEventListener('click', function () {
          var color = swatch.getAttribute('data-color');
          if (colorInput) colorInput.value = color;

          // Update active state
          for (var j = 0; j < swatches.length; j++) {
            swatches[j].classList.remove('active');
          }
          swatch.classList.add('active');
        });
      })(swatches[i]);
    }

    // Color input change syncs swatches
    if (colorInput) {
      colorInput.addEventListener('input', function () {
        var val = colorInput.value.toLowerCase();
        for (var j = 0; j < swatches.length; j++) {
          if (swatches[j].getAttribute('data-color') === val) {
            swatches[j].classList.add('active');
          } else {
            swatches[j].classList.remove('active');
          }
        }
      });
    }

    // Save
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var title = titleInput ? titleInput.value.trim() : '';
        var url = urlInput ? urlInput.value.trim() : '';

        if (!title) {
          showToast('タイトルを入力してください', 'warning');
          return;
        }
        if (!url) {
          showToast('動画URLを入力してください', 'warning');
          return;
        }

        showToast('動画を保存しました', 'success');

        // Reset form
        if (titleInput) titleInput.value = '';
        if (urlInput) urlInput.value = '';
        if (colorInput) colorInput.value = '#ef4444';
        if (dateInput) dateInput.value = '';
        for (var j = 0; j < swatches.length; j++) {
          swatches[j].classList.remove('active');
        }

        var form = document.getElementById('createVideoForm');
        var btn = document.getElementById('createVideoBtn');
        if (form) form.classList.remove('open');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-plus"></i> 動画を追加';
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
  window.VideoActions = {
    view: function (id) {
      var video = MOCK_VIDEOS.find(function (v) { return v.id === id; });
      if (!video) return;
      showToast('「' + video.title + '」の詳細を表示', 'success');
    },
    edit: function (id) {
      var video = MOCK_VIDEOS.find(function (v) { return v.id === id; });
      if (!video) return;
      showToast('「' + video.title + '」を編集モードで開きます', 'success');
    },
    remove: function (id) {
      var video = MOCK_VIDEOS.find(function (v) { return v.id === id; });
      if (!video) return;
      if (confirm('「' + video.title + '」を削除しますか？')) {
        showToast('動画を削除しました', 'success');
      }
    },
    goPage: function (page) {
      currentPage = page;
      renderVideosTable();
    }
  };
})();
