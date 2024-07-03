import { useState } from 'react';
import Button from '../../../interaction/button/Button'

const EditableTextWidget = () => {
  const [text, setText] = useState('Texte par défaut');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  }

  const saveText = () => {
    setIsEditing(false);
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <input 
            type="text"
            value={text}
            onChange={handleChange}
            style={{flex: 1, width:"60%", height:"50%"}}
          />
          <Button onClick={saveText}>Save</Button>
        </div>
      ) : (
        <div>
          <span>{text}</span>
          <Button onClick={toggleEditing}>...</Button>
        </div>
      )}
    </div>
  )
}

export default EditableTextWidget;
