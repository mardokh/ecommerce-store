import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRouter from './pages/Public/PublicRouter'
import AdminRouter from './pages/Admin/AdminRouter'
import AdminAuthGuard from './_utils/adminAuthGuard'
import LoginRegister from './pages/Admin/LoginRegister'
import ScrollToTop from './_utils/scrollToTop'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<PublicRouter/>} />
          <Route path="/admin/*" element={<AdminAuthGuard><AdminRouter/></AdminAuthGuard>} />
          <Route path='/auth/admin' element={<LoginRegister/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App