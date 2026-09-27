import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/categories');
export const createCategory = (data) => axiosInstance.post('/categories', data);
export const deleteCategory = (id) => axiosInstance.delete(`/categories/${id}`);

export const uploadTransactionsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/transactions/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};