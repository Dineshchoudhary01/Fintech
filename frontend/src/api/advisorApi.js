import axiosInstance from './axiosInstance';


export const getBudgetInsights = () => axiosInstance.get('/advisor/insights');