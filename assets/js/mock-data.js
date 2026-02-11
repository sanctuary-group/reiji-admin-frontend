/**
 * Mock Data - REIJI Admin
 */

/* ---- Categories (same as user side) ---- */
var MOCK_CATEGORIES = [
  { id: 'stock', name: '現物取引', colorVar: '--cat-stock', cssClass: 'stock' },
  { id: 'margin', name: '信用取引', colorVar: '--cat-margin', cssClass: 'margin' },
  { id: 'fx', name: 'FX/CFD', colorVar: '--cat-fx', cssClass: 'fx' },
  { id: 'crypto', name: '仮想通貨', colorVar: '--cat-crypto', cssClass: 'crypto' },
  { id: 'dividend', name: '配当金', colorVar: '--cat-dividend', cssClass: 'dividend' }
];

/* ---- KPI ---- */
var MOCK_KPI = {
  totalUsers: 1234,
  activeToday: 89,
  newToday: 7,
  platformPnl: 12345678,
  changes: {
    users: 5.2,
    active: 12.3,
    new: -2.1,
    pnl: 8.7
  }
};

/* ---- Users ---- */
var MOCK_USERS = [
  { id: 1, name: '田中 太郎', email: 'tanaka@example.com', avatar: null, registeredAt: '2025-06-15', status: 'active', lastLogin: '2026-02-11T09:30:00', pnlTotal: 523000, tradeCount: 156 },
  { id: 2, name: '佐藤 花子', email: 'sato.h@example.com', avatar: null, registeredAt: '2025-07-02', status: 'active', lastLogin: '2026-02-11T08:15:00', pnlTotal: -87000, tradeCount: 89 },
  { id: 3, name: '鈴木 一郎', email: 'suzuki.i@example.com', avatar: null, registeredAt: '2025-08-20', status: 'active', lastLogin: '2026-02-10T22:45:00', pnlTotal: 1250000, tradeCount: 312 },
  { id: 4, name: '高橋 美咲', email: 'takahashi.m@example.com', avatar: null, registeredAt: '2025-09-10', status: 'suspended', lastLogin: '2026-01-28T14:00:00', pnlTotal: 45000, tradeCount: 23 },
  { id: 5, name: '伊藤 健太', email: 'ito.k@example.com', avatar: null, registeredAt: '2025-10-05', status: 'active', lastLogin: '2026-02-11T10:00:00', pnlTotal: 890000, tradeCount: 245 },
  { id: 6, name: '渡辺 優子', email: 'watanabe.y@example.com', avatar: null, registeredAt: '2025-10-18', status: 'active', lastLogin: '2026-02-09T16:30:00', pnlTotal: -234000, tradeCount: 67 },
  { id: 7, name: '山本 大輔', email: 'yamamoto.d@example.com', avatar: null, registeredAt: '2025-11-01', status: 'active', lastLogin: '2026-02-11T07:45:00', pnlTotal: 2100000, tradeCount: 489 },
  { id: 8, name: '中村 さくら', email: 'nakamura.s@example.com', avatar: null, registeredAt: '2025-11-22', status: 'deleted', lastLogin: '2026-01-15T11:00:00', pnlTotal: 12000, tradeCount: 8 },
  { id: 9, name: '小林 拓也', email: 'kobayashi.t@example.com', avatar: null, registeredAt: '2025-12-03', status: 'active', lastLogin: '2026-02-10T19:20:00', pnlTotal: 178000, tradeCount: 95 },
  { id: 10, name: '加藤 真由', email: 'kato.m@example.com', avatar: null, registeredAt: '2025-12-15', status: 'active', lastLogin: '2026-02-11T11:10:00', pnlTotal: -56000, tradeCount: 42 },
  { id: 11, name: '吉田 翔太', email: 'yoshida.s@example.com', avatar: null, registeredAt: '2026-01-05', status: 'active', lastLogin: '2026-02-11T06:00:00', pnlTotal: 345000, tradeCount: 78 },
  { id: 12, name: '山田 愛', email: 'yamada.a@example.com', avatar: null, registeredAt: '2026-01-12', status: 'active', lastLogin: '2026-02-10T21:00:00', pnlTotal: 67000, tradeCount: 31 }
];

/* ---- Posts ---- */
var MOCK_POSTS = [
  { id: 1, title: '2月の投資戦略：米国株を中心に', author: '田中 太郎', category: 'stock', createdAt: '2026-02-10T14:00:00', status: 'published' },
  { id: 2, title: 'ビットコイン急落時の対処法', author: '鈴木 一郎', category: 'crypto', createdAt: '2026-02-09T18:30:00', status: 'published' },
  { id: 3, title: 'FXスキャルピング入門', author: '伊藤 健太', category: 'fx', createdAt: '2026-02-09T10:00:00', status: 'published' },
  { id: 4, title: '高配当株ポートフォリオの作り方', author: '山本 大輔', category: 'dividend', createdAt: '2026-02-08T16:45:00', status: 'published' },
  { id: 5, title: '信用取引のリスク管理について', author: '佐藤 花子', category: 'margin', createdAt: '2026-02-08T09:20:00', status: 'flagged' },
  { id: 6, title: '仮想通貨税金の確定申告ガイド', author: '小林 拓也', category: 'crypto', createdAt: '2026-02-07T20:00:00', status: 'published' },
  { id: 7, title: '初心者向け：株式投資の始め方', author: '加藤 真由', category: 'stock', createdAt: '2026-02-07T11:30:00', status: 'draft' },
  { id: 8, title: 'ゴールドETFの分析レポート', author: '田中 太郎', category: 'fx', createdAt: '2026-02-06T15:00:00', status: 'published' },
  { id: 9, title: '不適切なコンテンツのテスト投稿', author: '高橋 美咲', category: 'stock', createdAt: '2026-02-05T08:00:00', status: 'flagged' },
  { id: 10, name: '週間マーケットレビュー #6', author: '吉田 翔太', category: 'stock', createdAt: '2026-02-04T17:00:00', status: 'published' }
];

/* ---- P&L Data ---- */
var MOCK_PNL_DATA = [
  { id: 1, date: '2026-02-11', userId: 1, userName: '田中 太郎', categoryId: 'stock', amount: 15000, comment: 'トヨタ株売却' },
  { id: 2, date: '2026-02-11', userId: 3, userName: '鈴木 一郎', categoryId: 'fx', amount: -8500, comment: 'EUR/USD ロスカット' },
  { id: 3, date: '2026-02-11', userId: 5, userName: '伊藤 健太', categoryId: 'crypto', amount: 42000, comment: 'BTC利確' },
  { id: 4, date: '2026-02-10', userId: 7, userName: '山本 大輔', categoryId: 'dividend', amount: 25000, comment: '配当金入金' },
  { id: 5, date: '2026-02-10', userId: 1, userName: '田中 太郎', categoryId: 'margin', amount: -12000, comment: 'ソフトバンク信用売り損切り' },
  { id: 6, date: '2026-02-10', userId: 9, userName: '小林 拓也', categoryId: 'stock', amount: 7800, comment: '任天堂株売却' },
  { id: 7, date: '2026-02-09', userId: 2, userName: '佐藤 花子', categoryId: 'fx', amount: 3200, comment: 'USD/JPY ショート利確' },
  { id: 8, date: '2026-02-09', userId: 5, userName: '伊藤 健太', categoryId: 'stock', amount: -5600, comment: 'ソニー株損切り' },
  { id: 9, date: '2026-02-09', userId: 11, userName: '吉田 翔太', categoryId: 'crypto', amount: 18000, comment: 'ETH利確' },
  { id: 10, date: '2026-02-08', userId: 3, userName: '鈴木 一郎', categoryId: 'stock', amount: 95000, comment: 'NVIDIA株売却' },
  { id: 11, date: '2026-02-08', userId: 7, userName: '山本 大輔', categoryId: 'fx', amount: -15000, comment: 'GBP/JPY ロスカット' },
  { id: 12, date: '2026-02-08', userId: 12, userName: '山田 愛', categoryId: 'stock', amount: 4500, comment: 'JR東日本売却' }
];

/* ---- Notifications ---- */
var MOCK_NOTIFICATIONS = [
  { id: 1, title: 'システムメンテナンスのお知らせ', body: '2/15 02:00-06:00にメンテナンスを実施します。', target: '全ユーザー', sentAt: '2026-02-10T10:00:00', status: 'sent' },
  { id: 2, title: '新機能リリース：グラフ分析機能', body: 'P&Lグラフに新しい分析ツールを追加しました。', target: '全ユーザー', sentAt: '2026-02-08T09:00:00', status: 'sent' },
  { id: 3, title: '確定申告に関する重要なお知らせ', body: '確定申告用のデータエクスポート機能をご利用ください。', target: '全ユーザー', sentAt: '2026-02-05T14:00:00', status: 'sent' },
  { id: 4, title: 'アカウント停止のお知らせ', body: '利用規約違反のためアカウントを停止しました。', target: '高橋 美咲', sentAt: '2026-01-28T15:00:00', status: 'sent' },
  { id: 5, title: '3月のイベント告知', body: '投資コンテストを開催予定です。詳細は後日発表。', target: '全ユーザー', sentAt: null, status: 'scheduled' }
];

/* ---- Activity Log ---- */
var MOCK_ACTIVITY_LOG = [
  { datetime: '2026-02-11T11:30:00', admin: '管理者A', action: 'ユーザーを停止', target: '高橋 美咲' },
  { datetime: '2026-02-11T10:15:00', admin: '管理者A', action: 'お知らせを送信', target: 'システムメンテナンスのお知らせ' },
  { datetime: '2026-02-11T09:00:00', admin: '管理者B', action: '投稿をフラグ', target: '不適切なコンテンツのテスト投稿' },
  { datetime: '2026-02-10T16:45:00', admin: '管理者A', action: 'カテゴリを編集', target: '仮想通貨' },
  { datetime: '2026-02-10T14:30:00', admin: '管理者B', action: '新規ユーザーを承認', target: '山田 愛' },
  { datetime: '2026-02-10T11:00:00', admin: '管理者A', action: 'システム設定を変更', target: 'メンテナンスモード' },
  { datetime: '2026-02-09T17:20:00', admin: '管理者A', action: 'お知らせを作成', target: '新機能リリース' },
  { datetime: '2026-02-09T10:00:00', admin: '管理者B', action: 'P&Lデータをエクスポート', target: '2026年1月分' },
  { datetime: '2026-02-08T15:30:00', admin: '管理者A', action: 'ユーザーを復旧', target: '渡辺 優子' },
  { datetime: '2026-02-08T09:45:00', admin: '管理者B', action: '投稿を削除', target: 'スパム投稿' }
];

/* ---- Platform Stats (for dashboard charts placeholder) ---- */
var MOCK_DAILY_REGISTRATIONS = [
  { date: '2/5', count: 3 },
  { date: '2/6', count: 5 },
  { date: '2/7', count: 2 },
  { date: '2/8', count: 8 },
  { date: '2/9', count: 4 },
  { date: '2/10', count: 6 },
  { date: '2/11', count: 7 }
];

var MOCK_CATEGORY_TRADES = [
  { category: '現物取引', count: 456, color: 'var(--cat-stock)' },
  { category: '信用取引', count: 189, color: 'var(--cat-margin)' },
  { category: 'FX/CFD', count: 312, color: 'var(--cat-fx)' },
  { category: '仮想通貨', count: 267, color: 'var(--cat-crypto)' },
  { category: '配当金', count: 78, color: 'var(--cat-dividend)' }
];

/* ---- Admin Users ---- */
var MOCK_ADMIN_USERS = [
  { id: 1, name: '管理者A', email: 'admin-a@reiji.jp', role: 'スーパー管理者', lastLogin: '2026-02-11T11:30:00' },
  { id: 2, name: '管理者B', email: 'admin-b@reiji.jp', role: '一般管理者', lastLogin: '2026-02-11T09:00:00' }
];
