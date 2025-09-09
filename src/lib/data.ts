import type { Debtor, Collateral, NotificationLog, Template } from './types';

export const debtors: Debtor[] = [
  { id: 'DBT001', name: 'John Doe', phone: '+1234567890', email: 'john.doe@example.com', totalDebt: 1500000, dueDate: '2024-08-15', status: 'due' },
  { id: 'DBT002', name: 'Jane Smith', phone: '+1987654321', email: 'jane.smith@example.com', totalDebt: 250000, dueDate: '2024-07-30', status: 'overdue' },
  { id: 'DBT003', name: 'Peter Jones', phone: '+1122334455', email: 'peter.jones@example.com', totalDebt: 5000000, dueDate: '2024-09-01', status: 'paid' },
  { id: 'DBT004', name: 'Mary Johnson', phone: '+1555666777', email: 'mary.j@example.com', totalDebt: 750000, dueDate: '2024-08-20', status: 'due' },
  { id: 'DBT005', name: 'David Williams', phone: '+1444333222', email: 'david.w@example.com', totalDebt: 3200000, dueDate: '2024-07-10', status: 'overdue' },
  { id: 'DBT006', name: 'Linda Brown', phone: '+1666777888', email: 'linda.b@example.com', totalDebt: 800000, dueDate: '2024-09-10', status: 'paid' },
  { id: 'DBT007', name: 'Michael Miller', phone: '+1777888999', email: 'michael.m@example.com', totalDebt: 1250000, dueDate: '2024-08-05', status: 'due' },
  { id: 'DBT008', name: 'Sarah Wilson', phone: '+1888999000', email: 'sarah.w@example.com', totalDebt: 600000, dueDate: '2024-06-25', status: 'overdue' },
];

export const collaterals: Collateral[] = [
  { id: 'COL001', debtorId: 'DBT001', debtorName: 'John Doe', type: 'vehicle', description: 'Toyota Camry 2022', value: 220000000, serialNumber: 'VIN123456789' },
  { id: 'COL002', debtorId: 'DBT003', debtorName: 'Peter Jones', type: 'lease', description: 'Sewa Properti Komersial', value: 1500000000, address: 'Jl. Utama No. 123, Jakarta' },
  { id: 'COL003', debtorId: 'DBT005', debtorName: 'David Williams', type: 'vehicle', description: 'Ford F-150 2021', value: 350000000, serialNumber: 'VIN987654321' },
  { id: 'COL004', debtorId: 'DBT007', debtorName: 'Michael Miller', type: 'vehicle', description: 'Honda Civic 2020', value: 180000000, serialNumber: 'VINABC123DEF' },
];

export const notificationLogs: NotificationLog[] = [
  { id: 'LOG001', debtorName: 'Jane Smith', type: 'overdue', channel: 'WhatsApp', sentAt: '2024-08-01T10:00:00', status: 'success' },
  { id: 'LOG002', debtorName: 'David Williams', type: 'overdue', channel: 'WhatsApp', sentAt: '2024-07-15T09:30:00', status: 'success' },
  { id: 'LOG003', debtorName: 'John Doe', type: 'due', channel: 'WhatsApp', sentAt: '2024-08-14T11:00:00', status: 'failed' },
  { id: 'LOG004', debtorName: 'Mary Johnson', type: 'upcoming', channel: 'WhatsApp', sentAt: '2024-08-10T14:00:00', status: 'success' },
];

export const templates: Template[] = [
  { id: 'TPL001', name: 'Pengingat Pembayaran Mendatang', scenario: 'upcoming', content: 'Hai {{customer_name}}, ini adalah pengingat bahwa pembayaran Anda sebesar Rp{{amount}} akan jatuh tempo pada {{due_date}}. Terima kasih!', createdAt: '2024-07-01' },
  { id: 'TPL002', name: 'Pembayaran Jatuh Tempo Hari Ini', scenario: 'due', content: 'Yth. {{customer_name}}, pembayaran Anda sebesar Rp{{amount}} jatuh tempo hari ini, {{due_date}}. Harap lakukan pembayaran untuk menghindari biaya keterlambatan.', createdAt: '2024-07-01' },
  { id: 'TPL003', name: 'Pemberitahuan Tunggakan Pembayaran', scenario: 'overdue', content: 'PENTING: {{customer_name}}, pembayaran Anda sebesar Rp{{amount}} telah jatuh tempo pada {{due_date}} dan kini telah lewat waktu. Harap segera selesaikan tagihan Anda.', createdAt: '2024-07-01' },
];
