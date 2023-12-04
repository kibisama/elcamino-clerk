import client from './client';

export const reloadCardinal = () => client.get('/cardinal');

export const checkCardinalInvoice = (body) =>
  client.post('/cardinal/checkInvoice', body);
