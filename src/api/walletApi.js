// src/api/walletApi.js (Cleaned up and confirmed)
import apiClient, { setAuthToken } from "./apiClient"; 
// setAuthToken is imported but assumed to be handled elsewhere, which is fine

export const getWallets = async () => {
    const res = await apiClient.get("/wallet/all");
    return res;
};

export const createWallet = async (currency) => {
    const res = await apiClient.post("/wallet/create", { currency });
    return res;
};

export const topUpWallet = async (walletId, amount) => {
    const res = await apiClient.post("/wallet/topup", { walletId, amount });
    return res;
};

export const transferWallet = async (fromWalletId, toWalletId, amount) => {
    const res = await apiClient.post("/wallet/transfer", { fromWalletId, toWalletId, amount });
    return res;
};

export const getWalletTransactions = async (walletId) => {
    // 🎯 FIX APPLIED: Using the correct template literal and endpoint confirmed by user
    const res = await apiClient.get(`/wallet/${walletId}/transactions`);
    return res;
};

export const getAllTransactions = async () => {
    const res = await apiClient.get("/wallet/transactions/all");
    return res;
};

export const getMyAuditLogs = async (page = 0, size = 10) => {
    const res = await apiClient.get(`/audit/me?page=${page}&size=${size}`);
    return res;
};