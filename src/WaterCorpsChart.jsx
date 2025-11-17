import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    '#1e40af', '#dc2626', '#15803d', '#ea580c', '#7c3aed', '#0891b2', '#be185d',
    '#65a30d', '#0d9488', '#a21caf', '#4338ca', '#991b1b', '#047857', '#c2410c',
    '#6d28d9', '#0e7490', '#9f1239', '#84cc16'
  ];

  const [selectedCorps, setSelectedCorps] = useState(corporations.slice(0, 5));
  const [hoveredCorp, setHoveredCorp] = useState(null);
  const [showForecast, setShowForecast] = useState(false);

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
      const isForecast = label.includes('forecast');
      return (
        <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 mb-2">
            {label}
            {isForecast && <span className="text-xs ml-2 text-orange-600">(Projected)</span>}
          </p>
          {payload
            .sort((a, b) => b.value - a.value)
            .map((entry, index) => (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {entry.value ? `$${entry.value.toFixed(4)}/kWh` : 'N/A'}
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Water Corporations Cost per kWh ($/kWh)</h1>
        <p className="text-gray-600 mb-4">Interactive time series visualization (2013-2025)</p>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Select Corporations:</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForecast(!showForecast)}
                className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
                  showForecast
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showForecast ? '📊 Forecast ON' : '📈 Show Forecast'}
              </button>
              <button
                onClick={() => setSelectedCorps(corporations)}
                className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedCorps([])}
                className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {corporations.map((corp, index) => (
              <button
                key={corp}
                onClick={() => toggleCorporation(corp)}
                onMouseEnter={() => setHoveredCorp(corp)}
                onMouseLeave={() => setHoveredCorp(null)}
                className={`px-2 py-1 text-xs rounded border transition-all ${
                  selectedCorps.includes(corp)
                    ? 'border-transparent shadow-sm font-medium'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                } ${hoveredCorp === corp ? 'ring-2 ring-blue-300 transform scale-105' : ''}`}
                style={{
                  backgroundColor: selectedCorps.includes(corp) ? colors[index] : 'white',
                  color: selectedCorps.includes(corp) ? 'white' : colors[index]
                }}
                title={corp}
              >
                {corp.length > 15 ? corp.substring(0, 13) + '...' : corp}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={dataWithForecast} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#374151', fontSize: 11 }}
              tickLine={{ stroke: '#9ca3af' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: '#374151' }}
              tickLine={{ stroke: '#9ca3af' }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              label={{ value: '$/kWh', angle: -90, position: 'insideLeft', style: { fill: '#374151', fontWeight: 'bold' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {selectedCorps.map((corp, index) => (
              <Line
                key={corp}
                type="monotone"
                dataKey={corp}
                stroke={colors[corporations.indexOf(corp)]}
                strokeWidth={hoveredCorp === corp ? 4 : 2}
                strokeDasharray={showForecast ? "0 0 0 0 0 0 0 0 0 0 0 0 5 5" : "0"}
                dot={(props) => {
                  const isForecast = props.payload.year?.includes('forecast');
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={isForecast ? 5 : (hoveredCorp === corp ? 5 : 2)}
                      fill={isForecast ? '#f97316' : props.stroke}
                      stroke={isForecast ? '#ea580c' : props.stroke}
                      strokeWidth={isForecast ? 2 : 0}
                    />
                  );
                }}
                activeDot={{ r: 6 }}
                connectNulls={false}
                opacity={hoveredCorp ? (hoveredCorp === corp ? 1 : 0.3) : 1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <p><strong>💡 Tips:</strong> Click corporation buttons to show/hide. Hover to highlight. Click "Show Forecast" to project 2025-26 values.</p>
          <p><strong>📈 Forecast:</strong> Uses linear regression on historical data (dashed line with orange dots).</p>
        </div>
      </div>
    </div>
  );
};

export default WaterCorpsChart;
