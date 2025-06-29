
import useAuthUser from '../hooks/useAuthUser'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import noti from '../assets/noti.svg'
import message from '../assets/message.svg'
import call from '../assets/call.svg'
import user from "../assets/user.svg"

function Sidebar() {
  const { authUser } = useAuthUser()
  const location = useLocation()
  const currentpath = location.pathname;
  console.log(currentpath);

  return (
    <div className='sidebar w-[28%] h-[90vh]'>
      <div className='btns mt-[5px] bg-gray-800 rounded-[5px] flex justify-around h-[5vh] items-center'>
        <Link><img src={message} alt="" /></Link>
        <Link to='/call'><img src={call} alt="" /></Link>
        <Link to="/notification"><img src={noti} alt="" /></Link>
      </div>
      <div className='chats space-y-[20px] h-[84vh]  pt-[2vh] mt-[1vh] bg-gray-800 rounded-[5px] px-[10px]'>
        <div className="chatcard flex gap-[10px] w-[100%] items-center">
          <div className='w-[10%] flex items-center '>
            <img src={user} alt="" className='w-[100%]' />
          </div>
          <div className="message-name w-[70%] pl-[20px]">
            <p className='text-[20px] overflow-hidden'>Test User</p>
            <p className='overflow-hidden'>hello</p>
          </div>
          <div className="notofication-count w-[10%]">
            <p className="time text-[15px]">12.21pm</p>
            <p className=' border w-[20px] h-[20px] rounded-full flex items-center justify-center bg-green-400 text-black text-[12px] font-[600] mt-[5px]'>1</p>
          </div>
        </div>
       
      </div>
    </div>
  )
}

export default Sidebar
