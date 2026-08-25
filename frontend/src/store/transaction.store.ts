import { create } from "zustand";
import type { TRANSACTIONINPUTTYPE, TRANSACTIONTYPE } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import toast from "react-hot-toast";

interface TRANSACTIONSTOREINTERFACE {
    transactions: TRANSACTIONTYPE[];
    addTransaction: (transaction: TRANSACTIONINPUTTYPE) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    updateTransaction: (transactionId: string, transaction: TRANSACTIONINPUTTYPE) => Promise<void>;
    viewTransaction: (year_month: string) => Promise<void>;
}

export const useTransactionStore = create<TRANSACTIONSTOREINTERFACE>((set, get) => ({
    transactions: [],
    addTransaction: async (transaction) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await axios.post(`${BACKEND_URL}/transaction/create`,
                transaction,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 400) throw new Error(response.data.message);
            // Refresh transactions after adding
            const { viewTransaction } = get();
            const year_month = `${new Date(transaction.transactionDate).getFullYear()}-${(new Date(transaction.transactionDate).getMonth() + 1).toString().padStart(2, '0')}`;
            await viewTransaction(year_month);
        } catch (error) {
            throw error;
        }
    },
    viewTransaction: async (year_month) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            if (!year_month) return;
            const response = await axios.get(`${BACKEND_URL}/transaction/${year_month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 400) throw new Error(response.data.message);
            console.log(response.data
            )
            set({
                transactions: response.data.transactions
            })
        } catch (error) {

        }
    },
    deleteTransaction: async (transactionId) => { 
        try {
            const token = localStorage.getItem("token");
            if(!token) return;
            const response = await axios.delete(`${BACKEND_URL}/transaction/${transactionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 400) throw new Error(response.data.message);
            // Refresh transactions after deleting
            const { viewTransaction } = get();
            const year_month = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
            await viewTransaction(year_month);
        } catch (error:any) {
            toast.error(error.response?.data.message);
        }
    },
    updateTransaction: async (transactionId, transaction) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await axios.put(`${BACKEND_URL}/transaction/${transactionId}`,
                transaction,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 400) throw new Error(response.data.message);
            // Refresh transactions after updating
            const { viewTransaction } = get();
            const year_month = `${new Date(transaction.transactionDate).getFullYear()}-${(new Date(transaction.transactionDate).getMonth() + 1).toString().padStart(2, '0')}`;
            await viewTransaction(year_month);
        } catch (error) {
            throw error;
        }
    }
}))