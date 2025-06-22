import React, { useState } from 'react'
import logo from "../assets/Chatzy.png"
import big from "../assets/signup.login.png"
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginfn } from '../lib/api.js'
import toast, { Toaster } from 'react-hot-toast'
import Loading from '../loading/Loading'
import useAuthUser from '../hooks/useAuthUser'
function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

 
  const { mutate:loginMutation, isPending } = useMutation({
    mutationFn: () => loginfn(loginData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success("logged in successfully!")
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast.error((error?.response?.data?.message || "Login failed"), {style:{background:"#000000", color: "white"}})
    }
   
  })

  const handlesubmit = (e) => {
    e.preventDefault()
    loginMutation()
  }


  return (
    <div className='logincont h-[100Vh] w-[100%] flex justify-center items-center bg-black text-white'>
      <Toaster  />
      <div className="cont w-[30%] h-[70%] border-[1px] border-[#4f4f4fcb] bg-[#191919] flex justify-center items-center rounded-[10px] shadow-lg shadow-[#000000]">
        <div className="right w-[100%] h-[100%] p-[20px]">
          <div className="logo w-[98%] mt-[px] flex items-center justify-center">
            <img className='w-[120px]' src={logo} alt="" />
          </div>
          <div className="head w-[100%] mt-[15px]">
            <p className='text-[18px] font-[500]'>welcome Back</p>
            <p className='text-[15px] text-gray-300'>Log in Chatzy to continue chat with your friends</p>
          </div>
          <div className="input w-[98%] ml-auto mr-auto">
            <form onSubmit={handlesubmit} className='flex flex-col gap-[10px] mt-[20px]'>
          
              <div className="email">
                <p>Email</p>
                <input type="text" className='border-1 w-[98%] h-[6vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px]'
                  placeholder='example@gmail.com'
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required />
              </div>
              <div className="password">
                <p>Create password</p>
                <input type="password" className='border-1 w-[98%] h-[6vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px] pt-[2px]'
                  placeholder='******'
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required />
              </div>
            
              <button className='bg-[#008080] w-[100%] p-[10px] rounded-[10px] mt-[5vh] text-white font-bold text-[20px]' type='submit'>
                {isPending ? "logging..." : "login"}
              </button>
            </form>
          </div>
          <div className="login flex text-[14px] w-[100%] mt-[15px]">
            <p className='text-center w-[100%]'>Don't have an account <Link to="/signup" className='text-[#008080]'>Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
