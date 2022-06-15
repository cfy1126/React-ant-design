import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from 'react-router-dom'
// import Layout from '@/pages/Layout'
// import Login from '@/pages/Login'
import AuthComponent from './components/AuthComponent'
import './App.css'
// import Home from './pages/Home'
// import Article from './pages/Article'
// import Publish from './pages/Publish'
import { history } from '@/utils/history'
// 导入必要组件
import { lazy, Suspense } from 'react'
// 按需导入路由组件
const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))
function App() {
  return (
    <HistoryRouter history={history}>
      <Suspense
        fallback={
          <div
            style={{
              textAlign: 'center',
              marginTop: 200,
            }}>
            loading...
          </div>
        }>
        <Routes>
          <Route
            path="/"
            element={
              <AuthComponent>
                <Layout />
              </AuthComponent>
            }>
            <Route index element={<Home />}></Route>
            <Route path="article" element={<Article />}></Route>
            <Route path="publish" element={<Publish />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Suspense>
    </HistoryRouter>
  )
}

export default App
