import API from '../services/api';

export const getAllBudgets = async () => {
  const res = await API.get('/budget/getAllBudgets');
  return res.data;
};

export const checkCompletedBudgets = async () => {
  const res = await API.get("/budget/hasCompletedBudget");
  return res.data;
};