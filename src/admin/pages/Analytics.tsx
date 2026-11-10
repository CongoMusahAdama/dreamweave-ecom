import { useCallback, useEffect, useMemo, useState } from 'react';
import { Globe2, RefreshCw } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminPanel from '../components/ui/AdminPanel';
import AdminVisitsChart from '../components/analytics/AdminVisitsChart';
import { useAuth } from '@/contexts/AuthContext';
import { useShopCatalog } from '@/contexts/ShopCatalogContext';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  DEVICE_LABELS,
  VISIT_PERIODS,
  countryFlagUrl,
  countryName,
  pageLabel,
  percentChange,
  referrerLabel,
  toDateInput,
  type SiteAnalytics,
  type VisitBreakdownRow,
  type VisitPeriod,
  type VisitTotals,
} from '../lib/siteAnalytics';

const PERIOD_COMPARE_LABEL: Record<VisitPeriod, string> = {
  today: 'vs yesterday',
  yesterday: 'vs day before',
  '7d': 'vs previous 7 days',
  '30d': 'vs previous 30 days',
  '90d': 'vs previous 90 days',
  '12m': 'vs previous 12 months',
  custom: 'vs previous period',
};

type Kpi = {
  label: string;
  value: (t: VisitTotals) => string;
  raw: (t: VisitTotals) => number;
  hint?: (t: VisitTotals) => string;
  lowerIsBetter?: boolean;
  card: string;
};

const KPIS: Kpi[] = [
  {
    label: 'Visitors',
    raw: (t) => t.visitors,
    value: (t) => t.visitors.toLocaleString(),
    hint: (t) => `${t.newVisitors.toLocaleString()} new · ${Math.max(t.visitors - t.newVisitors, 0).toLocaleString()} returning`,
    card: 'bg-[#e7ebe8] border-[#d0dbd4]',
  },
  {
    label: 'Page views',
    raw: (t) => t.pageViews,
    value: (t) => t.pageViews.toLocaleString(),
    card: 'bg-[#ebe7e0] border-[#ddd5c8]',
  },
  {
    label: 'Visits (sessions)',
    raw: (t) => t.sessions,
    value: (t) => t.sessions.toLocaleString(),
    card: 'bg-[#e6e8ed] border-[#cfd4dc]',
  },
  {
    label: 'Pages per visit',
    raw: (t) => t.pagesPerSession,
    value: (t) => t.pagesPerSession.toFixed(1),
    card: 'bg-[#ede9e5] border-[#ddd6ce]',
  },
  {
    label: 'Bounce rate',
    raw: (t) => t.bounceRate,
    value: (t) => `${t.bounceRate.toFixed(0)}%`,
    hint: () => 'Left after one page',
    lowerIsBetter: true,
    card: 'bg-[#e7ebe8] border-[#d0dbd4]',
  },
  {
    label: 'Conversion',
    raw: (t) => t.conversionRate,
    value: (t) => `${t.conversionRate.toFixed(1)}%`,
    hint: (t) => `${t.paidOrders.toLocaleString()} paid order${t.paidOrders === 1 ? '' : 's'}`,
    card: 'bg-[#ebe7e0] border-[#ddd5c8]',
  },
];

const DeltaBadge = ({ change, lowerIsBetter }: { change: number | null; lowerIsBetter?: boolean }) => {
  if (change === null) {
    return <span className="text-[8px] font-bold uppercase tracking-wider text-black/40">New</span>;
  }
  const rounded = Math.round(change);
  if (rounded === 0) {
    return <span className="text-[8px] font-bold uppercase tracking-wider text-black/40">No change</span>;
  }
  const good = lowerIsBetter ? rounded < 0 : rounded > 0;
  return (
    <span
      className={cn(
        'text-[9px] font-bold tabular-nums tracking-wider',
        good ? 'text-[#2f6b45]' : 'text-[#a2412f]'
      )}
    >
      {rounded > 0 ? '▲' : '▼'} {Math.abs(rounded)}%
    </span>
  );
};

/** Ranked list with a share bar — used for countries, pages, sources, devices. */
const ShareList = ({
  rows,
  label,
  icon,
  emptyText,
  metric = 'visitors',
}: {
  rows: VisitBreakdownRow[];
  label: (row: VisitBreakdownRow) => string;
  icon?: (row: VisitBreakdownRow) => React.ReactNode;
  emptyText: string;
  metric?: 'visitors' | 'views';
}) => {
  if (!rows.length) {
    return <p className="text-[10px] font-bold uppercase text-black/40 py-8 text-center">{emptyText}</p>;
  }
  const total = rows.reduce((sum, r) => sum + r[metric], 0) || 1;
  const max = Math.max(...rows.map((r) => r[metric]), 1);

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => {
        const value = row[metric];
        return (
          <li key={row.key || '__empty'}>
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="flex items-center gap-2 min-w-0">
                {icon?.(row)}
                <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-black/80 truncate">
                  {label(row)}
                </span>
              </span>
              <span className="text-[10px] font-bold tabular-nums text-black/70 shrink-0">
                {value.toLocaleString()}
                <span className="text-black/35 ml-1.5">{Math.round((value / total) * 100)}%</span>
              </span>
            </div>
            <div className="h-1.5 bg-black/[0.05]">
              <div className="h-full bg-[#4a5f52]" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Flag = ({ code }: { code: string }) => {
  const url = countryFlagUrl(code);
  if (!url) return <Globe2 className="w-4 h-3 text-black/35 shrink-0" strokeWidth={2} />;
  return (
    <img
      src={url}
      alt=""
      width={20}
      height={14}
      loading="lazy"
      className="w-5 h-3.5 object-cover border border-black/10 shrink-0"
    />
  );
};

const Analytics = () => {
  const { token } = useAuth();
  const { products } = useShopCatalog();
  const [period, setPeriod] = useState<VisitPeriod>('30d');
  const [customFrom, setCustomFrom] = useState(() =>
    toDateInput(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
  );
  const [customTo, setCustomTo] = useState(() => toDateInput(new Date()));
  const [appliedCustom, setAppliedCustom] = useState({ from: customFrom, to: customTo });
  const [data, setData] = useState<SiteAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams({ period });
    if (period === 'custom') {
      params.set('from', appliedCustom.from);
      params.set('to', appliedCustom.to);
    }
    return params.toString();
  }, [period, appliedCustom]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<{ success: boolean; data: SiteAnalytics }>(
          `/api/analytics/summary?${query}`,
          { token }
        );
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : 'Could not load site analytics');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, query, refreshKey]);

  const productName = useCallback(
    (id: number) => products.find((p) => p.id === id)?.name,
    [products]
  );

  const totals = data?.totals;
  const previous = data?.previous;
  const topCountry = data?.countries[0];
  const customValid = customFrom && customTo && customFrom <= customTo;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Site analytics"
        description="Who visits the shop, where they come from, and what they look at."
      >
        <div className="flex items-center gap-2 sm:justify-end">
          <span className="flex items-center gap-2 border border-black/10 px-3 py-2">
            <span className="relative flex w-2 h-2">
              {(data?.liveVisitors || 0) > 0 && (
                <span className="absolute inset-0 rounded-full bg-[#3f8f5a] opacity-60 animate-ping" />
              )}
              <span
                className={cn(
                  'relative w-2 h-2 rounded-full',
                  (data?.liveVisitors || 0) > 0 ? 'bg-[#3f8f5a]' : 'bg-black/25'
                )}
              />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/70 tabular-nums">
              {data ? data.liveVisitors.toLocaleString() : '—'} on site now
            </span>
          </span>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="border border-black/10 p-2 hover:border-black/30 transition-colors"
            aria-label="Refresh analytics"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-black/60', loading && 'animate-spin')} />
          </button>
        </div>
      </AdminPageHeader>

      {/* Period filter */}
      <div className="flex flex-wrap gap-1.5 mb-3" role="tablist" aria-label="Period">
        {VISIT_PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={period === p.id}
            onClick={() => setPeriod(p.id)}
            className={cn(
              'px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px] font-bold tracking-[0.14em] uppercase border transition-colors touch-manipulation',
              period === p.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-black/55 border-black/15 hover:text-black hover:border-black/30'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <form
          className="flex flex-wrap items-end gap-2 mb-3 border border-black/10 bg-black/[0.02] p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (customValid) setAppliedCustom({ from: customFrom, to: customTo });
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/45">From</span>
            <input
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="border border-black/15 bg-white px-2 py-2 text-[11px] font-bold"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-black/45">To</span>
            <input
              type="date"
              value={customTo}
              min={customFrom || undefined}
              max={toDateInput(new Date())}
              onChange={(e) => setCustomTo(e.target.value)}
              className="border border-black/15 bg-white px-2 py-2 text-[11px] font-bold"
            />
          </label>
          <button
            type="submit"
            disabled={!customValid}
            className="bg-black text-white px-5 py-2.5 text-[9px] font-bold tracking-[0.16em] uppercase disabled:opacity-40"
          >
            Apply
          </button>
        </form>
      )}

      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/40 mb-4 sm:mb-6">
        Changes shown {PERIOD_COMPARE_LABEL[period]}
        {topCountry ? ` · Most visitors from ${countryName(topCountry.key)}` : ''}
      </p>

      {error && (
        <div className="border border-[#e3c4bc] bg-[#f7ece9] px-4 py-3 mb-4 text-[10px] font-bold uppercase tracking-wider text-[#a2412f]">
          {error}
        </div>
      )}

      {/* Headline numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className={cn('border p-3.5 sm:p-4 flex flex-col gap-1 min-h-[96px]', kpi.card)}>
            <p className="text-[8px] sm:text-[9px] font-bold tracking-[0.16em] uppercase text-black/50">
              {kpi.label}
            </p>
            <p className="text-lg sm:text-xl font-bold tabular-nums text-black/85">
              {loading || !totals ? '—' : kpi.value(totals)}
            </p>
            <div className="mt-auto flex flex-col gap-0.5">
              {!loading && totals && previous && (
                <DeltaBadge
                  change={percentChange(kpi.raw(totals), kpi.raw(previous))}
                  lowerIsBetter={kpi.lowerIsBetter}
                />
              )}
              {!loading && totals && kpi.hint && (
                <span className="text-[8px] font-bold uppercase tracking-wider text-black/40 leading-snug">
                  {kpi.hint(totals)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 sm:space-y-6">
        <AdminPanel title="Visitors over time">
          <AdminVisitsChart
            series={data?.series || []}
            granularity={data?.range.granularity || 'day'}
            loading={loading}
          />
        </AdminPanel>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            <AdminPanel title="Countries">
              {loading ? (
                <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
              ) : (
                <ShareList
                  rows={data?.countries || []}
                  label={(r) => countryName(r.key)}
                  icon={(r) => <Flag code={r.key} />}
                  emptyText="No visitor locations yet"
                />
              )}
            </AdminPanel>
          </div>
          <div className="lg:col-span-2">
            <AdminPanel title="Top cities">
              {loading ? (
                <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
              ) : (
                <ShareList
                  rows={(data?.cities || []).map((c) => ({
                    key: `${c.city}|${c.country}`,
                    views: c.views,
                    visitors: c.visitors,
                  }))}
                  label={(r) => r.key.split('|')[0]}
                  icon={(r) => <Flag code={r.key.split('|')[1]} />}
                  emptyText="No city data yet"
                />
              )}
            </AdminPanel>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <AdminPanel title="Most viewed pages">
            {loading ? (
              <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
            ) : (
              <ShareList
                rows={data?.pages || []}
                metric="views"
                label={(r) => pageLabel(r.key, productName)}
                emptyText="No page views yet"
              />
            )}
          </AdminPanel>
          <AdminPanel title="Where visitors come from">
            {loading ? (
              <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
            ) : (
              <ShareList
                rows={data?.referrers || []}
                label={(r) => referrerLabel(r.key)}
                emptyText="No traffic sources yet"
              />
            )}
          </AdminPanel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <AdminPanel title="Devices">
            {loading ? (
              <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
            ) : (
              <ShareList
                rows={data?.devices || []}
                label={(r) => DEVICE_LABELS[r.key] || r.key}
                emptyText="No device data yet"
              />
            )}
          </AdminPanel>
          <AdminPanel title="Browsers">
            {loading ? (
              <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
            ) : (
              <ShareList rows={data?.browsers || []} label={(r) => r.key} emptyText="No browser data yet" />
            )}
          </AdminPanel>
          <AdminPanel title="Operating systems">
            {loading ? (
              <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-8 text-center">Loading…</p>
            ) : (
              <ShareList rows={data?.os || []} label={(r) => r.key} emptyText="No system data yet" />
            )}
          </AdminPanel>
        </div>

        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/35 pb-4">
          Visits are anonymous. Admin visits are not counted. Times are Ghana time (GMT).
        </p>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
