import { type FC } from "react"
import Post from "../components/Post"
import "./Feed.css"
import { useFeed } from "../contexts/posts.context"

const Feed: FC = () => {

  const feed = useFeed();
  
  return (
    <main className="feed">
      <h1>Les animaux</h1>
      <div className="feed-content">
        {feed.posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  )
}

export default Feed
