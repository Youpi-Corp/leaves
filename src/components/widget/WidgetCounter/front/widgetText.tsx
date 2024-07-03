import { useState } from 'react'
import PrimaryButton from '../../../interaction/button/PrimaryButton'

const EditableTextWidget = () => {
  const [text, setText] = useState('Texte par défaut')
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  const saveText = () => {
    setIsEditing(false)
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={text}
            onChange={handleChange}
            style={{ flex: 1, width: '60%', height: '50%' }}
          />
          <PrimaryButton onClick={saveText}>Save</PrimaryButton>
        </div>
      ) : (
        <div>
          <span>{text}</span>
          <PrimaryButton onClick={toggleEditing}>...</PrimaryButton>
        </div>
      )}
    </div>
  )
}

export default EditableTextWidget
