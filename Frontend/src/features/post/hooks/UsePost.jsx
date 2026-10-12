import { useContext, useEffect } from "react"
import { PostContext } from "../PostContextProvider"
import { getFeed, uploadPost } from "../services/postApi"
import { toast, Zoom } from "react-toastify";
export const UsePost = ()=>{

    const {loading, setLoading, post, setPost, feed, setFeed} = useContext(PostContext)

    const GetAllFeed = async()=>{
        setLoading(true)
        try {
            const response = await getFeed()
            console.log("From Api Calling Hook folder :-->",response.data);
            
            setFeed(response.data)

        } catch (error) {
            console.log(error.response?.data)
            toast.error(error.response?.data.message, {
                theme:"dark",
                transition:Zoom
            })
        }finally{
            setLoading(false)
        }

    }

const handlePost = async (imageFiles, caption) => {
    setLoading(true);
    try {
        const response = await uploadPost(imageFiles, caption);
        setFeed((prev) => [response, ...prev]);
        toast.success("Post shared successfully!", {
        theme: "dark",
        transition: Zoom,
    });
      return response; // 👈 Component ke liye return karna zaroori hai
    } catch (error) {
        console.log(error.response?.data);
        toast.error(error.response?.data?.message || "Failed to create post", {
        theme: "dark",
        transition: Zoom,
    });
        return null;
    }
    finally {
    setLoading(false);
    }
};

useEffect(()=>{
    GetAllFeed()
},[])


return {loading,feed,GetAllFeed,post,handlePost}
}