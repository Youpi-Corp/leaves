import { useState } from 'react'
import WidgetCounter from '../../components/widget/WidgetCounter/front/widgetCounter'
import PrimaryButton from '../../components/interaction/button/PrimaryButton'
import EditableTextWidget from '../../components/widget/WidgetCounter/front/widgetText'

const PagePoc = () => {
  const [counters, setCounters] = useState<number[]>([])

  const addCounter = () => {
    setCounters((prevCounters) => [...prevCounters, prevCounters.length + 1])
  }

  return (
    <div>
      <PrimaryButton onClick={addCounter}>Add Counter</PrimaryButton>
      {counters.map((counter) => (
        <WidgetCounter key={counter} />
      ))}
      <EditableTextWidget />
    </div>
  )
}

export default PagePoc
