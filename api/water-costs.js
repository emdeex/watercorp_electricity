const { sql } = require('@vercel/postgres');
const fallbackData = require('../data/water_costs.json');

const reshapeRows = (rows) => {
  const yearMap = new Map();

  for (const row of rows) {
    if (!yearMap.has(row.year_label)) {
      yearMap.set(row.year_label, { year: row.year_label });
    }
    yearMap.get(row.year_label)[row.corporation] = Number(row.cost);
  }

  return Array.from(yearMap.values());
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(200).json({ data: fallbackData, source: 'fallback' });
  }

  try {
    const { rows } = await sql`
      SELECT year_label, corporation, cost
      FROM water_costs
      ORDER BY year_label, corporation;
    `;

    return res.status(200).json({ data: reshapeRows(rows), source: 'vercel-postgres' });
  } catch (error) {
    console.error('water-costs api error', error);
    if (fallbackData?.length) {
      return res.status(200).json({
        data: fallbackData,
        source: 'fallback',
        error: 'Database unavailable; serving bundled snapshot.',
      });
    }

    return res.status(500).json({ error: 'Failed to load data' });
  }
};
