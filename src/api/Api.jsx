import { useQuery, useMutation } from "@tanstack/react-query";
const apiUrl = import.meta.env.VITE_API_URL

export const checkServerStatus = async () => {
    const response = await fetch(apiUrl + "/status/");
    if (!response.ok) {
        throw new Error("Server is down")
    }
    return response.json()
}

export const useServerStatus = () => {
    return useQuery({
        queryKey: ["serverStatus"],
        queryFn: checkServerStatus,
        retry: 2,
        refetchOnWindowFocus: false,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000)
    })
}

export const login = async (credentials) => {
    const response = await fetch(apiUrl + "/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw response.status
    }
    return response.json()
}

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("permissions", data.permissions)
        },
    })
}