import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosInstance } from "axios";

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
    const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api" // Fallback for safety
    })

    api.interceptors.request.use(async (config) => {
        const token = await getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    return api
}
export const useApiClient = (): AxiosInstance => {
    const { getToken } = useAuth()
    return createApiClient(getToken)
}
export const userApi = {
    syncUser: (api: AxiosInstance, userData?: any) => api.post('/users/sync', userData),
    getCurrentUser: (api: AxiosInstance) => api.get('/users/me'),
    updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),

}
export const postApi = {
    createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
        api.post('/posts', data),
    getPosts: (api: AxiosInstance) => api.get('/posts'),
    getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${username}`),
    likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${postId}/like`),
    deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${postId}`),
}
export const commentApi = {
    createComment: (api: AxiosInstance, postId: string, content: string) => api.post(`/comments/posts/${postId}`, { content }),
    // getComments:(api:AxiosInstance,postId:string) => api.get(`/comments/posts/${postId}`),
    // deleteComment:(api:AxiosInstance,commentId:string) => api.delete(`/comments/${commentId}`),
}

