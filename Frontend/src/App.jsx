import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from "./components/Login"
import Signup from "./components/Signup"
import Notification from "./components/Notification"
import Chat from './components/Chat'
import Call from './components/Call'
import Onboarding from './components/Onboarding'
import { Toaster } from 'react-hot-toast';
import './App.css'
import useAuthUser from './hooks/useAuthUser.js'

function App() {
   const {isLoading,authUser}=useAuthUser()



  if (isLoading) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <div className='wholeapp ' >
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" replace />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" replace />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" replace />} />
        <Route path='/call' element={authUser ? <Call /> : <Navigate to="/login" replace />} />
        <Route path='/notification' element={authUser ? <Notification /> : <Navigate to="/login" replace />} />
        <Route path='/chat' element={authUser ? <Chat /> : <Navigate to="/login" replace />} />
        <Route path='/onboarding' element={authUser ? <Onboarding /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App