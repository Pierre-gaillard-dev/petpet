import { useRef, useState, type FC } from "react"
import Modal, { type ModalProps } from "./Modal"
import "./AddPostModal.css"
import api from "../config/axios"
import { useFeed } from "../contexts/posts.context"
import type { Post } from "../types"

interface AddPostModalProps extends Omit<ModalProps, "children"> {}

interface FormPayload {
  image: File | null
  description: string
}

const AddPostModal: FC<AddPostModalProps> = ({ isOpen, onClose }) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState("");

  const feed = useFeed();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: FormPayload = {
      image: formData.get("image") as File | null,
      description: formData.get("description") as string,
    }
    try {
      const response = await api.post('/post', {
        image: payload.image,
        description: payload.description
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.status !== 200) {
        setError("Une erreur est parvenue")
      } else if (response.status === 200) {
        const postData = response.data.post;
        const post: Post = {
          id: postData.id,
          image_path: postData.image_path,
          description: postData.description,
          user: {
            id: 1,
            username: postData.username
          },
          like: 0,
          createdAt: postData.createdAt,
          updatedAt: postData.updatedAt
        }
        feed.setPosts(prev => [post, ...prev]);
        onClose();
      }
    } catch (err) {
      setError("Une erreur est parvenue")
      console.log(err);
    }
    setImagePreview(null)
  }

  const handleImageUploadButton = () => {
    imageInputRef.current?.click()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="add-post-modal">
      <header>
        <h2>Add New Post</h2>
        <button onClick={onClose} className="close-button">
          &times;
        </button>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="image-upload">
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={imageInputRef}
            required
            onChange={handleImageUpload}
          />
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <div
                className="change-image-overlay"
                onClick={handleImageUploadButton}
              >
                Changer l'image
              </div>
            </>
          ) : (
            <button type="button" onClick={handleImageUploadButton}>
              Upload Image
            </button>
          )}
        </div>
        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          placeholder="Parlez-nous de votre animal"
        />
        <button type="submit">Envoyer</button>
      
        <div>
          { error }
        </div>
      </form>
    </Modal>
  )
}

export default AddPostModal
