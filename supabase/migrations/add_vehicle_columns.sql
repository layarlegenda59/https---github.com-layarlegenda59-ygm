-- Add vehicle columns to existing debtors table
ALTER TABLE debtors 
ADD COLUMN IF NOT EXISTS stnk_number character varying,
ADD COLUMN IF NOT EXISTS vehicle_type character varying,
ADD COLUMN IF NOT EXISTS vehicle_color character varying,
ADD COLUMN IF NOT EXISTS vehicle_year integer;

-- Optional: Add comments to describe the columns
COMMENT ON COLUMN debtors.stnk_number IS 'Vehicle registration number (STNK)';
COMMENT ON COLUMN debtors.vehicle_type IS 'Type/model of vehicle';
COMMENT ON COLUMN debtors.vehicle_color IS 'Color of vehicle';
COMMENT ON COLUMN debtors.vehicle_year IS 'Year of vehicle manufacture';
