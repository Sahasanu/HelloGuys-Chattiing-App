// RecommendCard.jsx
import location from '../assets/location.png'

function RecommendCard({ user, hasRequest, onSendRequest, isPending }) {
  return (
    <div className="bg-gray-700 rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={user.profilePic || '/default-avatar.png'}
          alt={user.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold  text-xl">{user.fullName}</h3>
          <div className='flex items-center space-x-1'> <img src={location} className='w-[15px]' alt="" />
            <p className="text-gray-400 text-sm">{user.location || 'No bio yet'}</p></div>
        </div>
      </div>

      <div className="mt-4">
        {hasRequest ? (
          <button
            className="w-full py-2 bg-gray-600 text-gray-300 rounded-md cursor-not-allowed"
            disabled
          >
            Request Sent
          </button>
        ) : (
          <button
            onClick={onSendRequest}
            disabled={isPending}
            className={`w-full py-2 rounded-md ${isPending
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isPending ? 'Sending...' : 'Add Friend'}
          </button>
        )}
      </div>
    </div>
  );
}

export default RecommendCard;