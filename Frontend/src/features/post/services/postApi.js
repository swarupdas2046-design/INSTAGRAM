import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:8000/api/post",
    withCredentials:true
})


export const getFeed = async()=>{
    const response = await axiosInstance.get("/feed")
    return response.data
}


export const uploadPost = async (imageFiles, caption) => {
  const payload = new FormData();
  // 1. Caption append karna
  payload.append("caption", caption || "");
  // 2. Images append karna (Agar array ho ya single file ho)
  if (Array.isArray(imageFiles)) {
    imageFiles.forEach((file) => {
      payload.append("imageUrl", file); // 👈 Backend mein multer 'images' expect karega
    });
  } else if (imageFiles) {
    payload.append("imageUrl", imageFiles);
  }
  // 3. Multipart API Request
  const response = await axiosInstance.post("/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
