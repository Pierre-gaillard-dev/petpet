import type { FC } from "react"
import { Link } from "react-router"
import "./NotFound.css"

const NotFound: FC = () => {
  return (
    <div className="not-found">
      <img src="https://cdn.omlet.com/images/originals/Cat-Cat_Guide-A_sociable_and_friendly_Persian_cat.jpg" />
      <h1>Vous êtes perdu ?</h1>
      <Link to="/">
        <button>Retour à l'accueil</button>
      </Link>
    </div>
  )
}

export default NotFound
