 import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from "./components/Login"
import Signup from "./components/Signup"
import Notification from "./components/Notification"
import Chat from './components/Chat'
import Call from './components/Call'
import Onboarding from './components/Onboarding'
import Loading from './loading/Loading.jsx'
import { Toaster } from 'react-hot-toast';
import './App.css'
import useAuthUser from './hooks/useAuthUser.js'

function App() {
  const { isLoading, authUser } = useAuthUser()

  const isauthenticated = Boolean(authUser)
  const onboardeduser = Boolean(authUser?.isOnBoard)


  if (isLoading) {
    return <Loading/>; // Add a loading state
  }

  return (
    <div className='wholeapp w-full h-full bg-black text-white ' >
      <Toaster />
      <Routes>
        <Route path='/' element={isauthenticated && onboardeduser ? (<Home />) : (<Navigate to={!isauthenticated ? "/login" : "/onboarding"} />)} replace />
        <Route path='/signup' element={!isauthenticated ? <Signup /> :  <Navigate to={onboardeduser?"/":"/onboarding"} replace />} />
        <Route path='/login' element={!isauthenticated ? <Login /> : <Navigate to={onboardeduser?"/":"/onboarding"} replace />} />
        <Route path='/call' element={isauthenticated ? <Call /> : <Navigate to="/login" replace />} />
        <Route path='/notification' element={isauthenticated ? <Notification /> : <Navigate to="/login" replace />} />
        <Route path='/chat' element={isauthenticated ? <Chat /> : <Navigate to="/login" replace />} />
        <Route path='/onboarding' element={isauthenticated ? (!onboardeduser?<Onboarding />:<Navigate to="/login"/>) : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App