import { create } from "zustand";
import axios, { AxiosError } from "axios"
import type { USERLOGINTYPE, USERREGISTERTYPE, USERTYPE } from "../types";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../constants";

interface USERSTOREINTERFACE {
    user: USERTYPE | null,
    signup: ({ email, name, password }: USERREGISTERTYPE) => Promise<void>,
    login: ({ email, password }: USERLOGINTYPE) => Promise<void>
    checkMe: () => Promise<void>,
    logout: () => void;
}

export const useUserStore = create<USERSTOREINTERFACE>((set, _get) => ({
    user: null,
    signup: async ({ email, name, password }) => {
        try {
            if (!(email && name && password)) {
                toast.error("All fields are required");
                return
            };

            // send request to backend
            const response = await axios.post(`${BACKEND_URL}/user/signup`, { email, name, password });
            if (response.status === 400) throw new Error(response.data.message);
            // if everything is fine
            set({
                user: response.data.user
            })
            // save token to localstorage
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    },
    login: async ({ email, password }) => {
        try {
            if (!(email && password)) {
                toast.error("Email and password are required");
                return
            };

            // send request to backend
            const response = await axios.post(`${BACKEND_URL}/user/login`, { email, password });
            if (response.status === 400) throw new Error(response.data.message);
            // if everything is fine
            set({
                user: response.data.user
            })
            // save token to localstorage
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data)
                toast.error(error.response?.data.message);
            }
            console.error(error.message)
        }
    },
    checkMe: async () => {
        try {
            // .get token from localstorage
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            // send request to backend 
            const response = await axios.get(`${BACKEND_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 400) throw new Error(response.data.message);
            // if everything is fine
            set({
                user: response.data.user
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message)
            }
            console.error(error)
        }
    },
    logout: () => {
        // remove token from localstorage
        localStorage.removeItem("token");
        set({
            user: null
        })
        toast.success("Logout successful!");
    }
}))