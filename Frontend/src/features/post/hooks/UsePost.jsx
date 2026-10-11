import { useContext } from "react"
import { PostContext } from "../PostContextProvider"
import { getFeed } from "../services/postApi"

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
return {loading,feed,GetAllFeed,post}
}