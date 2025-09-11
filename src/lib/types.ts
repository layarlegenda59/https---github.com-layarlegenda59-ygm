export interface Debtor {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalDebt: number;
  dueDate: string; // Jatuh Tempo Leasing
  funderDueDate: string; // Jatuh Tempo Pendana
  status: 'paid' | 'due' | 'overdue';
  leasingBpkb?: string;
  funder?: string;
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

export interface NotificationLog {
  id: string;
  debtorName: string;
  type: 'upcoming' | 'due' | 'overdue';
  channel: 'WhatsApp';
  sentAt: string;
  status: 'success' | 'failed';
}

export interface Template {
  id: string;
  name: string;
  scenario: 'upcoming' | 'due' | 'overdue';
  content: string;
  createdAt: string;
}
