import { useEffect, useState, type FC } from "react"
import type { Post as PostType } from "../types"
import "./Post.css"
import { Paw } from "./Icons"
import api from "../config/axios"

interface PostProps {
  post: PostType
}

const Post: FC<PostProps> = ({ post }) => {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
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

    if (liked) {
      void likePost()
    } else {
      void unlikePost()
    }
  }, [liked])

  const handleLike = () => {
    setLiked(prev => !prev)
  }

  const totalLikes = (post.likes ?? 0) + (liked ? 1 : 0)

  return (
    <article className={`post ${liked ? "liked" : ""}`}>
      <div className="post-header">
        <h2>{post.user.username}</h2>
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="image-container">
        <img
          src={post.img}
          alt={post.description}
          className="post-image"
          onDoubleClick={handleLike}
        />
        <div className="like-animation">
          <Paw />
        </div>
      </div>
      <p className="post-description">{post.description}</p>
      <div className="like-section">
        <a onClick={handleLike}>
          {totalLikes > 0 && <span>{totalLikes}</span>}
          <Paw />
        </a>
      </div>
    </article>
  )
}

export default Post
