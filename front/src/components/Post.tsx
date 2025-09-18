import { useEffect, useState, type FC } from "react"
import type { Post as PostType } from "../types"
import "./Post.css"
import { Paw } from "./Icons"
import api from "../config/axios"
import { useUser } from "../contexts/user.context"

interface PostProps {
  post: PostType
}

const Post: FC<PostProps> = ({ post }) => {
  const { likedPosts } = useUser()
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (likedPosts && likedPosts.includes(post.id)) {
      setLiked(true)
    }
  }, [likedPosts])

  const handleLike = () => {
    const likePost = async () => {
      try {
        await api.post("/post/like", { postId: post.id })
      } catch (err) {
        console.log(err)
      }
    }

    const unlikePost = async () => {
      try {
        await api.delete("/post/like", { data: { postId: post.id } })
      } catch (err) {
        console.log(err)
      }
    }

    setLiked(prev => {
      const newLike = !prev
      if (newLike) {
        likePost()
      } else {
        unlikePost()
      }
      return newLike
    })
  }

  console.log(post)

  const totalLikes =
    (post.like ?? 0) +
    (liked ? 1 : 0) -
    (likedPosts && likedPosts.includes(post.id) ? 1 : 0)

  return (
    <article className={`post ${liked ? "liked" : ""}`}>
      <div className="post-header">
        <h2>{post.user.username}</h2>
        <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="image-container">
          <img
          src={`http://localhost:3000${post.image_path}`}
          alt={post.description}
          className="post-image"
          onDoubleClick={handleLike}
        />
        <div className="like-animation">
          <Paw />
        </div>
      </div>
      <p className="post-description">« {post.description} »</p>
      <div className="like-section">
        <a onClick={handleLike}>
          <span className="like-count">{totalLikes}</span>
          <Paw />
        </a>
      </div>
    </article>
  )
}

export default Post
