import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PagePoc from './pages/poc/PagePoc'
import Header from './components/layout/header/Header'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import PageDnd from './pages/poc/PageDnd'
import CourseEditorPage from './pages/course/CourseEditorPage'

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/widget" element={<PagePoc />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dnd" element={<PageDnd />} />
          <Route path="/editor" element={<CourseEditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
