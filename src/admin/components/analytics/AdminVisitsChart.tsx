import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { VisitGranularity, VisitSeriesPoint } from '@/admin/lib/siteAnalytics';
import { bucketLabel } from '@/admin/lib/siteAnalytics';

type AdminVisitsChartProps = {
  series: VisitSeriesPoint[];
  granularity: VisitGranularity;
  loading?: boolean;
};

const VISITORS_COLOR = '#4a5f52';
const VIEWS_COLOR = '#b49a72';

const AdminVisitsChart = ({ series, granularity, loading }: AdminVisitsChartProps) => {
  if (loading) {
    return (
      <p className="text-[10px] font-bold uppercase text-black/40 animate-pulse py-20 text-center">
        Loading chart…
      </p>
    );
  }

  if (!series.some((p) => p.views > 0)) {
    return (
      <p className="text-[10px] font-bold uppercase text-black/40 py-20 text-center">
        No visits recorded in this period yet
      </p>
    );
  }

  const data = series.map((p) => ({ ...p, label: bucketLabel(p.key, granularity) }));

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        {[
          { label: 'Visitors', color: VISITORS_COLOR },
          { label: 'Page views', color: VIEWS_COLOR },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-black/55">
            <span className="w-2.5 h-2.5 inline-block" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="h-60 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VISITORS_COLOR} stopOpacity={0.35} />
                <stop offset="100%" stopColor={VISITORS_COLOR} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VIEWS_COLOR} stopOpacity={0.25} />
                <stop offset="100%" stopColor={VIEWS_COLOR} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.45)', fontWeight: 700 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(0,0,0,0.12)' }}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 9, fill: 'rgba(0,0,0,0.45)', fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(0,0,0,0.2)', strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as (typeof data)[number];
                return (
                  <div className="border border-black/15 bg-white px-3 py-2 shadow-sm">
                    <p className="text-[9px] font-bold uppercase text-black/50">{row.label}</p>
                    <p className="text-[11px] font-bold tabular-nums text-black mt-1">
                      {row.visitors.toLocaleString()} visitor{row.visitors === 1 ? '' : 's'}
                    </p>
                    <p className="text-[9px] font-bold uppercase tabular-nums text-black/45 mt-0.5">
                      {row.views.toLocaleString()} page view{row.views === 1 ? '' : 's'}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke={VIEWS_COLOR}
              strokeWidth={2}
              fill="url(#viewsFill)"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={VISITORS_COLOR}
              strokeWidth={2}
              fill="url(#visitorsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminVisitsChart;
