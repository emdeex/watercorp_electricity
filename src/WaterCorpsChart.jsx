import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import csvRaw from './data/watercorps.csv?raw';

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseEnergyRecords = (raw) => {
  if (!raw) return [];
  const [headerLine, ...lines] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(',');

  return lines
    .map((line) => {
      if (!line.trim()) return null;
      const cells = line.split(',');
      const record = {};
      headers.forEach((header, index) => {
        record[header] = cells[index] ?? '';
      });

      const utility = (record.Utility_Name || '').trim();
      if (!utility || utility.toUpperCase() === 'TOTAL') return null;

      return {
        utility,
        year: record.Year,
        kWh: parseNumber(record.kWh),
        spend: parseNumber(record.Value),
        ratio: parseNumber(record.Ratio),
      };
    })
    .filter(Boolean);
};

const yearSortValue = (label) => {
  if (!label) return 0;
  const [start] = label.split('-');
  const numeric = parseInt(start, 10);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const formatYearRange = (years) => {
  if (!years.length) return 'N/A';
  if (years.length === 1) return years[0];
  return `${years[0]} - ${years[years.length - 1]}`;
};

const formatMillionsAUD = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const billions = value / 1_000_000_000;
  if (billions >= 1) {
    return `A$${billions.toFixed(2)}B`;
  }
  return `A$${(value / 1_000_000).toFixed(1)}M`;
};

const formatGigawattHours = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const terawattHours = value / 1_000_000_000;
  if (terawattHours >= 1) {
    return `${terawattHours.toFixed(2)} TWh`;
  }
  return `${(value / 1_000_000).toFixed(1)} GWh`;
};

const WaterCorpsChart = () => {
  const fallbackData = [
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
    '#1e40af', '#dc2626', '#15803d', '#ea580c', '#7c3aed', '#0891b2', '#be185d',
    '#65a30d', '#0d9488', '#a21caf', '#4338ca', '#991b1b', '#047857', '#c2410c',
    '#6d28d9', '#0e7490', '#9f1239', '#84cc16'
  ];

  const [selectedCorps, setSelectedCorps] = useState(corporations.slice(0, 5));
  const [hoveredCorp, setHoveredCorp] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const energyRecords = useMemo(() => parseEnergyRecords(csvRaw), [csvRaw]);
  const recordLookup = useMemo(() => {
    if (!energyRecords.length) return {};
    const map = {};
    energyRecords.forEach((record) => {
      if (!record.utility || !record.year) return;
      map[`${record.utility}__${record.year}`] = record;
    });
    return map;
  }, [energyRecords, corporations]);

  const ratioSeries = useMemo(() => {
    if (!energyRecords.length) return [];
    const yearMap = new Map();
    energyRecords.forEach((record) => {
      if (!record.year || !record.utility) return;
      if (!yearMap.has(record.year)) {
        const entry = { year: record.year };
        corporations.forEach((corp) => {
          entry[corp] = null;
        });
        yearMap.set(record.year, entry);
      }
      if (corporations.includes(record.utility) && record.ratio !== null) {
        yearMap.get(record.year)[record.utility] = record.ratio;
      }
    });
    return Array.from(yearMap.values()).sort((a, b) => yearSortValue(a.year) - yearSortValue(b.year));
  }, [energyRecords]);

  const rawData = ratioSeries.length ? ratioSeries : fallbackData;
  const energyYears = useMemo(() => {
    const uniqueYears = new Set();
    energyRecords.forEach((record) => {
      if (record.year) uniqueYears.add(record.year);
    });
    return Array.from(uniqueYears).sort((a, b) => yearSortValue(a) - yearSortValue(b));
  }, [energyRecords]);

  const energyTotals = useMemo(() => {
    if (!energyRecords.length) {
      return { totalSpend: null, totalKWh: null };
    }

    return energyRecords.reduce(
      (acc, record) => {
        acc.totalSpend += record.spend || 0;
        acc.totalKWh += record.kWh || 0;
        return acc;
      },
      { totalSpend: 0, totalKWh: 0 }
    );
  }, [energyRecords]);

  const energyRangeLabel = useMemo(() => formatYearRange(energyYears), [energyYears]);

  const chartYears = rawData.map((entry) => entry.year).filter(Boolean);
  const chartRangeLabel = chartYears.length ? `${chartYears[0]} - ${chartYears[chartYears.length - 1]}` : '';

  const pageBackgroundClass = isDarkMode
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100'
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900';

  const glassPanelClass = isDarkMode
    ? 'bg-slate-900/80 border border-slate-800'
    : 'bg-white/80 border border-gray-100';

  const infoCardBackground = isDarkMode ? 'bg-slate-800/60 border border-slate-700' : 'bg-white/60 border border-gray-200';
  const gradientFooterClass = isDarkMode
    ? 'bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800'
    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200';
  const chartSectionBg = isDarkMode ? 'bg-slate-950/40' : 'bg-white';

  const mutedTextClass = isDarkMode ? 'text-slate-300' : 'text-gray-600';
  const captionTextClass = isDarkMode ? 'text-slate-400' : 'text-gray-500';
  const controlsBackgroundClass = isDarkMode
    ? 'bg-gradient-to-r from-slate-900 to-slate-900 border-b border-slate-800'
    : 'bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200';

  const clearButtonClass = isDarkMode
    ? 'bg-slate-900/60 text-slate-200 border-2 border-slate-700 hover:bg-slate-800 hover:border-slate-500'
    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400';

  const forecastOffClass = isDarkMode
    ? 'bg-slate-900/60 text-slate-200 border-2 border-slate-700 hover:border-orange-400 hover:text-orange-300'
    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:text-orange-600';

  const chipBaseClass = isDarkMode
    ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-700 hover:border-slate-500 hover:shadow-sm'
    : 'bg-white/70 hover:bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm';

  const tooltipContainerClass = isDarkMode
    ? 'bg-slate-900/95 backdrop-blur-sm p-4 border border-slate-700 rounded-xl shadow-2xl'
    : 'bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-2xl';
  const tooltipTitleClass = isDarkMode ? 'text-slate-100' : 'text-gray-900';
  const tooltipMutedClass = isDarkMode ? 'text-slate-300' : 'text-gray-700';
  const tooltipDetailClass = isDarkMode ? 'text-slate-400' : 'text-gray-500';

  const themeToggleClass = isDarkMode
    ? 'bg-slate-800 text-slate-100 border border-slate-600 hover:bg-slate-700'
    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50';

  const axisTickColor = isDarkMode ? '#e5e7eb' : '#4b5563';
  const axisLineColor = isDarkMode ? '#475569' : '#d1d5db';
  const axisLabelColor = isDarkMode ? '#e5e7eb' : '#374151';
  const cursorColor = isDarkMode ? '#fca5a5' : '#6366f1';
  const gridGradientStart = isDarkMode ? '#475569' : '#e5e7eb';
  const gridGradientEnd = isDarkMode ? 'rgba(71, 85, 105, 0.2)' : '#e5e7eb';

  // Calculate simple linear forecast for next year
  const calculateForecast = (corp) => {
    const values = rawData
      .map((d, i) => ({ year: i, value: d[corp] }))
      .filter(d => d.value !== null);

    if (values.length < 3) return null;

    // Simple linear regression
    const n = values.length;
    const sumX = values.reduce((sum, d) => sum + d.year, 0);
    const sumY = values.reduce((sum, d) => sum + d.value, 0);
    const sumXY = values.reduce((sum, d) => sum + d.year * d.value, 0);
    const sumXX = values.reduce((sum, d) => sum + d.year * d.year, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Forecast for year index 12 (2025-26)
    return intercept + slope * 12;
  };

  const dataWithForecast = useMemo(() => {
    if (!showForecast) return rawData;

    const forecastData = { year: "2025-26 (forecast)" };
    corporations.forEach(corp => {
      forecastData[corp] = calculateForecast(corp);
    });

    return [...rawData, forecastData];
  }, [showForecast]);

  const toggleCorporation = (corp) => {
    setSelectedCorps(prev =>
      prev.includes(corp)
        ? prev.filter(c => c !== corp)
        : [...prev, corp]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isForecast = label?.includes('forecast');
      return (
        <div className={tooltipContainerClass}>
          <p className={`font-bold ${tooltipTitleClass} mb-3 text-base border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} pb-2`}>
            {label}
            {isForecast && (
              <span
                className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                  isDarkMode ? 'bg-orange-900/30 text-orange-200' : 'bg-orange-100 text-orange-700'
                }`}
              >
                Projected
              </span>
            )}
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {payload
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => {
                const record = recordLookup[`${entry.name}__${label}`];
                return (
                  <div key={index} className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className={`text-sm font-medium ${tooltipMutedClass}`}>{entry.name}</span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="block text-sm font-bold" style={{ color: entry.color }}>
                        {entry.value !== null && entry.value !== undefined ? `$${entry.value.toFixed(4)}` : 'N/A'}
                      </span>
                      {record && (
                        <div className={`text-xs ${tooltipDetailClass}`}>
                          <p>Spend: {record.spend ? formatMillionsAUD(record.spend) : 'N/A'}</p>
                          <p>Usage: {record.kWh ? formatGigawattHours(record.kWh) : 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen ${pageBackgroundClass} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className={`${glassPanelClass} backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Victoria Water Corporations
              </h1>
              <p className={`${mutedTextClass} text-lg`}>Electricity Cost Analysis ($/kWh)</p>
            </div>
            <div className="flex flex-col gap-3 items-stretch md:items-end">
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-semibold">{chartRangeLabel || '2013-2025'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`${themeToggleClass} flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-colors`}
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314L7.05 7.05m11.314 11.314-1.414-1.414" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>
          <p className={`text-sm ${captionTextClass}`}>
            Tracking electricity spend, consumption, and cost efficiency across 18 Victorian water corporations.
          </p>
        </div>

        {/* Energy Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${infoCardBackground} rounded-2xl p-5 shadow-lg`}>
            <p className={`text-xs uppercase tracking-wide ${captionTextClass}`}>Portfolio energy spend</p>
            <p className="mt-3 text-3xl font-semibold">
              {formatMillionsAUD(energyTotals.totalSpend)}
            </p>
            <p className={`${mutedTextClass} text-xs mt-1`}>Nominal AUD across {energyRangeLabel}</p>
          </div>
          <div className={`${infoCardBackground} rounded-2xl p-5 shadow-lg`}>
            <p className={`text-xs uppercase tracking-wide ${captionTextClass}`}>Electricity consumed</p>
            <p className="mt-3 text-3xl font-semibold">
              {formatGigawattHours(energyTotals.totalKWh)}
            </p>
            <p className={`${mutedTextClass} text-xs mt-1`}>All utilities, {energyRangeLabel}</p>
          </div>
        </div>

        {/* Main Chart Card */}
        <div className={`${glassPanelClass} backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden`}>
          {/* Controls Section */}
          <div className={`p-6 ${controlsBackgroundClass}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h2 className={`text-sm font-bold uppercase tracking-wide ${isDarkMode ? 'text-slate-100' : 'text-gray-700'}`}>
                  Filter Corporations
                </h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedCorps.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowForecast(!showForecast)}
                  className={`group relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    showForecast
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                      : forecastOffClass
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {showForecast ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Forecast Active
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Show Forecast
                      </>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCorps(corporations)}
                  className="px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedCorps([])}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${clearButtonClass}`}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Corporation Chips */}
            <div className="flex flex-wrap gap-2">
              {corporations.map((corp, index) => (
                <button
                  key={corp}
                  onClick={() => toggleCorporation(corp)}
                  onMouseEnter={() => setHoveredCorp(corp)}
                  onMouseLeave={() => setHoveredCorp(null)}
                  className={`group relative px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all duration-200 ${
                    selectedCorps.includes(corp)
                      ? 'shadow-md transform hover:scale-105'
                      : chipBaseClass
                  } ${hoveredCorp === corp ? 'ring-4 ring-blue-200 ring-opacity-50 transform scale-105 z-10' : ''}`}
                  style={{
                    backgroundColor: selectedCorps.includes(corp) ? colors[index] : undefined,
                    color: selectedCorps.includes(corp) ? 'white' : colors[index],
                    borderColor: selectedCorps.includes(corp) ? colors[index] : undefined
                  }}
                  title={corp}
                >
                  <span className="flex items-center gap-1.5">
                    {selectedCorps.includes(corp) && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {corp.length > 15 ? corp.substring(0, 13) + '...' : corp}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className={`p-6 ${chartSectionBg}`}>
            <ResponsiveContainer width="100%" height={550}>
              <LineChart data={dataWithForecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gridGradientStart} stopOpacity="0.8"/>
                    <stop offset="100%" stopColor={gridGradientEnd} stopOpacity="0.2"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="url(#gridGradient)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: axisTickColor, fontSize: 11, fontWeight: 500 }}
                  tickLine={{ stroke: axisLineColor }}
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  stroke={axisLineColor}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 12, fontWeight: 500 }}
                  tickLine={{ stroke: axisLineColor }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  label={{
                    value: 'Cost ($/kWh)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: axisLabelColor, fontWeight: 'bold', fontSize: 14 }
                  }}
                  stroke={axisLineColor}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorColor, strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Legend
                  wrapperStyle={{ paddingTop: '30px', color: isDarkMode ? '#e2e8f0' : '#111827' }}
                  iconType="line"
                />
                {selectedCorps.map((corp, index) => (
                  <Line
                    key={corp}
                    type="monotone"
                    dataKey={corp}
                    stroke={colors[corporations.indexOf(corp)]}
                    strokeWidth={hoveredCorp === corp ? 4 : 2.5}
                    strokeDasharray={showForecast ? "0 0 0 0 0 0 0 0 0 0 0 0 5 5" : "0"}
                    dot={(props) => {
                      const isForecast = props.payload.year?.includes('forecast');
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={isForecast ? 6 : (hoveredCorp === corp ? 6 : 3)}
                          fill={isForecast ? '#f97316' : props.stroke}
                          stroke={isForecast ? '#ea580c' : 'white'}
                          strokeWidth={isForecast ? 2 : 2}
                          className="transition-all duration-200"
                        />
                      );
                    }}
                    activeDot={{ r: 7, strokeWidth: 3, stroke: 'white' }}
                    connectNulls={false}
                    opacity={hoveredCorp ? (hoveredCorp === corp ? 1 : 0.2) : 1}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Info Footer */}
          <div className={`p-6 ${gradientFooterClass} border-t`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className={`flex items-start gap-3 ${infoCardBackground} p-4 rounded-xl`}>
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How to Use</p>
                  <p className={`${mutedTextClass} text-xs leading-relaxed`}>
                    Click corporation chips to toggle visibility. Hover over chips to highlight specific trend lines on the chart. Enable forecast mode to view projected 2025-26 values.
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-3 ${infoCardBackground} p-4 rounded-xl`}>
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Forecast Methodology</p>
                  <p className={`${mutedTextClass} text-xs leading-relaxed`}>
                    Linear regression analysis on historical data (minimum 3 points). Projections shown as dashed lines with orange markers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterCorpsChart;
