import type { FC } from "react"
import Post from "../components/Post"
import "./Feed.css"

const Feed: FC = () => {
  return (
    <main className="feed">
      <h1>Les toutous</h1>
      <div className="feed-content">
        <Post
          post={{
            id: 1,
            img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            description:
              "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
            user: { id: 1, username: "user1" },
            createdAt: "2023-10-01T00:00:00.000Z",
            updatedAt: "2023-10-01T00:00:00.000Z",
          }}
        />
      </div>
    </main>
  )
}

export default Feed
