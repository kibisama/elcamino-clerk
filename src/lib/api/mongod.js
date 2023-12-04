import client from './client';

export const searchDrugs = (body) => client.post('/mongod/drugs/search', body);
