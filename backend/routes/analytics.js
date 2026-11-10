const express = require('express');
const PageView = require('../models/PageView');
const ShopOrder = require('../models/ShopOrder');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const BOT_UA =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|facebookexternalhit|whatsapp|curl|wget|python-requests|axios|node-fetch/i;
const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const PAID_MATCH = {
  $or: [{ paymentStatus: 'paid' }, { status: { $in: ['delivered', 'shipped'] } }],
};
const LIVE_WINDOW_MS = 5 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function parseUserAgent(ua = '') {
  let device = 'desktop';
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) device = 'tablet';
  else if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) device = 'mobile';

  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/fban|fbav|instagram/i.test(ua)) browser = 'In-app (Meta)';
  else if (/tiktok|bytedance/i.test(ua)) browser = 'In-app (TikTok)';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/linux|cros/i.test(ua)) os = 'Linux';

  return { device, browser, os };
}

function referrerHostFrom(raw) {
  if (typeof raw !== 'string' || !raw) return '';
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, '');
    if (!host || host.endsWith('harvdreams.com') || host === 'localhost') return '';
    return host.slice(0, 200);
  } catch {
    return '';
  }
}

function headerText(req, name, max) {
  const value = req.headers[name];
  if (typeof value !== 'string' || !value) return '';
  try {
    return decodeURIComponent(value).slice(0, max);
  } catch {
    return value.slice(0, max);
  }
}

// @desc    Record one page view (called by the shop on every route change)
// @route   POST /api/analytics/track
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const ua = req.headers['user-agent'] || '';
    if (!ua || BOT_UA.test(ua)) return res.status(204).end();

    const { visitorId, sessionId, path, referrer, firstVisit } = req.body || {};
    if (!ID_RE.test(visitorId || '') || !ID_RE.test(sessionId || '')) {
      return res.status(204).end();
    }
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('/admin')) {
      return res.status(204).end();
    }

    const country = headerText(req, 'x-vercel-ip-country', 2).toUpperCase();
    await PageView.create({
      visitorId,
      sessionId,
      path: path.split('?')[0].slice(0, 300),
      referrerHost: referrerHostFrom(referrer),
      country: /^[A-Z]{2}$/.test(country) ? country : '',
      region: headerText(req, 'x-vercel-ip-country-region', 80),
      city: headerText(req, 'x-vercel-ip-city', 120),
      firstVisit: firstVisit === true,
      ...parseUserAgent(ua),
    });

    res.status(204).end();
  } catch (error) {
    console.error('Analytics track error:', error.message);
    res.status(204).end();
  }
});

function startOfDayUtc(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Resolve the selected period to a [start, end] range plus the equally long range before it. */
function resolveRange(query) {
  const now = new Date();
  const today = startOfDayUtc(now);
  let start;
  let end = now;

  switch (query.period) {
    case 'today':
      start = today;
      break;
    case 'yesterday':
      start = new Date(today.getTime() - DAY_MS);
      end = new Date(today.getTime() - 1);
      break;
    case '90d':
      start = new Date(today.getTime() - 89 * DAY_MS);
      break;
    case '12m':
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
      break;
    case 'custom': {
      const from = parseDay(query.from);
      const to = parseDay(query.to);
      if (from && to && from <= to) {
        start = from;
        end = new Date(Math.min(to.getTime() + DAY_MS - 1, now.getTime()));
      } else {
        start = new Date(today.getTime() - 29 * DAY_MS);
      }
      break;
    }
    case '7d':
      start = new Date(today.getTime() - 6 * DAY_MS);
      break;
    case '30d':
    default:
      start = new Date(today.getTime() - 29 * DAY_MS);
  }

  const spanMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(start.getTime() - spanMs - 1);

  let granularity = 'day';
  if (spanMs <= 2 * DAY_MS) granularity = 'hour';
  else if (spanMs > 120 * DAY_MS) granularity = 'month';

  return { start, end, prevStart, prevEnd, granularity };
}

const BUCKET_FORMAT = { hour: '%Y-%m-%dT%H', day: '%Y-%m-%d', month: '%Y-%m' };

function bucketKeys(start, end, granularity) {
  const keys = [];
  const cursor = new Date(start);
  if (granularity === 'hour') cursor.setUTCMinutes(0, 0, 0);
  if (granularity === 'month') cursor.setUTCDate(1);
  while (cursor <= end && keys.length < 1000) {
    const iso = cursor.toISOString();
    keys.push(granularity === 'hour' ? iso.slice(0, 13) : granularity === 'day' ? iso.slice(0, 10) : iso.slice(0, 7));
    if (granularity === 'hour') cursor.setUTCHours(cursor.getUTCHours() + 1);
    else if (granularity === 'day') cursor.setUTCDate(cursor.getUTCDate() + 1);
    else cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return keys;
}

const distinctCount = (field) => [
  { $group: { _id: null, views: { $sum: 1 }, set: { $addToSet: field } } },
  { $project: { _id: 0, views: 1, count: { $size: '$set' } } },
];

const topBy = (key, limit, extraMatch) => [
  ...(extraMatch ? [{ $match: extraMatch }] : []),
  { $group: { _id: key, views: { $sum: 1 }, visitorSet: { $addToSet: '$visitorId' } } },
  { $project: { _id: 0, key: '$_id', views: 1, visitors: { $size: '$visitorSet' } } },
  { $sort: { visitors: -1, views: -1 } },
  { $limit: limit },
];

async function periodTotals(start, end) {
  const [row] = await PageView.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $facet: {
        visitors: distinctCount('$visitorId'),
        sessions: [
          { $group: { _id: '$sessionId', views: { $sum: 1 } } },
          {
            $group: {
              _id: null,
              sessions: { $sum: 1 },
              bounced: { $sum: { $cond: [{ $eq: ['$views', 1] }, 1, 0] } },
            },
          },
        ],
        newVisitors: [
          { $match: { firstVisit: true } },
          { $group: { _id: '$visitorId' } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  const visitors = row.visitors[0] || { views: 0, count: 0 };
  const sessions = row.sessions[0] || { sessions: 0, bounced: 0 };
  const orders = await ShopOrder.countDocuments({
    ...PAID_MATCH,
    createdAt: { $gte: start, $lte: end },
  });

  return {
    pageViews: visitors.views,
    visitors: visitors.count,
    newVisitors: row.newVisitors[0]?.count || 0,
    sessions: sessions.sessions,
    bounceRate: sessions.sessions ? (sessions.bounced / sessions.sessions) * 100 : 0,
    pagesPerSession: sessions.sessions ? visitors.views / sessions.sessions : 0,
    paidOrders: orders,
    conversionRate: visitors.count ? (orders / visitors.count) * 100 : 0,
  };
}

// @desc    Visitor analytics for the admin dashboard
// @route   GET /api/analytics/summary?period=today|yesterday|7d|30d|90d|12m|custom&from=&to=
// @access  Private/Admin
router.get('/summary', protect, authorize('admin'), async (req, res) => {
  try {
    const { start, end, prevStart, prevEnd, granularity } = resolveRange(req.query);
    const match = { $match: { createdAt: { $gte: start, $lte: end } } };

    const [[breakdown], current, previous, liveIds] = await Promise.all([
      PageView.aggregate([
        match,
        {
          $facet: {
            series: [
              {
                $group: {
                  _id: { $dateToString: { format: BUCKET_FORMAT[granularity], date: '$createdAt' } },
                  views: { $sum: 1 },
                  visitorSet: { $addToSet: '$visitorId' },
                },
              },
              { $project: { views: 1, visitors: { $size: '$visitorSet' } } },
            ],
            countries: topBy('$country', 30),
            cities: [
              { $match: { city: { $ne: '' } } },
              {
                $group: {
                  _id: { city: '$city', country: '$country' },
                  views: { $sum: 1 },
                  visitorSet: { $addToSet: '$visitorId' },
                },
              },
              {
                $project: {
                  _id: 0,
                  city: '$_id.city',
                  country: '$_id.country',
                  views: 1,
                  visitors: { $size: '$visitorSet' },
                },
              },
              { $sort: { visitors: -1, views: -1 } },
              { $limit: 10 },
            ],
            pages: topBy('$path', 10),
            referrers: topBy('$referrerHost', 10),
            devices: topBy('$device', 3),
            browsers: topBy('$browser', 8),
            os: topBy('$os', 6),
          },
        },
      ]),
      periodTotals(start, end),
      periodTotals(prevStart, prevEnd),
      PageView.distinct('visitorId', { createdAt: { $gte: new Date(Date.now() - LIVE_WINDOW_MS) } }),
    ]);

    const byBucket = new Map(breakdown.series.map((row) => [row._id, row]));
    const series = bucketKeys(start, end, granularity).map((key) => ({
      key,
      views: byBucket.get(key)?.views || 0,
      visitors: byBucket.get(key)?.visitors || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        range: { start, end, granularity },
        totals: current,
        previous,
        liveVisitors: liveIds.length,
        series,
        countries: breakdown.countries,
        cities: breakdown.cities,
        pages: breakdown.pages,
        referrers: breakdown.referrers,
        devices: breakdown.devices,
        browsers: breakdown.browsers,
        os: breakdown.os,
      },
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ success: false, message: 'Could not load site analytics' });
  }
});

module.exports = router;
