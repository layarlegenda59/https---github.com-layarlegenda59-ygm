-- Add 'takeover' status option to debtors table
ALTER TABLE debtors DROP CONSTRAINT IF EXISTS debtors_status_check;
ALTER TABLE debtors ADD CONSTRAINT debtors_status_check CHECK (status IN ('paid', 'due', 'overdue', 'takeover'));
