import axiosClient from './axiosClient';

export const getAllAlerts = () => axiosClient.get('/alerts');

export const getAlertsForLaptop = (laptopId) => axiosClient.get(`/alerts/laptop/${laptopId}`);

export const getDashboardSummary = () => axiosClient.get('/dashboard/summary');
