import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:8000/api/post",
    withCredentials:true
})


export const getFeed = async()=>{
    const response = await axiosInstance.get("/feed")
    return response.data
}

