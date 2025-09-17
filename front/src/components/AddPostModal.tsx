import { useRef, useState, type FC } from "react"
import Modal, { type ModalProps } from "./Modal"
import "./AddPostModal.css"

interface AddPostModalProps extends Omit<ModalProps, "children"> {}

interface FormPayload {
  image: File | null
  description: string
}

const AddPostModal: FC<AddPostModalProps> = ({ isOpen, onClose }) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: FormPayload = {
      image: formData.get("image") as File | null,
      description: formData.get("description") as string,
    }
    // TODO: Handle form submission logic here
    console.log("Form submitted:", payload)
    onClose()
    setImagePreview(null)
  }

  const handleImageUploadButton = () => {
    imageInputRef.current?.click()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    console.log("Image uploaded:", file)
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
      </form>
    </Modal>
  )
}

export default AddPostModal
