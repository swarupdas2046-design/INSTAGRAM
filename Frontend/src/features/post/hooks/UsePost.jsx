import { useContext } from "react"
import { PostContext } from "../PostContextProvider"
import {
  addCommentApi,
  deleteCommentApi,
  getExploreFeed,
  getFeed,
  getPostCommentsApi,
  getPostLikesApi,
  getSavedPostsApi,
  getUserPosts,
  likePostApi,
  savePostApi,
  unlikePostApi,
  unsavePostApi,
  uploadPost,
} from "../services/postApi"
import { toast, Zoom } from "react-toastify"

// ==============================================================================
// 📸 USE POST HOOK - Post related saare actions ek jagah manage karta hai
// ==============================================================================
export const UsePost = () => {
  const { loading, setLoading, post, feed, setFeed } = useContext(PostContext)

  // Home feed fetch karna (followed users ke posts)
  const GetAllFeed = async () => {
    setLoading(true)
    try {
      const response = await getFeed()
      setFeed(response.data || [])
    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.message || "Failed to load feed", {
        theme: "dark",
        transition: Zoom,
      })
    } finally {
      setLoading(false)
    }
  }

  // Explore / Global discovery feed
  const GetExploreFeed = async () => {
    setLoading(true)
    try {
      const response = await getExploreFeed()
      setFeed(response.data || [])
    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.message || "Failed to load explore feed", {
        theme: "dark",
        transition: Zoom,
      })
    } finally {
      setLoading(false)
    }
  }

  // Kisi specific user ke posts fetch karna
  const GetUserPosts = async (username) => {
    try {
      const response = await getUserPosts(username)
      return response.data || []
    } catch (error) {
      console.log(error.response?.data)
      return []
    }
  }

  // Logged-in user ke saved posts fetch karna
  const GetSavedPosts = async () => {
    try {
      const response = await getSavedPostsApi()
      return response.data || []
    } catch (error) {
      console.log(error.response?.data)
      return []
    }
  }

  // Naya post create karna
  const handlePost = async (imageFiles, caption) => {
    setLoading(true)
    try {
      const response = await uploadPost(imageFiles, caption)
      // Naya post feed ke top par add karte hain (optimistic update)
      setFeed((prev) => (prev ? [response.data, ...prev] : [response.data]))
      toast.success("Post shared successfully!", {
        theme: "dark",
        transition: Zoom,
      })
      return response.data
    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.message || "Failed to create post", {
        theme: "dark",
        transition: Zoom,
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  // Post like karna - optimistic UI update ke saath
  const handleLike = async (postId) => {
    try {
      const response = await likePostApi(postId)
      // Feed me us post ki liked state aur likesCount update karte hain
      setFeed((prev) =>
        prev
          ? prev.map((p) =>
              p._id === postId
                ? { ...p, liked: true, likesCount: response.data?.likesCount ?? p.likesCount }
                : p
            )
          : prev
      )
      return response.data
    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.message || "Failed to like post", {
        theme: "dark",
        transition: Zoom,
      })
      return null
    }
  }

  // Post unlike karna
  const handleUnlike = async (postId) => {
    try {
      const response = await unlikePostApi(postId)
      setFeed((prev) =>
        prev
          ? prev.map((p) =>
              p._id === postId
                ? { ...p, liked: false, likesCount: response.data?.likesCount ?? p.likesCount }
                : p
            )
          : prev
      )
      return response.data
    } catch (error) {
      console.log(error.response?.data)
      toast.error(error.response?.data?.message || "Failed to unlike post", {
        theme: "dark",
        transition: Zoom,
      })
      return null
    }
  }

  // Post save/bookmark karna
  const handleSavePost = async (postId) => {
    try {
      const response = await savePostApi(postId)
      setFeed((prev) =>
        prev
          ? prev.map((p) => (p._id === postId ? { ...p, saved: true } : p))
          : prev
      )
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save post", {
        theme: "dark",
        transition: Zoom,
      })
      return null
    }
  }

  // Saved post remove karna
  const handleUnsavePost = async (postId) => {
    try {
      const response = await unsavePostApi(postId)
      setFeed((prev) =>
        prev
          ? prev.map((p) => (p._id === postId ? { ...p, saved: false } : p))
          : prev
      )
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unsave post", {
        theme: "dark",
        transition: Zoom,
      })
      return null
    }
  }

  // Post ke likes users fetch karna
  const fetchPostLikes = async (postId) => {
    try {
      const response = await getPostLikesApi(postId)
      return response.data || []
    } catch (error) {
      console.log(error.response?.data)
      return []
    }
  }

  // Post ke comments fetch karna
  const fetchPostComments = async (postId) => {
    try {
      const response = await getPostCommentsApi(postId)
      return response.data || []
    } catch (error) {
      console.log(error.response?.data)
      return []
    }
  }

  // Naya comment submit karna
  const submitComment = async (postId, text) => {
    try {
      const response = await addCommentApi(postId, text)
      // Comment count update karte hain feed me
      setFeed((prev) =>
        prev
          ? prev.map((p) =>
              p._id === postId
                ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                : p
            )
          : prev
      )
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment", {
        theme: "dark",
        transition: Zoom,
      })
      return null
    }
  }

  // Comment delete karna
  const deleteComment = async (postId, commentId) => {
    try {
      await deleteCommentApi(commentId)
      // Comment count kam karte hain
      setFeed((prev) =>
        prev
          ? prev.map((p) =>
              p._id === postId
                ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) }
                : p
            )
          : prev
      )
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment", {
        theme: "dark",
        transition: Zoom,
      })
      return false
    }
  }

  return {
    loading,
    feed,
    post,
    GetAllFeed,
    GetExploreFeed,
    GetUserPosts,
    GetSavedPosts,
    handlePost,
    handleLike,
    handleUnlike,
    handleSavePost,
    handleUnsavePost,
    fetchPostLikes,
    fetchPostComments,
    submitComment,
    deleteComment,
  }
}
