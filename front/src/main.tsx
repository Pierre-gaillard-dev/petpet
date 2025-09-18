import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { UserProvider } from "./contexts/user.context"
import { FeedProvider } from "./contexts/posts.context"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <FeedProvider>
        <App />
      </FeedProvider>
    </UserProvider>
  </StrictMode>
)
