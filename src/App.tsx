import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PagePoc from './pages/poc/PagePoc'
import Header from './components/layout/header/Header'
import LoginPage from './pages/login/LoginPage'
import PageDnd from './pages/poc/PageDnd'

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/widget" element={<PagePoc />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dnd" element={<PageDnd />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
