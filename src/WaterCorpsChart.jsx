import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import waterCosts from '../data/water_costs.json';

const fallbackData = waterCosts;

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

const WaterCorpsChart = () => {
  const [rawData, setRawData] = useState(fallbackData);

  const [selectedCorps, setSelectedCorps] = useState(corporations.slice(0, 5));
  const [hoveredCorp, setHoveredCorp] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [dataSource, setDataSource] = useState('fallback');
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/water-costs');
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload = await response.json();
        if (!payload?.data?.length) {
          throw new Error('No rows returned from database');
        }

        if (!cancelled) {
          setRawData(payload.data);
          setDataSource('vercel-postgres');
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message);
          setDataSource('fallback');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingLive(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

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
  }, [showForecast, rawData]);

  const toggleCorporation = (corp) => {
    setSelectedCorps(prev =>
      prev.includes(corp)
        ? prev.filter(c => c !== corp)
        : [...prev, corp]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isForecast = label.includes('forecast');
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-2xl">
          <p className="font-bold text-gray-900 mb-3 text-base border-b border-gray-200 pb-2">
            {label}
            {isForecast && <span className="text-xs ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Projected</span>}
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {payload
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: entry.color }}>
                    {entry.value ? `$${entry.value.toFixed(4)}` : 'N/A'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Victoria Water Corporations
              </h1>
              <p className="text-gray-600 text-lg">Electricity Cost Analysis ($/kWh)</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold">2013-2025</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Tracking electricity costs across 18 Victorian water corporations over 12 years
          </p>
          <div className="mt-3 space-y-1">
            <p
              className={`text-xs font-semibold ${
                isLoadingLive
                  ? 'text-blue-100'
                  : dataSource === 'vercel-postgres'
                    ? 'text-emerald-100'
                    : 'text-amber-100'
              }`}
            >
              {isLoadingLive
                ? 'Loading live data from Vercel Postgres...'
                : dataSource === 'vercel-postgres'
                  ? 'Live data served from Vercel Postgres'
                  : 'Using bundled snapshot until the database import runs'}
            </p>
            {loadError && (
              <p className="text-xs text-amber-100">
                {loadError}
              </p>
            )}
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Controls Section */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Filter Corporations
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {selectedCorps.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowForecast(!showForecast)}
                  className={`group relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    showForecast
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:text-orange-600'
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
                  className="px-4 py-2.5 text-sm font-semibold bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
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
                      : 'bg-white/70 hover:bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
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
          <div className="p-6 bg-white">
            <ResponsiveContainer width="100%" height={550}>
              <LineChart data={dataWithForecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.2"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="url(#gridGradient)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
                  tickLine={{ stroke: '#9ca3af' }}
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  stroke="#d1d5db"
                />
                <YAxis
                  tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
                  tickLine={{ stroke: '#9ca3af' }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  label={{
                    value: 'Cost ($/kWh)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#374151', fontWeight: 'bold', fontSize: 14 }
                  }}
                  stroke="#d1d5db"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Legend
                  wrapperStyle={{ paddingTop: '30px' }}
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
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">How to Use</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Click corporation chips to toggle visibility. Hover over chips to highlight specific trend lines on the chart. Enable forecast mode to view projected 2025-26 values.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/60 p-4 rounded-xl">
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Forecast Methodology</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
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
