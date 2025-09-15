
export interface Debtor {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  total_debt: number;
  due_date: string; // Jatuh Tempo Leasing
  funder_due_date: string; // Jatuh Tempo Pendana
  status: 'paid' | 'due' | 'overdue' | 'takeover';
  leasing_bpkb: string | null;
  funder: string | null;
  police_number: string | null;
  stnk_number: string | null;
  vehicle_type: string | null;
  vehicle_color: string | null;
  vehicle_year: number | null;
  user_id?: string;
}
