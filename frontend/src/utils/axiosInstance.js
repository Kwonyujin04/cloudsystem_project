// frontend/src/utils/axiosInstance.js

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:30081",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (config.url.includes("/api/auth/login") || config.url.includes("/api/auth/signup")) {
        return config;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
