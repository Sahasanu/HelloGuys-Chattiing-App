import user from "../assets/user.svg"
import video from "../assets/video.svg"
import call from "../assets/call.svg"
import attach from "../assets/attach.svg"
import send from '../assets/send.png'

function Chat() {
  return (
    <div className='w-[79%]  mt-[5px] bg-gray-800 h-[90vh] rounded-[5px] relative'>
      <div className="flex userbar w-[100%] bg-gray-600 py-[5px]">
        <div className="flex w-[80%]">
          <div className='w-[10%]  flex justify-center items-center'>
            <img src={user} alt="" className='w-[50px]' />
          </div>
          <div className="message-name w-[70%] pl-[20px]">
            <p className='text-[20px] overflow-hidden'>Test User</p>
            <p className='overflow-hidden text-green-400'>Online</p>
          </div>
        </div>
        <div className="call flex w-[20%] space-x-[50px] justify-center">
          <img src={call} className="w-[36px]" alt="" />
          <img src={video} className="w-[40px]" alt="" />
        </div>
      </div>
      <div className="messege flex w-[73%] justify-around fixed bottom-[10px] right-0">
        <img src={attach} alt="" className="w-[30px]" />
        <div className="w-[95%] flex border px-[15px] py-[8px] rounded-[5px]"> 
          <input type="text" className="w-[98%]" placeholder="Type your message" />
          <img src={send} alt="" className="w-[25px] " />
          </div>
      </div>
    </div>
  )
}

export default Chat
