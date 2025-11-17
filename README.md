# Water Corporations Cost Chart

An interactive web application for visualizing water corporation costs per kWh across Victoria, Australia from 2013-2025.

## Features

- **Interactive Line Chart**: Visualize cost trends for 18 water corporations over 12 years
- **Corporation Selection**: Click buttons to show/hide specific corporations
- **Hover Highlighting**: Hover over corporation buttons to highlight their line on the chart
- **Forecast Mode**: Toggle linear regression forecast for 2025-26
- **Responsive Design**: Beautiful gradient background with modern UI
- **Custom Tooltips**: Detailed information on hover with sorted values

## Tech Stack

- **React 18** - Modern UI library
- **Recharts** - Powerful charting library built on D3
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Select Corporations**: Click on corporation name buttons to toggle their visibility on the chart
2. **Hover Effects**: Hover over corporation buttons to temporarily highlight their line
3. **Show Forecast**: Click the forecast button to see projected values for 2025-26 (dashed line with orange dots)
4. **View Details**: Hover over data points on the chart to see exact values in the tooltip
5. **Select All/Clear**: Use the quick action buttons to select all or clear all corporations

## Data

The application includes historical cost data ($/kWh) for:
- Barwon Water
- Central Highlands Water
- City West Water
- Coliban
- East Gippsland Water
- Goulburn Murray Water
- Goulburn Valley Water
- Greater Western Water
- GWMWater
- Lower Murray Water
- Melbourne Water
- NE Water
- South East Water
- South Gippsland Water
- Wannon Water
- Western Water
- Westernport Water
- Yarra Valley Water

## Forecast Methodology

The forecast feature uses simple linear regression on historical data points:
- Requires minimum 3 data points
- Calculates slope and intercept using least squares method
- Projects values one year ahead (2025-26)
- Displayed with dashed lines and orange dots

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

This repository was initialized by Terragon.