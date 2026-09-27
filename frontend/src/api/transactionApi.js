import axiosInstance from './axiosInstance';

export const getTransactions = () => axiosInstance.get('/transactions');
export const createTransaction = (data) => axiosInstance.post('/transactions', data);
export const updateTransaction = (id, data) => axiosInstance.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => axiosInstance.delete(`/transactions/${id}`);

export const uploadTransactionsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/transactions/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};