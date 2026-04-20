import API from '../services/api';

export const getAccounts = async () => {
  const res = await API.get('/account/getAllAccounts');
  return res.data;
};