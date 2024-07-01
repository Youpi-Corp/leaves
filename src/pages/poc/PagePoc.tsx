import { useState } from 'react'
import WidgetCounter from '../../components/widget/WidgetCounter/front/widgetCounter'
import Button from '../../components/interaction/button/Button'

const PagePoc = () => {
  const [counters, setCounters] = useState<number[]>([])

  const addCounter = () => {
    setCounters((prevCounters) => [...prevCounters, prevCounters.length + 1])
  }

  return (
    <div>
      <Button style="secondary" onClick={addCounter}>
        Add Counter
      </Button>
      {counters.map((counter) => (
        <WidgetCounter key={counter} />
      ))}
    </div>
  )
}

export default PagePoc
