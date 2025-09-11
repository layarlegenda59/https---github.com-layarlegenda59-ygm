
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

export interface Collateral {
  id: string;
  debtorId: string;
  debtorName: string;
  type: 'car' | 'motor';
  description: string;
  value: number;
  serialNumber?: string; // For vehicles
  address?: string; // For leases/property
}

export interface Template {
  id: string;
  name: string;
  scenario: 'upcoming' | 'due' | 'overdue';
  content: string;
  createdAt: string;
}
