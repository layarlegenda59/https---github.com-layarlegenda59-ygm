
export interface Debtor {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  totalDebt: number;
  dueDate: string; // Jatuh Tempo Leasing
  funderDueDate: string; // Jatuh Tempo Pendana
  status: 'paid' | 'due' | 'overdue';
  leasingBpkb: string | null;
  funder: string | null;
}
