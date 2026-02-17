/**
 * Dashboard Page - REIJI Admin
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    renderKPI();
    renderBarChart();
  });

  function renderKPI() {
    var container = document.getElementById('kpiCards');
    if (!container) return;

    var cards = [
      { label: '総ユーザー数', value: formatNumber(MOCK_KPI.totalUsers), change: MOCK_KPI.changes.users, icon: 'fa-users', iconClass: 'primary' },
      { label: '本日アクティブ', value: formatNumber(MOCK_KPI.activeToday), change: MOCK_KPI.changes.active, icon: 'fa-user-check', iconClass: 'accent' },
      { label: '本日新規登録', value: formatNumber(MOCK_KPI.newToday), change: MOCK_KPI.changes.new, icon: 'fa-user-plus', iconClass: 'success' },
    ];

    container.innerHTML = cards.map(function (card) {
      var changeClass = card.change >= 0 ? 'up' : 'down';
      var changeIcon = card.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
      return '<div class="kpi-card">' +
        '<div class="kpi-card-icon ' + card.iconClass + '"><i class="fa-solid ' + card.icon + '"></i></div>' +
        '<div class="kpi-card-content">' +
          '<div class="kpi-card-label">' + card.label + '</div>' +
          '<div class="kpi-card-value">' + card.value + '</div>' +
          '<div class="kpi-card-change ' + changeClass + '">' +
            '<i class="fa-solid ' + changeIcon + '"></i> ' + formatPercent(card.change) + ' 前日比' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderBarChart() {
    var container = document.getElementById('barChart');
    if (!container) return;

    var max = Math.max.apply(null, MOCK_DAILY_REGISTRATIONS.map(function (d) { return d.count; }));

    container.innerHTML = MOCK_DAILY_REGISTRATIONS.map(function (d) {
      var height = Math.max((d.count / max) * 100, 5);
      return '<div class="simple-bar-chart-item">' +
        '<span class="simple-bar-chart-value">' + d.count + '</span>' +
        '<div class="simple-bar-chart-bar" style="height:' + height + '%"></div>' +
        '<span class="simple-bar-chart-label">' + d.date + '</span>' +
      '</div>';
    }).join('');
  }

})();
