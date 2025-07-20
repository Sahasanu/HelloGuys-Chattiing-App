import useAuthUser from '../hooks/useAuthUser'
import { useLocation } from 'react-router'
import noti from '../assets/noti.svg'
import message from '../assets/message.svg'
import call from '../assets/call.svg'
import friends from '../assets/freinds.png'
import Chatlist from './Chatlist'
import Notification from './Notification'
import Friends from './Friends'
import { useState } from 'react'

function Sidebar() {
  const { authUser } = useAuthUser()
  const location = useLocation()
  const currentpath = location.pathname;
  const [activeTab, setActiveTab] = useState('chat');

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [pendingFriendCount, setPendingFriendCount] = useState(0); // ✅ ADD THIS LINE


  const getBtnClass = (tab) =>
    `relative w-[25%] flex justify-center rounded-2xl py-1 items-center ${activeTab === tab ? 'bg-[#4b5757ab] border border-[#505c5c]' : ''
    }`;

  let activebar;
  if (activeTab === 'chat') activebar = <Chatlist setUnreadMessageCount={setUnreadMessageCount} />;
  else if (activeTab === 'call') activebar = <Friends setPendingFriendCount={setPendingFriendCount} />;

  else if (activeTab === 'noti') activebar = <Notification setUnreadNotificationCount={setUnreadNotificationCount} />;

  return (
    <div className='sidebar'>
      <div className='btns mt-[5px] bg-gray-800 rounded-[5px] flex px-5 py-2 justify-between h-[5vh] items-center border-[#3342578c] '>

        {/* Message Icon with Badge */}
        <div className={getBtnClass('chat')} onClick={() => setActiveTab('chat')}>
          <img src={message} alt="" />
          {unreadMessageCount > 0 && (
            <span className="absolute top-0 right-0 -translate-x-[20px] -translate-y-[15%] bg-green-400 text-black text-xs font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {unreadMessageCount}
            </span>
          )}
        </div>

        {/* Friends Icon with Badge */}
        <div className={getBtnClass('call')} onClick={() => setActiveTab('call')}>
          <img src={friends} className='w-[25px]' alt="" />
          {pendingFriendCount > 0 && (
            <span className="absolute top-0 right-0 -translate-x-[20px] -translate-y-[15%] bg-green-400 text-black text-xs font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {pendingFriendCount}
            </span>
          )}
        </div>

        {/* Notification Icon with Badge */}
        <div className={getBtnClass('noti')} onClick={() => setActiveTab('noti')}>
          <img src={noti} alt="" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-0 right-0 -translate-x-[20px] -translate-y-[15%] bg-green-400 text-black text-xs font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {unreadNotificationCount}
            </span>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        {activebar}
      </div>
    </div>
  )
}

export default Sidebar
