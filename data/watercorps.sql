-- Aggregated energy totals by financial year (auto-generated from watercorps.csv)
CREATE TABLE IF NOT EXISTS watercorp_energy_totals (
  year TEXT PRIMARY KEY,
  total_kwh NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL
);

INSERT INTO watercorp_energy_totals (year, total_kwh, total_cost) VALUES
  ('2013-14', 187595162.659, 39615598.0),
  ('2014-15', 190202844.774, 39344669.0),
  ('2015-16', 241877214.41, 46865842.0),
  ('2016-17', 377938070.94, 72750726.0),
  ('2017-18', 769440062.84, 80369823.0),
  ('2018-19', 746090359.0, 96738370.0),
  ('2019-20', 658428180.0, 105643708.0),
  ('2020-21', 661568659.0, 98300205.0),
  ('2021-22', 608815635.0, 94473498.0),
  ('2022-23', 497133275.0, 84507113.0),
  ('2023-24', 476129689.0, 84526310.0),
  ('2024-25', 199257000.0, 27029000.0)
ON CONFLICT (year) DO UPDATE SET
  total_kwh = EXCLUDED.total_kwh,
  total_cost = EXCLUDED.total_cost;
