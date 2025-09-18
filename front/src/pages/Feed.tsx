import { useEffect, useState, type FC } from "react"
import Post from "../components/Post"
import "./Feed.css"
import type { Post as PostType } from "../types"
import api from "../config/axios"

const Feed: FC = () => {
  const [posts, setPosts] = useState<PostType[]>([])

  useEffect(() => {
    api.get("/posts").then(response => {
      const postData: PostType[] = response.data.posts
      setPosts(postData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    })
  }, [])

  return (
    <main className="feed">
      <h1>Les toutous</h1>
      <div className="feed-content">
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  )
}

export default Feed
