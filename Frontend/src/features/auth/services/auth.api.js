import axios from "axios";

const apiInstance = axios.create({
    baseURL:"http://localhost:3000/api/auth/",
    withCredentials:true
})

export const registerApi = async(username,email,password)=>{
    try {
        const response = await apiInstance.post("register",{
            username,
            email,
            password
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const loginApi = async(email,password)=>{
    try {
        const response = await apiInstance.post("login",{
            email,
            password
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const getMe = async()=>{
    try {
        const response = await apiInstance.get("/get-me")
        return response.data
    } catch (error) {
        throw error
    }
}