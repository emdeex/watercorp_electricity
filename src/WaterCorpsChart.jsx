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
    '#7dd3fc', '#a5b4fc', '#f9a8d4', '#fcd34d', '#fb7185', '#34d399', '#60a5fa',
    '#f472b6', '#c4b5fd', '#f97316', '#2dd4bf', '#fde047', '#f87171', '#22d3ee',
    '#bef264', '#fbbf24', '#38bdf8', '#d8b4fe'
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
      <div className="bg-slate-900/90 text-slate-100 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          {isForecast ? 'Projected' : 'Actual'} · {label}
        </p>
        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 text-sm">
          {[...payload]
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((entry, index) => (
              <div key={`${entry.name}-${index}`} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-200">{entry.name}</span>
                </div>
                <span className="font-semibold" style={{ color: entry.color }}>
                  {entry.value ? `$${entry.value.toFixed(3)}` : 'N/A'}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const StatCard = ({ label, value, helper, tone = 'neutral' }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {helper && (
        <p
          className={`mt-1 text-xs ${
            tone === 'up'
              ? 'text-emerald-300'
              : tone === 'down'
              ? 'text-rose-300'
              : 'text-slate-400'
          }`}
        >
          {helper}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-16 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-[-120px] h-[360px] w-[360px] rounded-full bg-indigo-500/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_70px_rgba(2,6,23,0.65)] space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-cyan-200">
                Energy Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                Victoria Water Energy Spend
              </h1>
              <p className="mt-2 text-base text-slate-300">
                Electricity costs ($/kWh) across 18 corporations from FY2013-14 with a FY2025-26 projection.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <span className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                {rawData[0].year} — {rawData[rawData.length - 1].year}
              </span>
              <span
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
                  showForecast
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : 'border-slate-500/40 bg-slate-600/10 text-slate-200'
                }`}
              >
                {showForecast ? 'Forecast Enabled' : 'Actuals Only'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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

        <div className="grid gap-6 lg:grid-cols-[320px_auto]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Selection</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {selectedCorps.length} corporations
                </h2>
                <p className="text-sm text-slate-400">{selectionCoverage}% coverage of Victoria</p>
              </div>
              <button
                onClick={() => setSelectedCorps(defaultSelection)}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-white/60"
              >
                Reset
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowForecast((prev) => !prev)}
                className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  showForecast
                    ? 'border-orange-400/60 bg-orange-500/20 text-orange-100 shadow-md'
                    : 'border-slate-500/60 bg-slate-700/20 text-slate-200'
                }`}
              >
                {showForecast ? 'Hide Forecast' : 'Show Forecast'}
              </button>
              <button
                onClick={() => setSelectedCorps(corporations)}
                className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:border-cyan-300/70"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedCorps([])}
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/40"
              >
                Clear
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Quick sets</p>
              <div className="space-y-2">
                {quickSets.map((set) => (
                  <button
                    key={set.label}
                    onClick={() => applyQuickSet(set.corps)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-white/40"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>{set.label}</span>
                      <span className="text-xs text-slate-400">{set.corps.length} corps</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{set.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.35em] text-slate-400">Search</label>
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Find a corporation"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
                        ? 'border-white/40 bg-white/10 text-white shadow-lg'
                        : 'border-white/5 bg-slate-900/30 text-slate-200 hover:border-white/25'
                    } ${hoveredCorp === corp ? 'ring-2 ring-cyan-300/60' : ''}`}
                    style={{
                      borderColor: isActive ? color : undefined,
                      color: isActive ? 'white' : undefined
                    }}
                  >
                    <span className="flex items-center justify-between">
                      <span>{corp}</span>
                      {isActive && (
                        <span className="text-xs font-semibold" style={{ color }}>
                          Active
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Trend explorer</p>
                <h2 className="text-2xl font-semibold text-white">Cost per kWh</h2>
                <p className="text-sm text-slate-400">{forecastableCount} corporations support projections</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Highlight</p>
                <p className="text-lg font-semibold text-white">{highlightCorp}</p>
                <p className="text-sm text-slate-400">{formatValue(highlightValue)} (latest actual)</p>
              </div>
            </div>

            {selectedCorps.length ? (
              <div className="h-[520px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataWithForecast} margin={{ top: 20, right: 40, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#cbd5f5', fontSize: 11 }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                      angle={-35}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fill: '#cbd5f5', fontSize: 12, fontWeight: 500 }}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                      tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                      label={{
                        value: 'Cost ($/kWh)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#cbd5f5', fontSize: 12, fontWeight: 600 }
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5 5' }} />
                    {selectedCorps.map((corp) => {
                      const paletteIndex = corporations.indexOf(corp) % colors.length;
                      const stroke = colors[paletteIndex];
                      return (
                        <Line
                          key={corp}
                          type="monotone"
                          dataKey={corp}
                          stroke={stroke}
                          strokeWidth={hoveredCorp === corp ? 4 : 2.4}
                          strokeOpacity={hoveredCorp ? (hoveredCorp === corp ? 1 : 0.25) : 0.95}
                          dot={(props) => {
                            const isForecast = props.payload.year?.includes('forecast');
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={isForecast ? 5.5 : hoveredCorp === corp ? 5 : 3}
                                fill={isForecast ? '#f97316' : stroke}
                                stroke={isForecast ? '#fb923c' : '#0f172a'}
                                strokeWidth={isForecast ? 2 : 1.5}
                              />
                            );
                          }}
                          activeDot={{ r: 7, strokeWidth: 3, stroke: '#0f172a' }}
                          connectNulls={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">Select a corporation</p>
                <p className="text-sm">Use the chips on the left to add series back into the chart.</p>
              </div>
            )}

            {selectedCorps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCorps.map((corp) => (
                  <span
                    key={`${corp}-legend`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100"
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
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Highest latest</p>
                <p className="mt-1 text-lg font-semibold text-white">{metrics.highest.corp}</p>
                <p className="text-slate-300">{formatValue(metrics.highest.value)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Most affordable</p>
                <p className="mt-1 text-lg font-semibold text-white">{metrics.lowest.corp}</p>
                <p className="text-slate-300">{formatValue(metrics.lowest.value)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Forecast readiness</p>
                <p className="mt-1 text-lg font-semibold text-white">{forecastableCount} / {corporations.length}</p>
                <p className="text-slate-300">Corps with ≥3 historic points</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WaterCorpsChart;
