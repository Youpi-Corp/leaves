import { useState } from 'react'
import PrimaryButton from '../../../interaction/button/PrimaryButton'

const WidgetCounter = () => {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  const validate = () => {
    // Add your validation logic here
    console.log('Validated!')
  }

  return (
    <div>
      <PrimaryButton onClick={decrement}>-</PrimaryButton>
      <span>{count}</span>
      <PrimaryButton onClick={increment}>+</PrimaryButton>
      <PrimaryButton onClick={validate}>Validate</PrimaryButton>
    </div>
  )
}

export default WidgetCounter
