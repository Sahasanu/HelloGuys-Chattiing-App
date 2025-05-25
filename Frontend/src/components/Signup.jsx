import React, { useState } from 'react'
import logo from "../assets/Chatzy.png"
import big from "../assets/signup.login.png"
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api.js'
import toast, { Toaster } from 'react-hot-toast'

function Signup() {
  const [signupdata, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: () => signup(signupdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success("Account created successfully!")
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast.error((error?.response?.data?.message || "Signup failed"), {style:{background:"#000000", color: "white"}})
    }
  })

  const handleSignup = (e) => {
    e.preventDefault()
    mutate()
  }

  return (
    <div className='signupCont h-[100Vh] w-[100%] flex justify-center items-center bg-black text-white'>
      <Toaster  />
      <div className="cont w-[30%] h-[83%] border-[1px] border-[#4f4f4fcb] bg-[#191919] flex justify-center items-center rounded-[10px] shadow-lg shadow-[#000000]">
        <div className="right w-[100%] h-[100%] p-[20px]">
          <div className="logo w-[98%] mt-[px] flex items-center justify-center">
            <img className='w-[120px]' src={logo} alt="" />
          </div>
          <div className="head w-[100%] mt-[15px]">
            <p className='text-[18px] font-[500]'>Create an Account</p>
            <p className='text-[15px] text-gray-300'>Join Chatzy to connect with your friends</p>
          </div>
          <div className="input w-[98%] ml-auto mr-auto">
            <form onSubmit={handleSignup} className='flex flex-col gap-[10px] mt-[20px]'>
              <div className="name">
                <p>Name</p>
                <input type="text" className='border-1 w-[98%] h-[5vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px]'
                  placeholder='John Doe'
                  value={signupdata.fullName}
                  onChange={(e) => setSignupData({ ...signupdata, fullName: e.target.value })}
                  required />
              </div>
              <div className="email">
                <p>Email</p>
                <input type="text" className='border-1 w-[98%] h-[5vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px]'
                  placeholder='example@gmail.com'
                  value={signupdata.email}
                  onChange={(e) => setSignupData({ ...signupdata, email: e.target.value })}
                  required />
              </div>
              <div className="password">
                <p>Create password</p>
                <input type="password" className='border-1 w-[98%] h-[5vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px] pt-[2px]'
                  placeholder='******'
                  value={signupdata.password}
                  onChange={(e) => setSignupData({ ...signupdata, password: e.target.value })}
                  required />
              </div>
              <div className="req opacity-[70%] text-[13px] mt-[5px]">Password should be at least 6 characters</div>
              <div className="req opacity-[70%] text-[13px] mt-[10px] h-[4vh] flex items-center gap-[5px]">
                <input type="checkbox" required />
                <p>I agree to the <span className='text-[#008080]'>Terms & Conditions</span> and <span className='text-[#008080]'>Privacy Policy</span></p>
              </div>
              <button className='bg-[#008080] w-[100%] p-[10px] rounded-[10px] mt-[20px] text-white font-bold text-[20px]' type='submit'>
                {isPending ? "Signing up..." : "Create Account"}
              </button>
            </form>
          </div>
          <div className="login flex text-[14px] w-[100%] mt-[15px]">
            <p className='text-center w-[100%]'>Already have an account <Link to="/login" className='text-[#008080]'>Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
