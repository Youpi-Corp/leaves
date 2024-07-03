import { useState } from 'react';
import Button from '../../../interaction/button/Button'

const TextWidget = () => {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const clearText = () => {
    setText('');
  }

  const validate = () => {
    console.log('Texte validé:', text);
  }

  return (
    <div>
      <input type="text" value={text} onChange={handleChange} />
      <Button onClick={clearText}>Effacer</Button>
      <Button onClick={validate}>Valider</Button>
    </div>
  )
}

export default TextWidget;

