import type { FC } from "react"
import type { Post as PostType } from "../types"
import "./Post.css"
import { Paw } from "./Icons"

interface PostProps {
  post: PostType
}

const Post: FC<PostProps> = ({ post }) => {
  return (
    <article className="post">
      <div className="post-header">
        <h2>{post.user.username}</h2>
        <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <img src={post.img} alt={post.description} className="post-image" />
      <p className="post-description">{post.description}</p>
      <div className="like-section">
        {post.likes && <span>post.likes</span>}
        <Paw />
      </div>
    </article>
  )
}

export default Post
