/**
 * Shared Utilities - REIJI Admin
 */

function formatYen(amount) {
  const prefix = amount >= 0 ? '+' : '';
  return prefix + '¥' + Math.abs(amount).toLocaleString('ja-JP');
}

function formatNumber(num) {
  return num.toLocaleString('ja-JP');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const pad = function (n) { return n < 10 ? '0' + n : n; };
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function formatPercent(value) {
  const prefix = value >= 0 ? '+' : '';
  return prefix + value.toFixed(1) + '%';
}

function getCategoryById(id) {
  if (typeof MOCK_CATEGORIES !== 'undefined') {
    return MOCK_CATEGORIES.find(function (c) { return c.id === id; });
  }
  return null;
}
