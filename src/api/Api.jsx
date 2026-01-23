import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"
const apiUrl = import.meta.env.VITE_API_URL

export const queryClient = new QueryClient({})
export const paths = {
    loadSchema: "/admin/get_schema",
    login: "/login/",
    recoverAdmin: "/admin/recover/",
    books: {
        load: "/load_books/",
        upload: "/upload_book/"
    },
    user: {
        create: "/admin/users/create",
        read: "/admin/users/list",
        update: "/admin/users/update",
        delete: "/admin/users/delete",
    },
    permission: {
        create: "/admin/permissions/create",
        read: "/admin/permissions/list",
        update: "/admin/permissions/update",
        delete: "/admin/permissions/delete"
    }
    ,
    role: {
        create: "/admin/roles/create",
        read: "/admin/roles/list",
        update: "/admin/roles/update",
        delete: "/admin/roles/delete"
    }
}

export const useGet = ({path, retries = 0, credentials = false }) => {
    return useQuery({
        queryKey: [path],
        enabled: false,
        queryFn: async () => {
            const fetchOptions = {
                method: 'GET',
                ...(credentials && { credentials: 'include' })
            }
            const response = await fetch(apiUrl + path, fetchOptions)
            if (!response.ok) {
                throw response.status
            }
            return response.json()
        },
        retry: retries,
        retryDelay: (attempt) => Math.min(1000 * 1 ** attempt, 30000)
    })
}

export const usePost = () => {
    return useMutation({
        mutationFn: async ({path, data, credentials = false}, file = null) => {
            const isFile = data instanceof FormData && data.get("file") !== null
            const formData = new FormData()
            if (isFile) {
                formData.append('file', data.get("file"))
            }
            const options = {
                method: 'POST',
                body: isFile ? formData : JSON.stringify(data),
                ...( !isFile && { headers: { "Content-Type": "application/json"} }),
                ...( credentials && { credentials: 'include' })
            }
            const response = await fetch(apiUrl + path, options)
            if (!response.ok) {
                throw response.status
            }
            return response.json()
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

export const getFile = async (path) => {
    const response = await fetch(`${apiUrl}${path}`)
    if (!response.ok) {
        throw new Error("Failed to fetch file")
    }
    const blob = await response.blob()
    return blob
}

export const useGenerateEmbeddings = () => {
    const [progress, setProgress] = useState("Generate")
    const [isError, setIsError] = useState(false)
    const [eventSource, setEventSource] = useState(null)
    const generateEmbeddings = useCallback((book_filename) => {
        if (eventSource) {
            eventSource.close()
        }
        const es = new EventSource(`${apiUrl}/generate_embeddings/${book_filename}`, {
            withCredentials: true
        })
        setEventSource(es)
        es.onmessage = function (event) {
            const data = JSON.parse(event.data)
             if (data.progress === "done") {
                console.log("Embedding generation complete!")
                es.close()
            }
            setProgress(data.progress)
        }
        es.onerror = function (error) {
            console.error("Error occurred while receiving SSE:", error)
            setIsError(true)
            es.close()
        }
    }, [eventSource])

    useEffect(() => {
        return () => {
            if (eventSource) {
                eventSource.close()
            }
        }
    }, [eventSource])

    return { progress, isError, generateEmbeddings }
}
