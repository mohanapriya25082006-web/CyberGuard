

import axiosClient from './axiosClient';

export const registerUser = (data) =>
    axiosClient.post('/auth/register', data);

export const loginUser = (data) =>
    axiosClient.post('/auth/login', data);

export const googleLoginUser = (credential) =>
    axiosClient.post('/auth/google', { credential });

export const forgotPasswordUser = (email) =>
    axiosClient.post('/auth/forgot-password', { email });

export const resetPasswordUser = (token, newPassword) =>
    axiosClient.post('/auth/reset-password', {
        token,
        newPassword,
    });
