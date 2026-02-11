/**
 * P&L Data Page - REIJI Admin
 */
(function () {
  var ITEMS_PER_PAGE = 10;
  var currentPage = 1;
  var filteredData = [];

  document.addEventListener('DOMContentLoaded', function () {
    renderSummaryKPI();
    renderCategoryBreakdown();
    setupFilters();
    applyFiltersAndRender();
  });

  /* ---- Summary KPI Cards ---- */
  function renderSummaryKPI() {
    var container = document.getElementById('pnlSummaryCards');
    if (!container) return;

    var totalTrades = MOCK_PNL_DATA.length;
    var totalAmount = MOCK_PNL_DATA.reduce(function (sum, d) { return sum + d.amount; }, 0);
    var positiveCount = MOCK_PNL_DATA.filter(function (d) { return d.amount > 0; }).length;
    var winRate = totalTrades > 0 ? (positiveCount / totalTrades) * 100 : 0;

    var uniqueUsers = {};
    MOCK_PNL_DATA.forEach(function (d) { uniqueUsers[d.userId] = true; });
    var activeTraders = Object.keys(uniqueUsers).length;

    var cards = [
      { label: '総取引数', value: formatNumber(totalTrades), icon: 'fa-receipt', iconClass: 'primary' },
      { label: 'プラットフォーム総損益', value: formatYen(totalAmount), icon: 'fa-chart-line', iconClass: 'info' },
      { label: '勝率', value: winRate.toFixed(1) + '%', icon: 'fa-trophy', iconClass: 'accent' },
      { label: 'アクティブトレーダー数', value: formatNumber(activeTraders), icon: 'fa-users', iconClass: 'success' }
    ];

    container.innerHTML = cards.map(function (card) {
      return '<div class="kpi-card">' +
        '<div class="kpi-card-icon ' + card.iconClass + '"><i class="fa-solid ' + card.icon + '"></i></div>' +
        '<div class="kpi-card-content">' +
          '<div class="kpi-card-label">' + card.label + '</div>' +
          '<div class="kpi-card-value">' + card.value + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---- Category Breakdown Cards ---- */
  function renderCategoryBreakdown() {
    var container = document.getElementById('pnlCategoryCards');
    if (!container) return;

    // Group by categoryId
    var categoryMap = {};
    MOCK_PNL_DATA.forEach(function (d) {
      if (!categoryMap[d.categoryId]) {
        categoryMap[d.categoryId] = { totalAmount: 0, count: 0 };
      }
      categoryMap[d.categoryId].totalAmount += d.amount;
      categoryMap[d.categoryId].count += 1;
    });

    container.innerHTML = MOCK_CATEGORIES.map(function (cat) {
      var data = categoryMap[cat.id] || { totalAmount: 0, count: 0 };
      return '<div class="pnl-category-card ' + cat.cssClass + '">' +
        '<div class="pnl-category-card-name">' + cat.name + '</div>' +
        '<div class="pnl-category-card-amount">' + formatYen(data.totalAmount) + '</div>' +
        '<div class="pnl-category-card-count">' + formatNumber(data.count) + ' 件の取引</div>' +
      '</div>';
    }).join('');
  }

  /* ---- Filters ---- */
  function setupFilters() {
    var searchInput = document.getElementById('pnlSearch');
    var periodSelect = document.getElementById('pnlPeriod');
    var categorySelect = document.getElementById('pnlCategory');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentPage = 1;
        applyFiltersAndRender();
      });
    }

    if (periodSelect) {
      periodSelect.addEventListener('change', function () {
        currentPage = 1;
        applyFiltersAndRender();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', function () {
        currentPage = 1;
        applyFiltersAndRender();
      });
    }
  }

  function getFilteredData() {
    var searchInput = document.getElementById('pnlSearch');
    var periodSelect = document.getElementById('pnlPeriod');
    var categorySelect = document.getElementById('pnlCategory');

    var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var period = periodSelect ? periodSelect.value : 'all';
    var categoryId = categorySelect ? categorySelect.value : 'all';

    var data = MOCK_PNL_DATA.slice();

    // Filter by search term (user name or comment)
    if (searchTerm) {
      data = data.filter(function (d) {
        return d.userName.toLowerCase().indexOf(searchTerm) !== -1 ||
               d.comment.toLowerCase().indexOf(searchTerm) !== -1;
      });
    }

    // Filter by period
    if (period !== 'all') {
      var now = new Date();
      var startDate;

      if (period === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (period === 'last_month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        var endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        data = data.filter(function (d) {
          var date = new Date(d.date);
          return date >= startDate && date <= endDate;
        });
        return filterByCategory(data, categoryId);
      } else if (period === 'this_year') {
        startDate = new Date(now.getFullYear(), 0, 1);
      }

      if (startDate) {
        data = data.filter(function (d) {
          return new Date(d.date) >= startDate;
        });
      }
    }

    return filterByCategory(data, categoryId);
  }

  function filterByCategory(data, categoryId) {
    if (categoryId && categoryId !== 'all') {
      data = data.filter(function (d) {
        return d.categoryId === categoryId;
      });
    }
    return data;
  }

  function applyFiltersAndRender() {
    filteredData = getFilteredData();
    renderTable();
    renderPagination();
  }

  /* ---- Data Table ---- */
  function renderTable() {
    var tbody = document.getElementById('pnlTableBody');
    if (!tbody) return;

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var end = start + ITEMS_PER_PAGE;
    var pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding:var(--space-8);color:var(--text-tertiary);">' +
        '<i class="fa-solid fa-inbox" style="font-size:var(--text-2xl);display:block;margin-bottom:var(--space-2);"></i>' +
        'データが見つかりません' +
      '</td></tr>';
      return;
    }

    tbody.innerHTML = pageData.map(function (row) {
      var cat = getCategoryById(row.categoryId);
      var catName = cat ? cat.name : row.categoryId;
      var catClass = cat ? cat.cssClass : '';

      var amountClass = row.amount >= 0 ? 'text-profit' : 'text-loss';
      var amountStr = formatYen(row.amount);

      return '<tr>' +
        '<td><span class="font-mono" style="font-size:var(--text-xs)">' + formatDate(row.date) + '</span></td>' +
        '<td><span style="font-weight:var(--font-medium)">' + row.userName + '</span></td>' +
        '<td><span class="category-tag ' + catClass + '">' + catName + '</span></td>' +
        '<td><span class="font-mono ' + amountClass + '" style="font-weight:var(--font-semibold)">' + amountStr + '</span></td>' +
        '<td><span style="font-size:var(--text-sm);color:var(--text-secondary)">' + row.comment + '</span></td>' +
      '</tr>';
    }).join('');
  }

  /* ---- Pagination ---- */
  function renderPagination() {
    var container = document.getElementById('pnlPagination');
    if (!container) return;

    var totalItems = filteredData.length;
    var totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages < 1) totalPages = 1;

    var start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    var end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    if (totalItems === 0) {
      start = 0;
      end = 0;
    }

    var infoText = start + '〜' + end + ' / ' + totalItems + ' 件';

    var buttonsHtml = '';

    // Previous button
    buttonsHtml += '<button class="admin-pagination-btn" ' +
      (currentPage <= 1 ? 'disabled' : '') +
      ' data-page="' + (currentPage - 1) + '">' +
      '<i class="fa-solid fa-chevron-left"></i></button>';

    // Page numbers
    for (var i = 1; i <= totalPages; i++) {
      buttonsHtml += '<button class="admin-pagination-btn' +
        (i === currentPage ? ' active' : '') +
        '" data-page="' + i + '">' + i + '</button>';
    }

    // Next button
    buttonsHtml += '<button class="admin-pagination-btn" ' +
      (currentPage >= totalPages ? 'disabled' : '') +
      ' data-page="' + (currentPage + 1) + '">' +
      '<i class="fa-solid fa-chevron-right"></i></button>';

    container.innerHTML =
      '<div class="admin-pagination-info">' + infoText + '</div>' +
      '<div class="admin-pagination-controls">' + buttonsHtml + '</div>';

    // Bind pagination click events
    var buttons = container.querySelectorAll('.admin-pagination-btn:not([disabled])');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var page = parseInt(this.getAttribute('data-page'), 10);
        if (page >= 1 && page <= totalPages) {
          currentPage = page;
          renderTable();
          renderPagination();
        }
      });
    });
  }
})();
