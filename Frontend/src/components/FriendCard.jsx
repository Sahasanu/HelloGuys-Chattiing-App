import user from '../assets/user.svg'
import message from '../assets/message.svg'
import { Link } from 'react-router'
function FriendCard({friend}) {
    console.log(friend);
    
    return (
        <div>
            <div className="Friendcard border w-[300px] rounded-[5px]">
                <div className='  flex  items-center justify-around px-3 py-2 '>
                    <img src={friend.profilePic||user} alt="" className='w-[50px]' />
                    <div>
                        <p className='text-[25px] overflow-hidden'>{friend.fullName}</p>
                        <p className='text-[15px]'>{friend.location}</p>
                    </div>
                    <Link to={`/chat/${friend._id}`}><img src={message} alt="" /></Link>
                </div>
            </div>
        </div>
    )
}

export default FriendCard
