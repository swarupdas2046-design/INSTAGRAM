import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const apiInstance = axios.create({
    baseURL:`${API_BASE_URL}/api/auth`,
    withCredentials:true
})

export const registerApi = async(username,email,password)=>{
    const response = await apiInstance.post("/register",{
        username,
        email,
        password
    })
    return response.data
}

export const loginApi = async(email,password)=>{
    const response = await apiInstance.post("/login",{
        email,
        password
    })
    return response.data
}

export const getMe = async()=>{
    const response = await apiInstance.get("/get-me")
    return response.data
}

export const logoutApi = async()=>{
    const response = await apiInstance.post("/logout")
    return response.data
}
