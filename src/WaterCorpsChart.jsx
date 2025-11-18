import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e',
    '#84cc16', '#14b8a6', '#d946ef', '#6366f1', '#f87171', '#059669', '#fb923c',
    '#a855f7', '#0ea5e9', '#ec4899', '#65a30d'
  ];

  const [selectedCorps, setSelectedCorps] = useState(corporations.slice(0, 6));
  const [chartView, setChartView] = useState('line');
  const [isAnimated, setIsAnimated] = useState(false);
  const [hoveredCorp, setHoveredCorp] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const [sortOrder, setSortOrder] = useState('alphabetical');

  // Animation on mount
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const sortedCorporations = useMemo(() => {
    return [...corporations].sort((a, b) => {
      switch (sortOrder) {
        case 'alphabetical':
          return a.localeCompare(b);
        case 'recent':
          const latestA = rawData[rawData.length - 1][a];
          const latestB = rawData[rawData.length - 1][b];
          return (latestB || 0) - (latestA || 0);
        case 'high-low':
          const avgA = rawData.reduce((sum, d) => sum + (d[a] || 0), 0) / rawData.length;
          const avgB = rawData.reduce((sum, d) => sum + (d[b] || 0), 0) / rawData.length;
          return avgB - avgA;
        default:
          return 0;
      }
    });
  }, [sortOrder]);

  // Forecast calculation
  const calculateForecast = (corp) => {
    const values = rawData
      .map((d, i) => ({ year: i, value: d[corp] }))
      .filter(d => d.value !== null);

    if (values.length < 3) return null;

    const n = values.length;
    const sumX = values.reduce((sum, d) => sum + d.year, 0);
    const sumY = values.reduce((sum, d) => sum + d.value, 0);
    const sumXY = values.reduce((sum, d) => sum + d.year * d.value, 0);
    const sumXX = values.reduce((sum, d) => sum + d.year * d.year, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return intercept + slope * 13;
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
      const isForecast = label.includes('forecast');
      return (
        <div className="glass p-4 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-3 border-b border-white/20 pb-2">
            <p className="font-bold text-white text-base">{label}</p>
            {isForecast && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                📈 Projected
              </span>
            )}
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {payload
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => (
                <div key={index} className="flex items-center justify-between gap-4 hover:bg-white/10 rounded-lg p-2 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-white/90">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white" style={{ color: entry.color }}>
                    ${entry.value ? entry.value.toFixed(4) : '-'}
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 md:p-8 transition-all duration-1000 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass rounded-3xl p-6 md:p-8 mb-8 hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 font-space">
                💧 Water Analytics
              </h1>
              <p className="text-white/80 text-lg font-light">
                Victoria Water Corporations • Electricity Cost Intelligence
              </p>
              <div className="mt-3 flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live Data
                </span>
                <span>📊 12 Years Analysis</span>
                <span>🏢 18 Corporations</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-mono font-bold text-white">
                  ${(selectedCorps.length > 0 ? 
                    selectedCorps.reduce((avg, corp) => avg + (rawData[rawData.length - 1][corp] || 0), 0) / selectedCorps.length : 0
                  ).toFixed(4)}
                </div>
                <div className="text-white/60 text-xs uppercase tracking-wide">Latest Average</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl text-white">🏢</div>
              <div className="text-white/90 font-semibold">{corporations.length} Corporations</div>
              <div className="text-white/60 text-sm">Victoria-wide Coverage</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl text-white">⏱️</div>
              <div className="text-white/90 font-semibold">12 Years Analysis</div>
              <div className="text-white/60 text-sm">Historical Trends</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl text-white">🔮</div>
              <div className="text-white/90 font-semibold">AI Forecast</div>
              <div className="text-white/60 text-sm">2025-26 Projections</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-semibold">Interactive Analysis</h2>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {selectedCorps.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setChartView('line')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  chartView === 'line' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                📈 Line Chart
              </button>
              <button
                onClick={() => setChartView('area')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  chartView === 'area' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                🏔️ Area Chart
              </button>
              <button
                onClick={() => setShowForecast(!showForecast)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  showForecast 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                🔮 Forecast
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCorps(corporation.sortedCorporations)}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedCorps([])}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Clear Selection
            </button>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 text-sm"
            >
              <option value="alphabetical">📝 Alphabetical</option>
              <option value="recent">📊 Latest Data</option>
              <option value="high-low">💰 Cost Ranking</option>
            </select>
          </div>

          {/* Corporation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {sortedCorporations.map((corp, index) => (
              <button
                key={corp}
                onClick={() => toggleCorporation(corp)}
                onMouseEnter={() => setHoveredCorp(corp)}
                onMouseLeave={() => setHoveredCorp(null)}
                className={`relative group px-3 py-2 text-xs font-medium rounded-xl border-2 transition-all duration-300 ${
                  selectedCorps.includes(corp)
                    ? 'shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-white/5 hover:bg-white/10 border-white/20'
                } ${hoveredCorp === corp ? 'ring-4 ring-blue-400/20 scale-105 z-10' : ''}`}
                style={{
                  backgroundColor: selectedCorps.includes(corp) ? colors[index] : undefined,
                  color: selectedCorps.includes(corp) ? 'white' : 'white/90',
                  borderColor: selectedCorps.includes(corp) ? colors[index] : 'rgba(255,255,255,0.2)'
                }}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {selectedCorps.includes(corp) && <span className="text-xs">✓</span>}
                  <span className="truncate">{corp}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="h-96 md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'line' ? (
                <LineChart data={dataWithForecast} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.2"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} stroke="rgba(255,255,255,0.2)" />
                  <YAxis 
                    tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} 
                    stroke="rgba(255,255,255,0.2)" 
                    tickFormatter={(value) => `$${value.toFixed(3)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ color: 'rgba(255,255,255,0.9)', paddingTop: '20px' }}
                  />
                  {selectedCorps.map((corp, index) => (
                    <Line
                      key={corp}
                      type="monotone"
                      dataKey={corp}
                      stroke={colors[corporations.indexOf(corp)]}
                      strokeWidth={hoveredCorp === corp ? 4 : 2.5}
                      fillOpacity={hoveredCorp ? (hoveredCorp === corp ? 1 : 0.3) : 1}
                      dot={{ r: hoveredCorp === corp ? 6 : 4, fill: colors[corporations.indexOf(corp)] }}
                      activeDot={{ r: 8, stroke: 'white', strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <AreaChart data={dataWithForecast} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.2"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} stroke="rgba(255,255,255,0.2)" />
                  <YAxis 
                    tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} 
                    stroke="rgba(255,255,255,0.2)" 
                    tickFormatter={(value) => `$${value.toFixed(3)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ color: 'rgba(255,255,255,0.9)', paddingTop: '20px' }}
                  />
                  {selectedCorps.map((corp, index) => {
                    const color = colors[corporations.indexOf(corp)];
                    return (
                      <Area
                        key={corp}
                        type="monotone"
                        dataKey={corp}
                        stroke={color}
                        fill={`${color}40`}
                        strokeWidth={hoveredCorp === corp ? 4 : 2.5}
                        fillOpacity={hoveredCorp ? (hoveredCorp === corp ? 0.4 : 0.1) : 0.2}
                      />
                    );
                  })}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Info */}
        <div className="glass rounded-2xl p-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Interactive Visualization</h3>
                <p className="text-sm text-white/70">
                  Hover over corporation buttons to highlight trends on the chart. Toggle chart types and enable forecasting for insights.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <span className="text-xl">🔮</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">AI Forecasting</h3>
                <p className="text-sm text-white/70">
                  Linear regression analysis provides 2025-26 projections based on historical electricity cost trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterCorpsChart;