import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import Login from "../components/Login"
import Signup from "../components/Signup"
import Notification from "../components/Notification"
import Chat from '../components/Chat'
import Call from '../components/Call'
import Onboarding from '../components/onboarding'
import toast, { Toaster } from 'react-hot-toast';

import './App.css'

const notify =() => {
  toast.success("here your Toast",{style:{backgroundColor:"black",color:"white"},
  position:"bottom-center"})
}


function App() {


  return (
    <>
      <div className='wholeapp' data-theme="dark">
      <button onClick={notify}>click</button>
      <Toaster/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/call' element={<Call/>} />
          <Route path='/notification' element={<Notification/>} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='/onboarding' element={<Onboarding/>} />

        </Routes>
      </div>
    </>
  )
}

export default App
