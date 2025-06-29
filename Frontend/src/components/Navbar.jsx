import Chatzy from "../assets/Chatzy.png"
import logoutp from "../assets/logout.png"
import { Link } from "react-router"
import useAuthUser from '../hooks/useAuthUser.js'
import Loading from '../loading/Loading.jsx'
import useLogout from '../hooks/useLogout';
function Navbar() {
  const { isLoading, authUser } = useAuthUser();
  const { logout, isPending } = useLogout();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='navabar w-[100%] h-[9vh] bg-gray-800 flex items-center '>
      <div className="logo h-[100%] flex items-center ml-[30px]">
        <Link to='/'> <img src={Chatzy} alt="" className="w-[120px] " /></Link>
      </div>
      <div className="sideOption ml-auto mr-[20px] flex w-[150px] justify-between h-[100%] items-center">
        <div className="user mt-[5px] flex-col flex items-center">
          <img src={authUser?.profilePic} alt="" className="w-[35px]" />
          <p>{authUser?.fullName}</p>
        </div>
        <div className="logout">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className=""
          >
            {isPending ? 'Logging out...' : <img src={logoutp} alt="" className="w-[35px]" />}
          </button>
          
        </div>
      </div>

    </div>
  )
}

export default Navbar
