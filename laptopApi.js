import axiosClient from './axiosClient';

export const registerLaptop = (data) => axiosClient.post('/laptops', data);

export const getMyLaptops = () => axiosClient.get('/laptops');

export const armLaptop = (id) => axiosClient.put(`/laptops/${id}/arm`);

export const disarmLaptop = (id) => axiosClient.put(`/laptops/${id}/disarm`);
