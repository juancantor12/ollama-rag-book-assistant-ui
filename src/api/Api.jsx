import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"
const apiUrl = import.meta.env.VITE_API_URL

export const queryClient = new QueryClient({})

export const useServerStatus = () => {
    return useQuery({
        queryKey: ["serverStatus"],
        queryFn: async () => {
            const response = await fetch(apiUrl + "/status/")
            if (!response.ok) {
                throw new Error("Server is down")
            }
            return response.json()
        },
        retry: 2,
        refetchOnWindowFocus: false,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000)
    })
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await fetch(apiUrl + "/login/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(credentials),
            })
            if (!response.ok) {
                throw response.status
            }
            return response.json()
        },
        onSuccess: (data) => {
            localStorage.setItem("permissions", data.permissions)
            localStorage.setItem("session_expiration", data.exp)
            localStorage.setItem("username", data.username)
        },
    })
}

export const useLogout = () => {
    return useQuery({
        queryKey: ["useLogout"],
        queryFn: async () => {
            const response = await fetch(apiUrl + "/logout/", {
                    credentials: "include"
                }
            )
            if (!response.ok) {
                throw response.status
            }
            return true
        },
        enabled: false
    })
}

export const useAsk = () => {
    return useMutation({
        mutationFn: async (query) => {
            const response = await fetch(apiUrl + "/ask/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(query),
            })
            if (!response.ok) {
                throw new Error("Server is down")
            }
            return response.json()
        },
    })
}

export const checkSessionApi = () => {
    return useQuery({
        queryKey: ["checkSession"],
        queryFn: async (query) => {
            const response = await fetch(apiUrl + "/check_session/", {
                method: "GET",
                credentials: "include",
            })
            if (!response.ok) {
                throw new Error("No active session.")
            }
            return response.json()
        },
        enabled: false
    })
}