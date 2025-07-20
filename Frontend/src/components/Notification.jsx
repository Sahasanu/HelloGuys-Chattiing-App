import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getfriendrequest, acceptfriendrequest } from '../lib/api.js'
import Loading from '../loading/Loading'
import noti from '../assets/noti.svg'
import user from "../assets/user.svg"
import location from '../assets/location.png' // Fixed typo in import
import { useEffect } from 'react'

function Notification({setUnreadNotificationCount }) {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: getfriendrequest
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptfriendrequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] })
    }
  })
 useEffect(() => {
    // Simulate fetch from backend
    const unreadCount = 3; // Replace this with actual unread count from API or state
    setUnreadNotificationCount(unreadCount);
  }, [setUnreadNotificationCount]);


  const incomingRequest = data?.incoming || []
  const acceptedRequest = data?.accepted || []


  return (
    <div className='Notification space-y-[20px] h-[83vh] pt-[2vh] mt-[1vh] bg-gray-800 rounded-[5px] px-[10px]'>
      <p className='text-[25px] font-[500] border-b border-white'>Notification</p>

      {isLoading ? (
        <div className='flex justify-center items-center'>
          <Loading />
        </div>
      ) : (
        <>
          {incomingRequest.length > 0 && (
            <div>
              <div className="flex w-full space-x-4 items-center">
                <img src={noti} alt="Notification" />
                <p className='font-bold'>Friend Request</p>
                <p className='border w-[20px] h-[20px] rounded-full flex items-center justify-center bg-green-400 text-black text-[12px] font-[700] mt-[5px]'>
                  {incomingRequest.length}
                </p>
              </div>

              {/* Fixed map function with return statement */}
              {incomingRequest.map((request) => (
                <div key={request._id} className="card my-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.sender.profilePic || user} // Using sender's profile pic
                      alt={request.sender.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl">
                        {request.sender.fullName || 'Unknown User'}
                      </h3>
                      <div className='flex items-center space-x-1'>
                        <img src={location} className='w-[15px]' alt="location" />
                        <p className="text-gray-400 text-sm">
                          {request.sender.location || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        acceptRequestMutation(request._id)
                        console.log('button clicked')
                      }

                      }
                      disabled={isPending}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                      {isPending ? 'Accepting...' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}

            </div>
          )}

          {acceptedRequest.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">

                New Connections
              </h2>

              <div className="space-y-3">
                {acceptedRequest.map((notification) => (
                  <div key={notification._id} className="card bg-gray-700 rounded-lg">
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="avatar mt-1 size-10 rounded-full">
                          <img
                            src={notification.recipient.profilePic}
                            alt={notification.recipient.fullName}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                          <p className="text-sm my-1">
                            {notification.recipient.fullName} accepted your friend request
                          </p>
                          <p className="text-xs flex items-center opacity-70">
                            {/* <ClockIcon className="h-3 w-3 mr-1" /> */}
                            Recently
                          </p>
                        </div>
                        <div className="badge badge-success">
                          {/* <MessageSquareIcon className="h-3 w-3 mr-1" /> */}
                          New Friend
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {incomingRequest.length === 0 && acceptedRequest.length === 0 && (
            <div className='bg-gray-700 text-center'>
              <p className='text-[20px] font-[500]' >  No Notifification Yet</p>
              <p className='opacity-[80%] text-[15px]'>Check Later</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
export default Notification