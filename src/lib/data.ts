import type { Debtor, Collateral, NotificationLog, Template } from './types';

export const debtors: Debtor[] = [
  { id: 'DBT001', name: 'Budi Santoso', phone: '081234567890', email: 'budi.santoso@example.com', totalDebt: 1500000, dueDate: '2024-08-15', funderDueDate: '2024-08-20', status: 'due', leasingBpkb: 'ACC' },
  { id: 'DBT002', name: 'Siti Aminah', phone: '089876543210', email: 'siti.aminah@example.com', totalDebt: 250000, dueDate: '2024-07-30', funderDueDate: '2024-08-05', status: 'overdue', leasingBpkb: 'Mandiri' },
  { id: 'DBT003', name: 'Agus Wijoyo', phone: '081122334455', email: 'agus.wijoyo@example.com', totalDebt: 0, dueDate: '2024-09-01', funderDueDate: '2024-09-05', status: 'paid', leasingBpkb: 'BFI' },
  { id: 'DBT004', name: 'Dewi Lestari', phone: '085566677788', email: 'dewi.lestari@example.com', totalDebt: 750000, dueDate: '2024-08-20', funderDueDate: '2024-08-25', status: 'due', leasingBpkb: 'Adira' },
  { id: 'DBT005', name: 'Eko Prasetyo', phone: '084433322211', email: 'eko.prasetyo@example.com', totalDebt: 3200000, dueDate: '2024-07-10', funderDueDate: '2024-07-15', status: 'overdue', leasingBpkb: 'WOM' },
  { id: 'DBT006', name: 'Rina Marlina', phone: '086677788899', email: 'rina.marlina@example.com', totalDebt: 0, dueDate: '2024-09-10', funderDueDate: '2024-09-15', status: 'paid', leasingBpkb: 'BCA' },
  { id: 'DBT007', name: 'Hadi Nugroho', phone: '087788899900', email: 'hadi.nugroho@example.com', totalDebt: 1250000, dueDate: '2024-08-05', funderDueDate: '2024-08-10', status: 'due', leasingBpkb: 'OTO' },
  { id: 'DBT008', name: 'Yulia Sari', phone: '088899900011', email: 'yulia.sari@example.com', totalDebt: 600000, dueDate: '2024-06-25', funderDueDate: '2024-06-30', status: 'overdue', leasingBpkb: 'FIF' },
];

export const collaterals: Collateral[] = [
  { id: 'COL001', debtorId: 'DBT001', debtorName: 'Budi Santoso', type: 'car', description: 'Toyota Avanza 2022', value: 180000000, serialNumber: 'VIN123456789' },
  { id: 'COL003', debtorId: 'DBT005', debtorName: 'Eko Prasetyo', type: 'car', description: 'Mitsubishi Pajero Sport 2021', value: 450000000, serialNumber: 'VIN987654321' },
  { id: 'COL004', debtorId: 'DBT007', debtorName: 'Hadi Nugroho', type: 'motor', description: 'Honda Vario 150 2020', value: 22000000, serialNumber: 'VINABC123DEF' },
];

export const notificationLogs: NotificationLog[] = [
  { id: 'LOG001', debtorName: 'Siti Aminah', type: 'overdue', channel: 'WhatsApp', sentAt: '2024-08-01T10:00:00', status: 'success' },
  { id: 'LOG002', debtorName: 'Eko Prasetyo', type: 'overdue', channel: 'WhatsApp', sentAt: '2024-07-15T09:30:00', status: 'success' },
  { id: 'LOG003', debtorName: 'Budi Santoso', type: 'due', channel: 'WhatsApp', sentAt: '2024-08-14T11:00:00', status: 'failed' },
  { id: 'LOG004', debtorName: 'Dewi Lestari', type: 'upcoming', channel: 'WhatsApp', sentAt: '2024-08-10T14:00:00', status: 'success' },
];

export const templates: Template[] = [
  { id: 'TPL001', name: 'Pengingat Pembayaran Mendatang', scenario: 'upcoming', content: 'Hai {{customer_name}}, ini adalah pengingat bahwa pembayaran Anda sebesar Rp{{amount}} akan jatuh tempo pada {{due_date}}. Terima kasih!', createdAt: '2024-07-01' },
  { id: 'TPL002', name: 'Pembayaran Jatuh Tempo Hari Ini', scenario: 'due', content: 'Yth. {{customer_name}}, pembayaran Anda sebesar Rp{{amount}} jatuh tempo hari ini, {{due_date}}. Harap lakukan pembayaran untuk menghindari biaya keterlambatan.', createdAt: '2024-07-01' },
  { id: 'TPL003', name: 'Pemberitahuan Tunggakan Pembayaran', scenario: 'overdue', content: 'PENTING: {{customer_name}}, pembayaran Anda sebesar Rp{{amount}} telah jatuh tempo pada {{due_date}} dan kini telah lewat waktu. Harap segera selesaikan tagihan Anda.', createdAt: '2024-07-01' },
];
