/**
 * Settings Page - REIJI Admin
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    renderGeneralTab();
    renderCategoriesTab();
    renderDisplayTab();
    renderAccountTab();
  });

  /* ---- Tab Switching ---- */
  function initTabs() {
    var tabs = document.querySelectorAll('.admin-tab[data-tab]');
    var contents = document.querySelectorAll('.admin-tab-content[data-tab-content]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');

        tabs.forEach(function (t) { t.classList.remove('active'); });
        contents.forEach(function (c) { c.classList.remove('active'); });

        tab.classList.add('active');
        var targetContent = document.querySelector('.admin-tab-content[data-tab-content="' + target + '"]');
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  /* ---- Tab 1: General ---- */
  function renderGeneralTab() {
    var siteNameInput = document.getElementById('settingSiteName');
    var maintenanceToggle = document.getElementById('settingMaintenance');
    var siteDescInput = document.getElementById('settingSiteDesc');

    if (siteNameInput) siteNameInput.value = 'REIJI';
    if (maintenanceToggle) maintenanceToggle.checked = false;
    if (siteDescInput) siteDescInput.value = '投資損益を記録・共有するプラットフォーム';

    var generalSaveBtn = document.getElementById('generalSaveBtn');
    if (generalSaveBtn) {
      generalSaveBtn.addEventListener('click', function () {
        showToast('一般設定を保存しました');
      });
    }

    var lineSaveBtn = document.getElementById('lineSaveBtn');
    if (lineSaveBtn) {
      lineSaveBtn.addEventListener('click', function () {
        showToast('LINE設定を保存しました');
      });
    }
  }

  /* ---- Tab 2: Categories ---- */
  function renderCategoriesTab() {
    var container = document.getElementById('categoriesList');
    if (!container) return;

    container.innerHTML = MOCK_CATEGORIES.map(function (cat) {
      return '<div class="settings-category-item" data-id="' + cat.id + '">' +
        '<span class="settings-category-color" style="background: var(' + cat.colorVar + ')"></span>' +
        '<span class="settings-category-name">' + cat.name + '</span>' +
        '<div class="settings-category-actions">' +
          '<button class="btn-icon" title="編集" data-action="edit" data-id="' + cat.id + '">' +
            '<i class="fa-solid fa-pen"></i>' +
          '</button>' +
          '<button class="btn-icon" title="削除" data-action="delete" data-id="' + cat.id + '">' +
            '<i class="fa-solid fa-trash"></i>' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    container.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      var id = btn.getAttribute('data-id');
      var cat = MOCK_CATEGORIES.find(function (c) { return c.id === id; });
      if (!cat) return;

      if (action === 'edit') {
        showToast(cat.name + ' の編集ダイアログを開きます（モック）');
      } else if (action === 'delete') {
        showToast(cat.name + ' を削除しますか？（モック）');
      }
    });

    var addCatBtn = document.getElementById('addCategoryBtn');
    if (addCatBtn) {
      addCatBtn.addEventListener('click', function () {
        showToast('カテゴリ追加ダイアログを開きます（モック）');
      });
    }
  }

  /* ---- Tab 3: Display ---- */
  function renderDisplayTab() {
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    var lightRadio = document.getElementById('themeLight');
    var darkRadio = document.getElementById('themeDark');

    if (lightRadio && darkRadio) {
      if (currentTheme === 'dark') {
        darkRadio.checked = true;
      } else {
        lightRadio.checked = true;
      }
    }

    var currencySelect = document.getElementById('settingCurrency');
    if (currencySelect) currencySelect.value = 'jpy';

    var dateFormatSelect = document.getElementById('settingDateFormat');
    if (dateFormatSelect) dateFormatSelect.value = 'yyyy/mm/dd';

    var displaySaveBtn = document.getElementById('displaySaveBtn');
    if (displaySaveBtn) {
      displaySaveBtn.addEventListener('click', function () {
        showToast('表示設定を保存しました');
      });
    }
  }

  /* ---- Tab 4: Account ---- */
  function renderAccountTab() {
    var adminNameInput = document.getElementById('settingAdminName');
    var adminEmailInput = document.getElementById('settingAdminEmail');

    if (adminNameInput) adminNameInput.value = '管理者A';
    if (adminEmailInput) adminEmailInput.value = 'admin-a@reiji.jp';

    // Admin users list
    var adminListContainer = document.getElementById('adminUsersList');
    if (adminListContainer) {
      adminListContainer.innerHTML = MOCK_ADMIN_USERS.map(function (user) {
        return '<div class="settings-admin-item">' +
          '<div class="avatar avatar-sm">' +
            '<img src="assets/img/avatars/default.svg" alt="">' +
          '</div>' +
          '<div class="settings-admin-info">' +
            '<div class="settings-admin-name">' + user.name + '</div>' +
            '<div class="settings-admin-email">' + user.email + '</div>' +
          '</div>' +
          '<div class="settings-admin-meta">' +
            '<div class="settings-admin-role">' + user.role + '</div>' +
            '<div class="settings-admin-login">最終ログイン: ' + formatDateTime(user.lastLogin) + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // Profile save
    var profileSaveBtn = document.getElementById('profileSaveBtn');
    if (profileSaveBtn) {
      profileSaveBtn.addEventListener('click', function () {
        showToast('プロフィールを保存しました');
      });
    }

    // Password change
    var passwordSaveBtn = document.getElementById('passwordSaveBtn');
    if (passwordSaveBtn) {
      passwordSaveBtn.addEventListener('click', function () {
        showToast('パスワードを変更しました');
      });
    }

    // Danger zone
    var exportBtn = document.getElementById('dangerExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        showToast('データエクスポートを開始します（モック）');
      });
    }

    var deleteAccountBtn = document.getElementById('dangerDeleteBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', function () {
        showToast('アカウント削除の確認ダイアログを開きます（モック）');
      });
    }
  }

  /* ---- Toast Helper ---- */
  function showToast(message) {
    var existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'admin-toast success';
    toast.innerHTML = '<i class="fa-solid fa-check-circle" style="color:var(--color-success)"></i>' +
      '<span>' + message + '</span>';
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }
})();
