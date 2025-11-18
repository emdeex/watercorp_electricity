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

## Moving the CSV into Vercel Postgres

1. **Provision a managed Postgres instance via the Vercel Marketplace**  
   In your Vercel project dashboard, open the **Storage** tab, choose a Postgres provider (Neon, Prisma Postgres, Supabase, etc.), and connect it to this project. Vercel automatically injects the `POSTGRES_URL`/`DATABASE_URL` secrets into every deployment once the integration is linked.

2. **Pull the connection string locally for development/CLI usage**  
   Run `vercel env pull .env.local` (or `.env.development.local`) so the `POSTGRES_URL` value is also available when you execute scripts from your machine. The `@vercel/postgres` client will throw `missing_connection_string` unless this variable is present.

3. **Seed the database from the CSV**  
   - The canonical CSV lives at `data/water_costs.csv`.  
   - Import it with `npm run seed:water` (or pass a different file path: `npm run seed:water -- ./path/to/file.csv`).  
   - The script creates a `water_costs` table, upserts every `(year_label, corporation, cost)` row, and can be re-run safely whenever the CSV changes.

4. **Verify and deploy**  
   - Locally, run `npm run dev` and confirm `/api/water-costs` returns JSON coming from Postgres (watch the badge in the hero section for the “Live data served from Vercel Postgres” status).  
   - Commit/push, then trigger a Vercel deployment; the same environment variable is already available in the hosted function, so no extra configuration is required.  
   - If you rotate credentials later, update them in the Vercel dashboard and re-run `vercel env pull` so your local `.env` stays in sync.

> **Tip:** Because Vercel Postgres now routes through its Storage Marketplace integrations, you can swap providers without touching the code—only the injected `POSTGRES_URL` changes.

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
