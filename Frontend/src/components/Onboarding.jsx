import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { onboardingfn } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading'

function Onboarding() {

  const { authUser, isLoading } = useAuthUser()
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [UserData, setUserData] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || ''
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: () => onboardingfn(UserData),
    onSuccess: () => {

      toast.success("Onboarding successfully completed!");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      navigate("/");
    },
    onError: (error) => {

      toast.error((error?.response?.data?.message || "Can't Create Your Profile"));
    }
  })

  if (isLoading) {
    return <Loading />; // Add a loading state
  }

  const handlesubmit = (e) => {
    e.preventDefault();
    onboardingMutation();
    console.log("userdata", UserData);
  }

  const randomavatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomavatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setUserData({ ...UserData, profilePic: randomavatar });
    toast.success("Random avatar generate suusefully", { style: { background: "teal", color: "white" } })
  }



  return (
    <div className='wholecontainer h-[100Vh] w-[100%] flex justify-center items-center bg-black text-white'>
      <div className="cont w-[35%] h-[90%] border-[1px] border-[#4f4f4fcb] bg-[#191919]  rounded-[10px] shadow-lg shadow-[#000000] p-[10px]">
        <div className="head w-[100%] mt-[15px] text-center">
          <p className='font-[500] text-[20px]'>Complete Your Profile</p>
        </div>
        <div className='input w-[98%] ml-auto mr-auto mt-[10px]'>
          <form onSubmit={handlesubmit} className='flex flex-col gap-[10px] mt-[10px]'>
            <div className="profilepic w-[100%]  mt-[20px]">
              <div className="img w-[100%] flex justify-center">
                <img className='border-[#4f4f4fcb] w-[7vw] h-[7vw] rounded-[50%] overflow-hidden object-center' src={UserData.profilePic} alt="" />
              </div>
              <div className="generateprofile w-[100%] flex justify-center mt-[10px]"><button onClick={randomavatar} className='bg-[teal] p-[3px] rounded-2xl font-[600] text-[15px]'>Generate Random Avatar</button> </div>
            </div>


            <div className="name">
              <p>Full Name</p>
              <input type="text" className='border-1 w-[98%] h-[5vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px]'
                placeholder='John Doe'
                value={UserData.fullName}
                onChange={(e) => setUserData({ ...UserData, fullName: e.target.value })}
              />
            </div>
            <div className="bio">
              <p>Bio</p>
              <input type="text" className='border-1 w-[98%] h-[10vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px]'
                placeholder='Tell us Other about yourself'
                value={UserData.bio}
                onChange={(e) => setUserData({ ...UserData, bio: e.target.value })}
              />
            </div>
            <div className="password">
              <p>Location</p>
              <input type="text" className='border-1 w-[98%] h-[6vh] pl-[10px] rounded-[10px] mt-[10px] text-[15px] pt-[2px]'
                placeholder='connnect with Your local freinds'
                value={UserData.location}
                onChange={(e) => setUserData({ ...UserData, location: e.target.value })}
              />
            </div>
            <button className='bg-[#008080] w-[100%] p-[10px] rounded-[10px] mt-[20px] text-white font-bold text-[20px]' type='submit' disabled={isPending}>
              {isPending ? " Onbaoarding..." : "Create profile"}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Onboarding
