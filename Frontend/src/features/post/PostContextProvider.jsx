import React, { createContext, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const PostContext = createContext()

const PostContextProvider = ({children}) => {

    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState(null)
    const [feed, setFeed] = useState(null)

  return (
    <PostContext.Provider value={{loading, setLoading, post, setPost, feed, setFeed}}>
        {children}
    </PostContext.Provider>
  )
}

export default PostContextProvider
