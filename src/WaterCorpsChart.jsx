import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WaterCorpsChart = () => {
  const rawData = [
    { year: "2013-14", "Barwon Water": 0.157579735, "Central Highlands Water": 0.203421229, "City West Water": 0.066243291, "Coliban": null, "East Gippsland Water": 0.2, "Goulburn Murray Water": 0.237094131, "Goulburn Valley Water": 0.209001867, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": null, "Melbourne Water": null, "NE Water": null, "South East Water": 0.149948642, "South Gippsland Water": 0.23676943, "Wannon Water": 0.155575582, "Western Water": 0.182951924, "Westernport Water": 0.197112013, "Yarra Valley Water": 0.137328733 },
    { year: "2014-15", "Barwon Water": 0.172349921, "Central Highlands Water": 0.197632088, "City West Water": 0.214095842, "Coliban": null, "East Gippsland Water": 0.174285714, "Goulburn Murray Water": 0.225148923, "Goulburn Valley Water": 0.20488802, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": null, "Melbourne Water": null, "NE Water": null, "South East Water": 0.141943405, "South Gippsland Water": 0.204459934, "Wannon Water": 0.166179361, "Western Water": 0.22163299, "Westernport Water": 0.178553248, "Yarra Valley Water": 0.120217712 },
    { year: "2015-16", "Barwon Water": 0.161987966, "Central Highlands Water": 0.146653895, "City West Water": 0.178157885, "Coliban": null, "East Gippsland Water": 0.179316239, "Goulburn Murray Water": 0.22577605, "Goulburn Valley Water": 0.184667452, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": null, "Melbourne Water": null, "NE Water": 0.16945, "South East Water": 0.136942179, "South Gippsland Water": 0.188557495, "Wannon Water": 0.169086802, "Western Water": 0.19044067, "Westernport Water": 0.170911999, "Yarra Valley Water": 0.128155026 },
    { year: "2016-17", "Barwon Water": 0.144756926, "Central Highlands Water": 0.107780993, "City West Water": null, "Coliban": null, "East Gippsland Water": 0.168679245, "Goulburn Murray Water": 0.200598959, "Goulburn Valley Water": 0.20307484, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": null, "Melbourne Water": 0.195316469, "NE Water": 0.177743544, "South East Water": 0.147217787, "South Gippsland Water": 0.173922626, "Wannon Water": 0.155851765, "Western Water": 0.214586255, "Westernport Water": 0.182997141, "Yarra Valley Water": 0.118123205 },
    { year: "2017-18", "Barwon Water": 0.147598781, "Central Highlands Water": 0.1773235, "City West Water": null, "Coliban": 0.238377008, "East Gippsland Water": 0.168831169, "Goulburn Murray Water": 0.218609799, "Goulburn Valley Water": 0.20568277, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": 0.174840608, "Melbourne Water": 0.063489488, "NE Water": 0.211014881, "South East Water": 0.137624515, "South Gippsland Water": 0.173090898, "Wannon Water": 0.157549428, "Western Water": 0.202751557, "Westernport Water": 0.158632191, "Yarra Valley Water": 0.140375549 },
    { year: "2018-19", "Barwon Water": 0.201464405, "Central Highlands Water": 0.102601287, "City West Water": null, "Coliban": 0.206743025, "East Gippsland Water": 0.214587121, "Goulburn Murray Water": 0.26532567, "Goulburn Valley Water": 0.257134966, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": null, "Melbourne Water": 0.076677449, "NE Water": 0.209094041, "South East Water": 0.194796441, "South Gippsland Water": 0.223543888, "Wannon Water": 0.209778962, "Western Water": 0.198865938, "Westernport Water": 0.212431157, "Yarra Valley Water": 0.198348597 },
    { year: "2019-20", "Barwon Water": 0.186044437, "Central Highlands Water": 0.105632869, "City West Water": 0.19192004, "Coliban": 0.189793487, "East Gippsland Water": 0.215538392, "Goulburn Murray Water": 0.235011661, "Goulburn Valley Water": 0.24308388, "Greater Western Water": null, "GWMWater": 0.230757878, "Lower Murray Water": 0.215432112, "Melbourne Water": 0.13004208, "NE Water": 0.201682355, "South East Water": 0.198621992, "South Gippsland Water": 0.214614408, "Wannon Water": 0.211383801, "Western Water": 0.189443663, "Westernport Water": 0.217904274, "Yarra Valley Water": 0.201682355 },
    { year: "2020-21", "Barwon Water": 0.174956839, "Central Highlands Water": 0.072153476, "City West Water": 0.177937522, "Coliban": 0.164137156, "East Gippsland Water": 0.203937654, "Goulburn Murray Water": 0.214392245, "Goulburn Valley Water": 0.20714069, "Greater Western Water": 0.058095735, "GWMWater": 0.207342361, "Lower Murray Water": 0.229656713, "Melbourne Water": 0.12851273, "NE Water": 0.188988388, "South East Water": 0.178358435, "South Gippsland Water": 0.21278285, "Wannon Water": 0.221314998, "Western Water": 0.168002539, "Westernport Water": 0.209755696, "Yarra Valley Water": 0.168438238 },
    { year: "2021-22", "Barwon Water": 0.161516207, "Central Highlands Water": null, "City West Water": null, "Coliban": 0.158916685, "East Gippsland Water": 0.176423416, "Goulburn Murray Water": 0.177895099, "Goulburn Valley Water": 0.211973434, "Greater Western Water": 0.17547953, "GWMWater": 0.199470042, "Lower Murray Water": 0.206161056, "Melbourne Water": 0.126631858, "NE Water": 0.20836156, "South East Water": 0.150248024, "South Gippsland Water": 0.182318105, "Wannon Water": 0.190773755, "Western Water": null, "Westernport Water": 0.222079982, "Yarra Valley Water": 0.188602026 },
    { year: "2022-23", "Barwon Water": 0.158645145, "Central Highlands Water": 0.182322244, "City West Water": null, "Coliban": 0.160558032, "East Gippsland Water": 0.176852672, "Goulburn Murray Water": 0.177616204, "Goulburn Valley Water": 0.182597437, "Greater Western Water": 0.166751846, "GWMWater": 0.197270919, "Lower Murray Water": 0.189100838, "Melbourne Water": 0.160766813, "NE Water": 0.234669918, "South East Water": 0.155862372, "South Gippsland Water": 0.177926557, "Wannon Water": 0.171537358, "Western Water": null, "Westernport Water": 0.1967715, "Yarra Valley Water": 0.173836202 },
    { year: "2023-24", "Barwon Water": 0.165688229, "Central Highlands Water": 0.181077022, "City West Water": null, "Coliban": 0.168143694, "East Gippsland Water": 0.181619575, "Goulburn Murray Water": 0.177691161, "Goulburn Valley Water": 0.203789742, "Greater Western Water": 0.175521958, "GWMWater": 0.210472204, "Lower Murray Water": 0.195362917, "Melbourne Water": 0.165982001, "NE Water": 0.21449654, "South East Water": 0.177098174, "South Gippsland Water": 0.173198733, "Wannon Water": 0.175665947, "Western Water": null, "Westernport Water": 0.215441385, "Yarra Valley Water": 0.189905275 },
    { year: "2024-25", "Barwon Water": null, "Central Highlands Water": null, "City West Water": null, "Coliban": 0.183387331, "East Gippsland Water": 0.295531197, "Goulburn Murray Water": null, "Goulburn Valley Water": null, "Greater Western Water": null, "GWMWater": null, "Lower Murray Water": null, "Melbourne Water": null, "NE Water": 0.220510846, "South East Water": null, "South Gippsland Water": null, "Wannon Water": 0.202735532, "Western Water": null, "Westernport Water": 0.237447066, "Yarra Valley Water": 0.22122409 }
  ];

  const corporations = [
    "Barwon Water", "Central Highlands Water", "City West Water", "Coliban",
    "East Gippsland Water", "Goulburn Murray Water", "Goulburn Valley Water",
    "Greater Western Water", "GWMWater", "Lower Murray Water", "Melbourne Water",
    "NE Water", "South East Water", "South Gippsland Water", "Wannon Water",
    "Western Water", "Westernport Water", "Yarra Valley Water"
  ];

  const colors = [
    '#2563eb', '#ea580c', '#16a34a', '#9333ea', '#0891b2', '#f97316', '#ec4899',
    '#14b8a6', '#f59e0b', '#6366f1', '#0ea5e9', '#ef4444', '#84cc16', '#d946ef',
    '#64748b', '#22d3ee', '#fb7185', '#a855f7'
  ];

  const quickSets = [
    {
      label: 'Metro Core',
      description: 'High-demand utilities across Melbourne & Geelong',
      corps: [
        'Melbourne Water',
        'City West Water',
        'South East Water',
        'Yarra Valley Water',
        'Greater Western Water',
        'Barwon Water'
      ]
    },
    {
      label: 'Regional North',
      description: 'Agriculture-heavy inland networks',
      corps: [
        'Goulburn Murray Water',
        'Goulburn Valley Water',
        'Lower Murray Water',
        'GWMWater',
        'Coliban',
        'NE Water'
      ]
    },
    {
      label: 'Statewide',
      description: 'Full comparison across 18 corporations',
      corps: corporations
    }
  ];

  const defaultSelection = quickSets[0].corps.filter((corp) => corporations.includes(corp));

  const [selectedCorps, setSelectedCorps] = useState(defaultSelection);
  const [hoveredCorp, setHoveredCorp] = useState(null);
  const [showForecast, setShowForecast] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const calculateForecast = (corp) => {
    const values = rawData
      .map((d, i) => ({ year: i, value: d[corp] }))
      .filter((d) => d.value !== null);

    if (values.length < 3) return null;

    const n = values.length;
    const sumX = values.reduce((sum, d) => sum + d.year, 0);
    const sumY = values.reduce((sum, d) => sum + d.value, 0);
    const sumXY = values.reduce((sum, d) => sum + d.year * d.value, 0);
    const sumXX = values.reduce((sum, d) => sum + d.year * d.year, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return intercept + slope * 12;
  };

  const dataWithForecast = useMemo(() => {
    if (!showForecast) return rawData;
    const forecastData = { year: '2025-26 (forecast)' };
    corporations.forEach((corp) => {
      forecastData[corp] = calculateForecast(corp);
    });
    return [...rawData, forecastData];
  }, [showForecast]);

  const filteredCorporations = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return corporations;
    return corporations.filter((corp) => corp.toLowerCase().includes(term));
  }, [corporations, searchQuery]);

  const latestYearData = rawData[rawData.length - 1];
  const previousYearData = rawData[rawData.length - 2];

  const computeAverage = (dataset, corps = corporations) => {
    if (!dataset) return null;
    const values = corps
      .map((corp) => dataset[corp])
      .filter((value) => value !== null && value !== undefined);
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const metrics = useMemo(() => {
    const avgLatest = computeAverage(latestYearData);
    const avgPrev = computeAverage(previousYearData);
    const avgDeltaPct = avgLatest && avgPrev ? ((avgLatest - avgPrev) / avgPrev) * 100 : null;
    const selectedAvg = computeAverage(latestYearData, selectedCorps);

    const latestEntries = corporations
      .map((corp) => ({ corp, value: latestYearData?.[corp] ?? null }))
      .filter((entry) => entry.value !== null)
      .sort((a, b) => b.value - a.value);

    const highest = latestEntries[0] || { corp: 'N/A', value: null };
    const lowest = latestEntries[latestEntries.length - 1] || { corp: 'N/A', value: null };

    const volatility =
      corporations
        .map((corp) => {
          const values = rawData.map((row) => row[corp]).filter((value) => value !== null);
          if (values.length < 2) return null;
          const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
          const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
          return { corp, stdev: Math.sqrt(variance) };
        })
        .filter(Boolean)
        .sort((a, b) => b.stdev - a.stdev)[0] || { corp: 'N/A', stdev: null };

    return { avgLatest, avgPrev, avgDeltaPct, selectedAvg, highest, lowest, volatility };
  }, [latestYearData, previousYearData, selectedCorps]);

  const formatValue = (value, digits = 3) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return `$${value.toFixed(digits)}`;
  };

  const formatDelta = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    const symbol = value >= 0 ? '+' : '';
    return `${symbol}${value.toFixed(1)}%`;
  };

  const toggleCorporation = (corp) => {
    setSelectedCorps((prev) =>
      prev.includes(corp) ? prev.filter((c) => c !== corp) : [...prev, corp]
    );
  };

  const applyQuickSet = (corps) => {
    setSelectedCorps(corps.filter((corp) => corporations.includes(corp)));
    setSearchQuery('');
  };

  const highlightCorp = hoveredCorp || metrics.highest.corp;
  const highlightValue = hoveredCorp
    ? latestYearData?.[hoveredCorp] ?? null
    : metrics.highest.value;
  const selectionCoverage = Math.round((selectedCorps.length / corporations.length) * 100);
  const forecastableCount = corporations.reduce(
    (count, corp) => (calculateForecast(corp) !== null ? count + 1 : count),
    0
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!(active && payload && payload.length)) return null;
    const isForecast = label.includes('forecast');
    return (
      <div className="rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
          {isForecast ? 'Projected' : 'Actual'} · {label}
        </p>
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 text-sm">
          {[...payload]
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((entry, index) => (
              <div key={`${entry.name}-${index}`} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-900" style={{ color: entry.color }}>
                  {entry.value ? `$${entry.value.toFixed(3)}` : 'N/A'}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const StatCard = ({ label, value, helper, tone = 'neutral' }) => (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {helper && (
        <p
          className={`mt-1 text-xs font-medium ${
            tone === 'up'
              ? 'text-emerald-600'
              : tone === 'down'
              ? 'text-rose-600'
              : 'text-slate-500'
          }`}
        >
          {helper}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
        <header className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-indigo-500">
                Electricity Insights
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                Victoria Water Corporations
              </h1>
              <p className="mt-2 text-base text-slate-500">
                Actual costs from FY{rawData[0].year} to FY{rawData[rawData.length - 1].year} with a simple FY2025-26 projection.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                {rawData[0].year} – {rawData[rawData.length - 1].year}
              </span>
              <button
                onClick={() => setShowForecast((prev) => !prev)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  showForecast
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {showForecast ? 'Forecast shown' : 'Actuals only'}
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              label="Avg Cost (latest)"
              value={formatValue(metrics.avgLatest)}
              helper={`${formatDelta(metrics.avgDeltaPct)} vs ${previousYearData?.year ?? 'prior FY'}`}
              tone={metrics.avgDeltaPct && metrics.avgDeltaPct <= 0 ? 'up' : 'down'}
            />
            <StatCard
              label="Selection Avg"
              value={formatValue(metrics.selectedAvg)}
              helper={`${selectedCorps.length} of ${corporations.length} corps`}
            />
            <StatCard
              label="Highest Latest"
              value={formatValue(metrics.highest.value)}
              helper={metrics.highest.corp}
            />
            <StatCard
              label="Most Volatile"
              value={metrics.volatility.stdev ? `${(metrics.volatility.stdev * 100).toFixed(1)}¢` : '—'}
              helper={metrics.volatility.corp}
            />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <aside className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Selection</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedCorps.length} corporations</h2>
                <p className="text-sm text-slate-500">{selectionCoverage}% of statewide grid</p>
              </div>
              <button
                onClick={() => setSelectedCorps(defaultSelection)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300"
              >
                Reset
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCorps(corporations)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedCorps([])}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Quick sets</p>
              <div className="space-y-2">
                {quickSets.map((set) => (
                  <button
                    key={set.label}
                    onClick={() => applyQuickSet(set.corps)}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                      <span>{set.label}</span>
                      <span className="text-xs text-slate-400">{set.corps.length} corps</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{set.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Search</label>
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Find a corporation"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
                />
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {filteredCorporations.map((corp) => {
                const color = colors[corporations.indexOf(corp) % colors.length];
                const isActive = selectedCorps.includes(corp);
                return (
                  <button
                    key={corp}
                    onClick={() => toggleCorporation(corp)}
                    onMouseEnter={() => setHoveredCorp(corp)}
                    onMouseLeave={() => setHoveredCorp(null)}
                    className={`w-full rounded-2xl border px-4 py-2 text-left text-sm transition ${
                      isActive
                        ? 'border-slate-200 bg-white shadow-sm'
                        : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-white'
                    } ${hoveredCorp === corp ? 'ring-2 ring-indigo-100' : ''}`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {corp}
                      </span>
                      {isActive && <span className="text-xs font-semibold text-slate-500">Active</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Trend explorer</p>
                <h2 className="text-2xl font-semibold text-slate-900">Cost per kWh</h2>
                <p className="text-sm text-slate-500">{forecastableCount} corporations have enough history for forecasting.</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Highlight</p>
                <p className="text-lg font-semibold text-slate-900">{highlightCorp}</p>
                <p className="text-sm text-slate-500">{formatValue(highlightValue)} latest actual</p>
              </div>
            </div>

            {selectedCorps.length ? (
              <div className="h-[520px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataWithForecast} margin={{ top: 20, right: 40, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#475569', fontSize: 11 }}
                      tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                      axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                      tickLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                      axisLine={{ stroke: 'rgba(148,163,184,0.5)' }}
                      label={{
                        value: 'Cost ($/kWh)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#475569', fontSize: 12, fontWeight: 600 }
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5 5' }} />
                    {selectedCorps.map((corp) => {
                      const paletteIndex = corporations.indexOf(corp) % colors.length;
                      const stroke = colors[paletteIndex];
                      return (
                        <Line
                          key={corp}
                          type="monotone"
                          dataKey={corp}
                          stroke={stroke}
                          strokeWidth={hoveredCorp === corp ? 4 : 2.2}
                          strokeOpacity={hoveredCorp ? (hoveredCorp === corp ? 1 : 0.25) : 0.95}
                          dot={(props) => {
                            const isForecast = props.payload.year?.includes('forecast');
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={isForecast ? 5 : hoveredCorp === corp ? 4.5 : 3}
                                fill={isForecast ? '#f97316' : stroke}
                                stroke={isForecast ? '#fb923c' : '#ffffff'}
                                strokeWidth={isForecast ? 2 : 1.5}
                              />
                            );
                          }}
                          activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                          connectNulls={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 text-center text-slate-500">
                <p className="text-lg font-semibold text-slate-600">Select a corporation</p>
                <p className="text-sm">Use the panel on the left to add series back into the chart.</p>
              </div>
            )}

            {selectedCorps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCorps.map((corp) => (
                  <span
                    key={`${corp}-legend`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: colors[corporations.indexOf(corp) % colors.length] }}
                    />
                    {corp}
                  </span>
                ))}
              </div>
            )}

            <div className="grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Highest latest</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{metrics.highest.corp}</p>
                <p className="text-slate-500">{formatValue(metrics.highest.value)}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Most affordable</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{metrics.lowest.corp}</p>
                <p className="text-slate-500">{formatValue(metrics.lowest.value)}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Forecast ready</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{forecastableCount} / {corporations.length}</p>
                <p className="text-slate-500">Corps with ≥3 historical points</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WaterCorpsChart;
