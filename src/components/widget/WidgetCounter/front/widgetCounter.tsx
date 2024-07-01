import { useState } from 'react'
import Button from '../../../interaction/button/Button'

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
      <Button onClick={decrement} style="tertiary">
        -
      </Button>
      <span>{count}</span>
      <Button style="tertiary" onClick={increment}>
        +
      </Button>
      <Button style="primary" onClick={validate}>
        Validate
      </Button>
    </div>
  )
}

export default WidgetCounter
