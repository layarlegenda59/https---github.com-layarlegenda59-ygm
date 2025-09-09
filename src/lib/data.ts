import type { Debtor, Collateral, NotificationLog, Template } from './types';

export const debtors: Debtor[] = [
  { id: 'DBT001', name: 'John Doe', phone: '+1234567890', email: 'john.doe@example.com', totalDebt: 1500, dueDate: '2024-08-15', status: 'due' },
  { id: 'DBT002', name: 'Jane Smith', phone: '+1987654321', email: 'jane.smith@example.com', totalDebt: 250, dueDate: '2024-07-30', status: 'overdue' },
  { id: 'DBT003', name: 'Peter Jones', phone: '+1122334455', email: 'peter.jones@example.com', totalDebt: 5000, dueDate: '2024-09-01', status: 'paid' },
  { id: 'DBT004', name: 'Mary Johnson', phone: '+1555666777', email: 'mary.j@example.com', totalDebt: 750, dueDate: '2024-08-20', status: 'due' },
  { id: 'DBT005', name: 'David Williams', phone: '+1444333222', email: 'david.w@example.com', totalDebt: 3200, dueDate: '2024-07-10', status: 'overdue' },
  { id: 'DBT006', name: 'Linda Brown', phone: '+1666777888', email: 'linda.b@example.com', totalDebt: 800, dueDate: '2024-09-10', status: 'paid' },
  { id: 'DBT007', name: 'Michael Miller', phone: '+1777888999', email: 'michael.m@example.com', totalDebt: 1250, dueDate: '2024-08-05', status: 'due' },
  { id: 'DBT008', name: 'Sarah Wilson', phone: '+1888999000', email: 'sarah.w@example.com', totalDebt: 600, dueDate: '2024-06-25', status: 'overdue' },
];

export const collaterals: Collateral[] = [
  { id: 'COL001', debtorId: 'DBT001', debtorName: 'John Doe', type: 'vehicle', description: 'Toyota Camry 2022', value: 22000, serialNumber: 'VIN123456789' },
  { id: 'COL002', debtorId: 'DBT003', debtorName: 'Peter Jones', type: 'lease', description: 'Commercial Property Lease', value: 150000, address: '123 Main St, Anytown, USA' },
  { id: 'COL003', debtorId: 'DBT005', debtorName: 'David Williams', type: 'vehicle', description: 'Ford F-150 2021', value: 35000, serialNumber: 'VIN987654321' },
  { id: 'COL004', debtorId: 'DBT007', debtorName: 'Michael Miller', type: 'vehicle', description: 'Honda Civic 2020', value: 18000, serialNumber: 'VINABC123DEF' },
];

export const notificationLogs: NotificationLog[] = [
  { id: 'LOG001', debtorName: 'Jane Smith', type: 'overdue', channel: 'WhatsApp', sentAt: '2024-08-01 10:00', status: 'success' },
  { id: 'LOG002', debtorName: 'David Williams', type: 'overdue', channel: 'WhatsApp', sentAt: '2024-07-15 09:30', status: 'success' },
  { id: 'LOG003', debtorName: 'John Doe', type: 'due', channel: 'WhatsApp', sentAt: '2024-08-14 11:00', status: 'failed' },
  { id: 'LOG004', debtorName: 'Mary Johnson', type: 'upcoming', channel: 'WhatsApp', sentAt: '2024-08-10 14:00', status: 'success' },
];

export const templates: Template[] = [
  { id: 'TPL001', name: 'Upcoming Payment Reminder', scenario: 'upcoming', content: 'Hi {{customer_name}}, this is a friendly reminder that your payment of ${{amount}} is due on {{due_date}}. Thank you!', createdAt: '2024-07-01' },
  { id: 'TPL002', name: 'Payment Due Today', scenario: 'due', content: 'Dear {{customer_name}}, your payment of ${{amount}} is due today, {{due_date}}. Please make your payment to avoid late fees.', createdAt: '2024-07-01' },
  { id: 'TPL003', name: 'Overdue Payment Notice', scenario: 'overdue', content: 'URGENT: {{customer_name}}, your payment of ${{amount}} was due on {{due_date}} and is now overdue. Please settle your account immediately.', createdAt: '2024-07-01' },
];
