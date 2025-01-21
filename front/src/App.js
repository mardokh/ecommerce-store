import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRouter from './pages/Public/PublicRouter'
import AdminRouter from './pages/Admin/AdminRouter'
import AdminAuthGuard from './_utils/adminAuthGuard'
import LoginRegister from './pages/Admin/LoginRegister'
import ScrollToTop from './_utils/scrollToTop'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { updateFavsProducts } from '../src/redux/reducers/favPrdSlice'


function App() {

  // Rest favorites products count
  const dispatch = useDispatch()
  const favoritesCookie = Cookies.get('client_id_favorites_products')
  if (!favoritesCookie) dispatch(updateFavsProducts({count: 0}))
  
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