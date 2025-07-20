import './App.css'

import Home from './components/Home'
import Chat from './components/Chat'
import CallPage from './components/CallPage.jsx'
import Login from "./components/Login"
import Signup from "./components/Signup"
import Loading from './loading/Loading.jsx'
import Chatlist from './components/Chatlist.jsx'
import Onboarding from './components/Onboarding'
import useAuthUser from './hooks/useAuthUser.js'
import Notification from "./components/Notification"
import ProfileSettings from './components/ProfileSettings'
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'

function App() {
  const { isLoading, authUser } = useAuthUser()

  const isauthenticated = Boolean(authUser)
  const onboardeduser = Boolean(authUser?.isOnBoard)


  if (isLoading) {
    return <Loading />; // Add a loading state
  }

  return (
    <div className='wholeapp w-full h-full bg-[#14252d]  text-white font-poppins ' >
      <Toaster />

      <Routes>
        {/* Main protected layout route */}
        <Route
          path="/"
          element={
            isauthenticated && onboardeduser
              ? <Layout />
              : <Navigate to={!isauthenticated ? "/login" : "/onboarding"} replace />
          }
        >
          {/* Nested routes rendered inside Layout (Outlet) */}
          <Route index element={<Home />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="chatlist" element={<Chatlist />} />
          <Route path="notification" element={<Notification />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>

        {/* Outside layout routes */}
        <Route
          path="/signup"
          element={
            !isauthenticated
              ? <Signup />
              : <Navigate to={onboardeduser ? "/" : "/onboarding"} replace />
          }
        />
        <Route
          path="/login"
          element={
            !isauthenticated
              ? <Login />
              : <Navigate to={onboardeduser ? "/" : "/onboarding"} replace />
          }
        />
        <Route
          path="/call/:id"
          element={
            isauthenticated
              ? <CallPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/onboarding"
          element={
            isauthenticated
              ? (!onboardeduser ? <Onboarding /> : <Navigate to="/" />)
              : <Navigate to="/login" replace />
          }
        />
      </Routes>

    </div>
  )
}

export default App