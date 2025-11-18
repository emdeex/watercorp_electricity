import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import csvRaw from './data/watercorps.csv?raw';

const palette = [
  '#a855f7',
  '#ec4899',
  '#6366f1',
  '#06b6d4',
  '#14b8a6',
  '#f97316',
  '#facc15',
  '#ef4444',
  '#22c55e',
  '#0ea5e9',
  '#d946ef',
  '#fb7185',
  '#94a3b8',
  '#3b82f6',
  '#84cc16',
  '#eab308',
];

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseCsvRecords = (raw) => {
  const [headerLine, ...rows] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(',');

  return rows
    .map((row) => {
      if (!row.trim()) return null;
      const columns = row.split(',');
      const record = {};
      headers.forEach((header, index) => {
        record[header] = columns[index] ?? '';
      });
      return {
        utility: record.Utility_Name,
        year: record.Year,
        kWh: parseNumber(record.kWh),
        spend: parseNumber(record.Value),
        ratio: parseNumber(record.Ratio),
      };
    })
    .filter(Boolean);
};

const formatYearSort = (year) => {
  if (!year) return 0;
  const base = parseInt(year.slice(0, 4), 10);
  return Number.isNaN(base) ? 0 : base;
};

const formatRatio = (value) =>
  value === null || value === undefined ? '—' : `${(value * 100).toFixed(1)}¢/kWh`;

const formatMillions = (value) =>
  value === null || value === undefined ? '—' : `A$${(value / 1_000_000).toFixed(1)}M`;

const formatGigawattHours = (value) =>
  value === null || value === undefined ? '—' : `${(value / 1_000_000).toFixed(1)} GWh`;

const metricOptions = [
  {
    id: 'ratio',
    label: 'Cents per kWh',
    valueKey: 'ratio',
    formatter: (value) => (value === null ? '—' : `${(value * 100).toFixed(1)}¢/kWh`),
    axisFormatter: (value) => `${(value * 100).toFixed(0)}¢`,
  },
  {
    id: 'spend',
    label: 'Total Dollar Spend',
    valueKey: 'spend',
    formatter: formatMillions,
    axisFormatter: (value) => `A$${(value / 1_000_000).toFixed(0)}M`,
  },
  {
    id: 'kWh',
    label: 'Total kWh',
    valueKey: 'kWh',
    formatter: formatGigawattHours,
    axisFormatter: (value) => `${(value / 1_000_000).toFixed(0)}GWh`,
  },
];

const WaterCorpsChart = () => {
  const records = useMemo(() => parseCsvRecords(csvRaw), []);

  const recordLookup = useMemo(() => {
    const map = {};
    records.forEach((record) => {
      if (!record.utility || !record.year) return;
      map[`${record.utility}__${record.year}`] = record;
    });
    return map;
  }, [records]);

  const utilities = useMemo(
    () => Array.from(new Set(records.map((record) => record.utility))).filter(Boolean),
    [records],
  );

  const years = useMemo(
    () =>
      Array.from(new Set(records.map((record) => record.year)))
        .filter(Boolean)
        .sort((a, b) => formatYearSort(a) - formatYearSort(b)),
    [records],
  );

  const averageRatioByUtility = useMemo(() => {
    const map = {};
    utilities.forEach((utility) => {
      const ratios = records.filter((record) => record.utility === utility && record.ratio !== null);
      if (!ratios.length) return;
      map[utility] = ratios.reduce((sum, record) => sum + record.ratio, 0) / ratios.length;
    });
    return map;
  }, [records, utilities]);

  const defaultSelection = useMemo(() => {
    const sortedUtilities = [...utilities].sort((a, b) => (averageRatioByUtility[b] || 0) - (averageRatioByUtility[a] || 0));
    return sortedUtilities.slice(0, 6);
  }, [utilities, averageRatioByUtility]);

  const [selectedUtilities, setSelectedUtilities] = useState(defaultSelection);
  const [searchTerm, setSearchTerm] = useState('');
  const [metric, setMetric] = useState('ratio');

  const currentMetric = useMemo(
    () => metricOptions.find((option) => option.id === metric) ?? metricOptions[0],
    [metric],
  );

  const aggregatedByYear = useMemo(() => {
    return years.map((year) => {
      const slice = records.filter((record) => record.year === year);
      const totalKWh = slice.reduce((sum, record) => sum + (record.kWh || 0), 0);
      const totalSpend = slice.reduce((sum, record) => sum + (record.spend || 0), 0);
      const ratios = slice.filter((record) => record.ratio !== null);
      const avgRatio = ratios.length ? ratios.reduce((sum, record) => sum + record.ratio, 0) / ratios.length : null;
      return {
        year,
        kWh: totalKWh,
        spend: totalSpend,
        avgRatio,
      };
    });
  }, [records, years]);

  const lineChartData = useMemo(() => {
    return years.map((year) => {
      const entry = { year };
      selectedUtilities.forEach((utility) => {
        const match = records.find((record) => record.year === year && record.utility === utility);
        if (!match) {
          entry[utility] = null;
          return;
        }
        entry[utility] = metric === 'ratio' ? match.ratio : metric === 'spend' ? match.spend : match.kWh;
      });
      return entry;
    });
  }, [records, years, selectedUtilities, metric]);

  const latestYear = useMemo(() => {
    return [...years].reverse().find((year) =>
      records.some((record) => record.year === year && record.ratio !== null),
    );
  }, [records, years]);

  const earliestYear = useMemo(() => {
    return years.find((year) => records.some((record) => record.year === year && record.ratio !== null));
  }, [records, years]);

  const totals = useMemo(() => {
    const ratioValues = records.filter((record) => record.ratio !== null).map((record) => record.ratio);
    const avgRatio = ratioValues.length
      ? ratioValues.reduce((sum, ratio) => sum + ratio, 0) / ratioValues.length
      : null;
    const totalKWh = records.reduce((sum, record) => sum + (record.kWh || 0), 0);
    const totalSpend = records.reduce((sum, record) => sum + (record.spend || 0), 0);
    const firstAvg = aggregatedByYear.find((entry) => entry.avgRatio !== null)?.avgRatio ?? null;
    const lastAvg = [...aggregatedByYear].reverse().find((entry) => entry.avgRatio !== null)?.avgRatio ?? null;
    const deltaPercent = firstAvg && lastAvg ? ((lastAvg - firstAvg) / firstAvg) * 100 : null;

    return {
      avgRatio,
      totalKWh,
      totalSpend,
      deltaPercent,
      firstAvg,
      lastAvg,
    };
  }, [records, aggregatedByYear]);

  const filteredUtilities = useMemo(() => {
    if (!searchTerm) return utilities;
    return utilities.filter((utility) => utility.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [utilities, searchTerm]);

  const toggleUtility = (utility) => {
    setSelectedUtilities((prev) =>
      prev.includes(utility) ? prev.filter((name) => name !== utility) : [...prev, utility],
    );
  };

  const resetSelection = () => setSelectedUtilities(defaultSelection);

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
        <div className="mt-2 space-y-2">
          {payload
            .filter((item) => item.value !== null)
            .map((item) => {
              const record = recordLookup[`${item.dataKey}__${label}`];
              if (!record) return null;

              return (
                <div key={item.dataKey} className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color || '#fff' }}
                    />
                    <span className="font-medium">{item.dataKey}</span>
                  </div>
                  <div className="text-right text-xs text-slate-300 space-y-1">
                    <div>
                      <p className="text-sm font-semibold text-white">{currentMetric.formatter(item.value)}</p>
                      <p>{currentMetric.label}</p>
                    </div>
                    <p>
                      {record.ratio ? `${(record.ratio * 100).toFixed(1)}¢/kWh` : '—'} ·{' '}
                      {record.spend ? formatMillions(record.spend) : '—'} ·{' '}
                      {record.kWh ? formatGigawattHours(record.kWh) : '—'}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-3 text-center lg:text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Victorian Water Corporations</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">
            Electricity intensity, spending, and carbon-surrogate trends
          </h1>
          <p className="text-base text-slate-300 max-w-3xl mx-auto lg:mx-0">
            Explore twelve years of electricity consumption (kWh), energy spend, and cost-per-kWh ratios for 18 water utilities.
            Use the chip filters to spotlight specific corporations and compare who is getting more efficient over time.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Portfolio average cost</p>
            <p className="mt-3 text-3xl font-semibold text-white">{formatRatio(totals.avgRatio)}</p>
            <p className="text-xs text-slate-400">Across {utilities.length} utilities</p>
          </article>
          <article className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Electricity consumed</p>
            <p className="mt-3 text-3xl font-semibold text-white">{formatGigawattHours(totals.totalKWh)}</p>
            <p className="text-xs text-slate-400">2013-14 through 2024-25</p>
          </article>
          <article className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Energy spend</p>
            <p className="mt-3 text-3xl font-semibold text-white">{formatMillions(totals.totalSpend)}</p>
            <p className="text-xs text-slate-400">Nominal Australian dollars</p>
          </article>
          <article className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Change in avg ratio</p>
            <p className={`mt-3 text-3xl font-semibold ${
              totals.deltaPercent && totals.deltaPercent < 0 ? 'text-emerald-400' : 'text-amber-300'
            }`}>
              {totals.deltaPercent === null ? '—' : `${totals.deltaPercent > 0 ? '+' : ''}${totals.deltaPercent.toFixed(1)}%`}
            </p>
            <p className="text-xs text-slate-400">
              {earliestYear} vs {latestYear}
            </p>
          </article>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Interactive timeline</p>
              <h2 className="text-xl font-semibold text-white">Cost-per-kWh trends</h2>
              <p className="text-sm text-slate-400">
                Toggle utilities to compare their energy cost efficiency trajectory. Hover any line for exact values.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="search"
                placeholder="Search utility"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full sm:w-48 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUtilities(utilities)}
                  className="px-4 py-2 rounded-xl bg-sky-500/80 hover:bg-sky-400 text-sm font-semibold text-white transition"
                >
                  Select all
                </button>
                <button
                  onClick={resetSelection}
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/20 transition"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {metricOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMetric(option.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    metric === option.id
                      ? 'bg-white text-slate-900 border-white shadow-lg shadow-white/30'
                      : 'text-slate-300 border-white/20 hover:border-white/40'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredUtilities.map((utility) => (
              <button
                key={utility}
                onClick={() => toggleUtility(utility)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  selectedUtilities.includes(utility)
                    ? 'bg-white text-slate-900 border-white shadow-lg shadow-white/30'
                    : 'text-slate-300 border-white/20 hover:border-white/40'
                }`}
              >
                {utility}
              </button>
            ))}
          </div>

          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => (value == null ? '' : currentMetric.axisFormatter(value))}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip content={renderTooltip} />
                <Legend wrapperStyle={{ color: '#cbd5f5' }} />
                {selectedUtilities.map((utility, index) => (
                  <Line
                    key={utility}
                    type="monotone"
                    dataKey={utility}
                    stroke={palette[index % palette.length]}
                    dot={false}
                    strokeWidth={2.2}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WaterCorpsChart;
