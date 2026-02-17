/**
 * Sites Management Page - REIJI Admin
 */
(function () {
  var nextCatId = 100;
  var nextSiteId = 1000;

  document.addEventListener('DOMContentLoaded', function () {
    renderCategories();
    bindEvents();
  });

  /* ---- Render All Category Cards ---- */
  function renderCategories() {
    var container = document.getElementById('sitesContainer');
    if (!container) return;

    if (!MOCK_USEFUL_SITES || MOCK_USEFUL_SITES.length === 0) {
      container.innerHTML = '<div class="empty-state">' +
        '<i class="fa-solid fa-globe"></i>' +
        '<p>カテゴリがまだ登録されていません</p>' +
      '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < MOCK_USEFUL_SITES.length; i++) {
      var cat = MOCK_USEFUL_SITES[i];
      html += renderCategoryCard(cat);
    }
    container.innerHTML = html;
  }

  /* ---- Render Single Category Card ---- */
  function renderCategoryCard(cat) {
    var html = '<div class="sites-category-card" data-cat-id="' + cat.id + '">';

    // Header
    html += '<div class="sites-category-header">';
    html += '<i class="fa-solid ' + escapeHtml(cat.icon) + ' sites-category-icon"></i>';
    html += '<span class="sites-category-name">' + escapeHtml(cat.name) + '</span>';
    html += '<div class="sites-category-actions">';
    html += '<button class="btn btn-sm btn-secondary" onclick="SiteActions.toggleAddForm(' + cat.id + ')" title="サイトを追加">';
    html += '<i class="fa-solid fa-plus"></i> サイトを追加';
    html += '</button>';
    html += '<button class="btn-icon" onclick="SiteActions.removeCategory(' + cat.id + ')" title="カテゴリを削除">';
    html += '<i class="fa-solid fa-trash"></i>';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    // Sites list
    html += '<div class="sites-list" data-cat-id="' + cat.id + '">';
    if (cat.items && cat.items.length > 0) {
      for (var j = 0; j < cat.items.length; j++) {
        var site = cat.items[j];
        html += '<div class="sites-list-item" data-site-id="' + site.id + '">';
        html += '<span class="sites-item-name">' + escapeHtml(site.label) + '</span>';
        html += '<span class="sites-item-url">' + escapeHtml(site.url) + '</span>';
        html += '<div class="sites-item-actions">';
        html += '<button class="btn-icon" onclick="SiteActions.editSite(' + cat.id + ',' + site.id + ')" title="編集">';
        html += '<i class="fa-solid fa-pen"></i>';
        html += '</button>';
        html += '<button class="btn-icon" onclick="SiteActions.removeSite(' + cat.id + ',' + site.id + ')" title="削除">';
        html += '<i class="fa-solid fa-trash"></i>';
        html += '</button>';
        html += '</div>';
        html += '</div>';
      }
    } else {
      html += '<div class="sites-list-empty">サイトが登録されていません</div>';
    }
    html += '</div>';

    // Inline add form (hidden)
    html += '<div class="sites-add-form" id="addForm-' + cat.id + '">';
    html += '<input type="text" class="form-input sites-add-form-name" id="addName-' + cat.id + '" placeholder="サイト名">';
    html += '<input type="text" class="form-input sites-add-form-url" id="addUrl-' + cat.id + '" placeholder="URL (https://...)">';
    html += '<div class="sites-add-form-actions">';
    html += '<button class="btn btn-sm btn-primary" onclick="SiteActions.addSite(' + cat.id + ')">';
    html += '<i class="fa-solid fa-check"></i> 保存';
    html += '</button>';
    html += '<button class="btn btn-sm btn-ghost" onclick="SiteActions.toggleAddForm(' + cat.id + ')">';
    html += '<i class="fa-solid fa-times"></i> キャンセル';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  /* ---- Bind Top-Level Events ---- */
  function bindEvents() {
    // Add category button
    var addCatBtn = document.getElementById('addCategoryBtn');
    if (addCatBtn) {
      addCatBtn.addEventListener('click', function () {
        var form = document.getElementById('addCategoryForm');
        if (form) {
          form.classList.toggle('open');
          if (form.classList.contains('open')) {
            var input = document.getElementById('newCategoryName');
            if (input) input.focus();
          }
        }
      });
    }

    // Save new category
    var saveCatBtn = document.getElementById('saveCategoryBtn');
    if (saveCatBtn) {
      saveCatBtn.addEventListener('click', function () {
        var input = document.getElementById('newCategoryName');
        if (!input) return;

        var name = input.value.trim();
        if (!name) {
          showToast('カテゴリ名を入力してください', 'error');
          return;
        }

        nextCatId++;
        MOCK_USEFUL_SITES.push({
          id: nextCatId,
          name: name,
          icon: 'fa-folder',
          items: []
        });

        input.value = '';
        var form = document.getElementById('addCategoryForm');
        if (form) form.classList.remove('open');

        renderCategories();
        showToast('カテゴリ「' + name + '」を追加しました');
      });
    }

    // Cancel add category
    var cancelCatBtn = document.getElementById('cancelCategoryBtn');
    if (cancelCatBtn) {
      cancelCatBtn.addEventListener('click', function () {
        var form = document.getElementById('addCategoryForm');
        if (form) form.classList.remove('open');
        var input = document.getElementById('newCategoryName');
        if (input) input.value = '';
      });
    }
  }

  /* ---- Exposed Actions ---- */
  window.SiteActions = {
    toggleAddForm: function (catId) {
      var form = document.getElementById('addForm-' + catId);
      if (form) {
        form.classList.toggle('open');
        if (form.classList.contains('open')) {
          var nameInput = document.getElementById('addName-' + catId);
          if (nameInput) nameInput.focus();
        }
      }
    },

    addSite: function (catId) {
      var nameInput = document.getElementById('addName-' + catId);
      var urlInput = document.getElementById('addUrl-' + catId);
      if (!nameInput || !urlInput) return;

      var label = nameInput.value.trim();
      var url = urlInput.value.trim();

      if (!label) {
        showToast('サイト名を入力してください', 'error');
        return;
      }
      if (!url) {
        showToast('URLを入力してください', 'error');
        return;
      }

      var cat = findCategory(catId);
      if (!cat) return;

      nextSiteId++;
      cat.items.push({ id: nextSiteId, label: label, url: url });

      renderCategories();
      showToast('サイト「' + label + '」を追加しました');
    },

    removeSite: function (catId, siteId) {
      var cat = findCategory(catId);
      if (!cat) return;

      var siteIndex = -1;
      var siteName = '';
      for (var i = 0; i < cat.items.length; i++) {
        if (cat.items[i].id === siteId) {
          siteIndex = i;
          siteName = cat.items[i].label;
          break;
        }
      }

      if (siteIndex === -1) return;

      if (!confirm('「' + siteName + '」を削除しますか？')) return;

      cat.items.splice(siteIndex, 1);
      renderCategories();
      showToast('サイト「' + siteName + '」を削除しました');
    },

    editSite: function (catId, siteId) {
      var cat = findCategory(catId);
      if (!cat) return;

      var site = null;
      for (var i = 0; i < cat.items.length; i++) {
        if (cat.items[i].id === siteId) {
          site = cat.items[i];
          break;
        }
      }
      if (!site) return;

      // Find the list item and replace with edit form
      var listItem = document.querySelector('.sites-list-item[data-site-id="' + siteId + '"]');
      if (!listItem) return;

      var editHtml = '<div class="sites-edit-form" data-edit-site-id="' + siteId + '">';
      editHtml += '<input type="text" class="form-input sites-edit-form-name" id="editName-' + siteId + '" value="' + escapeAttr(site.label) + '" placeholder="サイト名">';
      editHtml += '<input type="text" class="form-input sites-edit-form-url" id="editUrl-' + siteId + '" value="' + escapeAttr(site.url) + '" placeholder="URL">';
      editHtml += '<div class="sites-edit-form-actions">';
      editHtml += '<button class="btn btn-sm btn-primary" onclick="SiteActions.saveEdit(' + catId + ',' + siteId + ')">';
      editHtml += '<i class="fa-solid fa-check"></i> 保存';
      editHtml += '</button>';
      editHtml += '<button class="btn btn-sm btn-ghost" onclick="SiteActions.cancelEdit()">';
      editHtml += '<i class="fa-solid fa-times"></i> キャンセル';
      editHtml += '</button>';
      editHtml += '</div>';
      editHtml += '</div>';

      listItem.outerHTML = editHtml;

      var nameInput = document.getElementById('editName-' + siteId);
      if (nameInput) nameInput.focus();
    },

    saveEdit: function (catId, siteId) {
      var nameInput = document.getElementById('editName-' + siteId);
      var urlInput = document.getElementById('editUrl-' + siteId);
      if (!nameInput || !urlInput) return;

      var label = nameInput.value.trim();
      var url = urlInput.value.trim();

      if (!label) {
        showToast('サイト名を入力してください', 'error');
        return;
      }
      if (!url) {
        showToast('URLを入力してください', 'error');
        return;
      }

      var cat = findCategory(catId);
      if (!cat) return;

      for (var i = 0; i < cat.items.length; i++) {
        if (cat.items[i].id === siteId) {
          cat.items[i].label = label;
          cat.items[i].url = url;
          break;
        }
      }

      renderCategories();
      showToast('サイト「' + label + '」を更新しました');
    },

    cancelEdit: function () {
      renderCategories();
    },

    removeCategory: function (catId) {
      var cat = findCategory(catId);
      if (!cat) return;

      if (!confirm('カテゴリ「' + cat.name + '」とその中のサイトをすべて削除しますか？')) return;

      var catIndex = -1;
      for (var i = 0; i < MOCK_USEFUL_SITES.length; i++) {
        if (MOCK_USEFUL_SITES[i].id === catId) {
          catIndex = i;
          break;
        }
      }

      if (catIndex === -1) return;

      var name = MOCK_USEFUL_SITES[catIndex].name;
      MOCK_USEFUL_SITES.splice(catIndex, 1);
      renderCategories();
      showToast('カテゴリ「' + name + '」を削除しました');
    }
  };

  /* ---- Helpers ---- */
  function findCategory(catId) {
    for (var i = 0; i < MOCK_USEFUL_SITES.length; i++) {
      if (MOCK_USEFUL_SITES[i].id === catId) {
        return MOCK_USEFUL_SITES[i];
      }
    }
    return null;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function showToast(message, type) {
    var existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    var toastType = type || 'success';
    var iconClass = toastType === 'error' ? 'fa-circle-exclamation' : 'fa-check-circle';
    var iconColor = toastType === 'error' ? 'var(--color-danger)' : 'var(--color-success)';

    var toast = document.createElement('div');
    toast.className = 'admin-toast ' + toastType;
    toast.innerHTML = '<i class="fa-solid ' + iconClass + '" style="color:' + iconColor + '"></i>' +
      '<span>' + escapeHtml(message) + '</span>';
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }
})();
