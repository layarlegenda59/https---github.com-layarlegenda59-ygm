
import type { Debtor } from './types';

export const debtors: Debtor[] = [
  { id: 'DBT001', name: 'Budi Santoso', phone: '081234567890', email: 'budi.santoso@example.com', totalDebt: 1500000, dueDate: '2024-08-15', funderDueDate: '2024-08-20', status: 'due', leasingBpkb: 'ACC', funder: 'Funder A', created_at: new Date().toISOString() },
  { id: 'DBT002', name: 'Siti Aminah', phone: '089876543210', email: 'siti.aminah@example.com', totalDebt: 250000, dueDate: '2024-07-30', funderDueDate: '2024-08-05', status: 'overdue', leasingBpkb: 'Mandiri', funder: 'Funder B', created_at: new Date().toISOString() },
  { id: 'DBT003', name: 'Agus Wijoyo', phone: '081122334455', email: 'agus.wijoyo@example.com', totalDebt: 0, dueDate: '2024-09-01', funderDueDate: '2024-09-05', status: 'paid', leasingBpkb: 'BFI', funder: 'Funder C', created_at: new Date().toISOString() },
  { id: 'DBT004', name: 'Dewi Lestari', phone: '085566677788', email: 'dewi.lestari@example.com', totalDebt: 750000, dueDate: '2024-08-20', funderDueDate: '2024-08-25', status: 'due', leasingBpkb: 'Adira', funder: 'Funder A', created_at: new Date().toISOString() },
  { id: 'DBT005', name: 'Eko Prasetyo', phone: '084433322211', email: 'eko.prasetyo@example.com', totalDebt: 3200000, dueDate: '2024-07-10', funderDueDate: '2024-07-15', status: 'overdue', leasingBpkb: 'WOM', funder: 'Funder D', created_at: new Date().toISOString() },
  { id: 'DBT006', name: 'Rina Marlina', phone: '086677788899', email: 'rina.marlina@example.com', totalDebt: 0, dueDate: '2024-09-10', funderDueDate: '2024-09-15', status: 'paid', leasingBpkb: 'BCA', funder: 'Funder B', created_at: new Date().toISOString() },
  { id: 'DBT007', name: 'Hadi Nugroho', phone: '087788899900', email: 'hadi.nugroho@example.com', totalDebt: 1250000, dueDate: '2024-08-05', funderDueDate: '2024-08-10', status: 'due', leasingBpkb: 'OTO', funder: 'Funder C', created_at: new Date().toISOString() },
  { id: 'DBT008', name: 'Yulia Sari', phone: '088899900011', email: 'yulia.sari@example.com', totalDebt: 600000, dueDate: '2024-06-25', funderDueDate: '2024-06-30', status: 'overdue', leasingBpkb: 'FIF', funder: 'Funder D', created_at: new Date().toISOString() },
];
