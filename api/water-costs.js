const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { rows } = await sql`
      SELECT year_label, corporation, cost
      FROM water_costs
      ORDER BY year_label, corporation;
    `;

    const yearMap = new Map();

    for (const row of rows) {
      if (!yearMap.has(row.year_label)) {
        yearMap.set(row.year_label, { year: row.year_label });
      }
      yearMap.get(row.year_label)[row.corporation] = Number(row.cost);
    }

    const data = Array.from(yearMap.values());

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to load data' });
  }
};
