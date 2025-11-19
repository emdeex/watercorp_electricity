import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { db } from '@vercel/postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CSV = path.resolve(__dirname, '..', 'data', 'water_costs.csv');
const CHUNK_SIZE = 128;

async function main() {
  const csvPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : DEFAULT_CSV;
  const csvBuffer = await fs.readFile(csvPath);
  const records = parse(csvBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (!records.length) {
    console.error('No records found in CSV.');
    process.exit(1);
  }

  const client = await db.connect();
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS water_costs (
        id SERIAL PRIMARY KEY,
        year_label TEXT NOT NULL,
        corporation TEXT NOT NULL,
        cost NUMERIC NOT NULL,
        UNIQUE (year_label, corporation)
      );
    `;

    await client.sql`TRUNCATE TABLE water_costs;`;

    for (let i = 0; i < records.length; i += CHUNK_SIZE) {
      const batch = records.slice(i, i + CHUNK_SIZE);
      const values = batch.map((row) => ({
        year: row.year,
        corporation: row.corporation,
        cost: Number(row.cost),
      }));

      const insertFragment = values
        .map(
          (_, idx) =>
            `($${idx * 3 + 1}, $${idx * 3 + 2}, $${idx * 3 + 3})`,
        )
        .join(', ');

      const parameters = values.flatMap((row) => [
        row.year,
        row.corporation,
        row.cost,
      ]);

      await client.query(
        `INSERT INTO water_costs (year_label, corporation, cost) VALUES ${insertFragment} ON CONFLICT (year_label, corporation) DO UPDATE SET cost = EXCLUDED.cost;`,
        parameters,
      );
    }

    console.log(`Imported ${records.length} rows from ${path.basename(csvPath)}.`);
  } finally {
    client.release();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
