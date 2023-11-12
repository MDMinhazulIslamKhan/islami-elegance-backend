export type status = 'process' | 'accept' | 'cancel' | 'delivered';

export const statusType: status[] = [
  'process',
  'accept',
  'cancel',
  'delivered',
];

export const orderFilterableField = ['searchTerm', 'status'];
export const orderSearchableField = [
  'status',
  'details.name',
  'details.phoneNumber',
  'details.address',
];
