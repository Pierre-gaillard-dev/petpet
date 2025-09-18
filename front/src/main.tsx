import { createRoot } from "react-dom/client"
import App from "./App"
import { UserProvider } from "./contexts/user.context"
import { FeedProvider } from "./contexts/posts.context"

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <FeedProvider>
      <App />
    </FeedProvider>
  </UserProvider>
)
