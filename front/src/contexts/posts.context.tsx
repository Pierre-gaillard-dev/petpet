import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import type { Post } from "../types"
import api from "../config/axios"

type PostsContextType = {
    posts: Post[]
    setPosts: Dispatch<SetStateAction<Post[]>>
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([])
    useEffect(() => {
        api.get("/posts").then(response => {
        const postData: Post[] = response.data.posts
        setPosts(postData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
        })
    }, [])
    return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export const useFeed = () => {
  const context = useContext(PostsContext)
  if (!context) {
    throw new Error("postsContext must be used within a UseFeed")
  }
  return context
}
