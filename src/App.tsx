import Button from './components/interaction/button/Button'
import Header from './components/layout/header/Header'
import WidgetCounter from './components/widget/WidgetCounter/front/widgetCounter'

function App() {
  return (
    <>
      <Header />
      <Button style="primary">Primary</Button>
      <Button style="secondary">Secondary</Button>
      <Button style="tertiary">Tertiary</Button>
      <WidgetCounter />
    </>
  )
}

export default App
