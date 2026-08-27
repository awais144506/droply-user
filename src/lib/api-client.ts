import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Request Interceptor: Attach Clerk Session Bearer Token
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined" && (window as any).Clerk) {
            try {
                const token = await (window as any).Clerk.session?.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (err) {
                console.error("Failed to acquire Clerk token:", err);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Extract response data or throw readable error
apiClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<{ message: string | string[] }>) => {
        const dataMessage = error.response?.data?.message;
        const customMessage = Array.isArray(dataMessage)
            ? dataMessage.join(", ")
            : dataMessage || error.message || "An unexpected error occurred";

        return Promise.reject(new Error(customMessage));
    }
);