import Chatzy from "../assets/chatzy.png"
import logoutp from "../assets/logout.png";
import { Link, useNavigate } from "react-router-dom"; 
import useAuthUser from '../hooks/useAuthUser.js';
import Loading from '../loading/Loading.jsx';
import useLogout from '../hooks/useLogout';

function Navbar() {
  const { isLoading, authUser } = useAuthUser();
  const { logout, isPending } = useLogout();
  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className='navabar w-full h-[9vh] bg-[#243447] flex items-center justify-between px-6 shadow-md'>
      {/* Logo */}
      <Link to='/'>
        <img src={Chatzy} alt="Logo" className="w-[120px]" />
      </Link>

      {/* Right Side: Profile + Logout */}
      <div className="flex items-center gap-6">
        {/* User Profile (clickable) */}
        <div
          onClick={handleProfileClick}
          className="cursor-pointer flex flex-col items-center group"
        >
          <img
            src={authUser?.profilePic}
            alt="User"
            className="w-[35px] h-[35px] rounded-full border-2 border-transparent group-hover:border-white transition"
          />
          <p className="text-white text-xs mt-1">{authUser?.fullName}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          disabled={isPending}
          className="hover:scale-105 transition"
        >
          {isPending ? (
            <p className="text-white text-sm">Logging out...</p>
          ) : (
            <img src={logoutp} alt="Logout" className="w-[30px]" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
