import { useChannelStateContext } from 'stream-chat-react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import callIcon from '../assets/call.svg';
import videoIcon from '../assets/video.svg';
import { useNavigate } from 'react-router-dom';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { nanoid } from 'nanoid';
const CustomChannelHeader = ({ videoClient }) => {
    const { channel } = useChannelStateContext();
    const navigate = useNavigate();

    const targetUser = Object.values(channel.state.members).find(
        m => m.user.id !== channel.getClient().userID
    );

    const startCall = useCallback(async (isVideoCall) => {
        if (!videoClient || !targetUser) {
            toast.error('Call service not ready');
            return;
        }

        try {
            // Create a unique call ID
            const callId = `call_${nanoid(16)}`;

            // Create the call with proper settings
            const call = videoClient.call('videocall', callId, {
                members: [
                    { user_id: channel.getClient().userID, role: 'call_member' },
                    { user_id: targetUser.user.id, role: 'call_member' },
                ],
                custom: {
                    channel_id: channel.id,
                },
                settings_override: {
                    video: {
                        enabled: isVideoCall,
                        access_request_enabled: isVideoCall,
                    },
                    screensharing: {
                        enabled: isVideoCall,
                    },
                },
            });


            // Join the call
           

            // Notify participants
            await channel.sendMessage({
                text: `I've started a ${isVideoCall ? 'video' : 'audio'} call. Join me!`,
                attachments: [{
                    type: isVideoCall ? 'video_call' : 'audio_call', // Stream-specific type
                    asset_url: `/call/${callId}`, // URL to join
                    title: `${isVideoCall ? 'Video' : 'Audio'} Call`,
                    og_scrape_url: `${window.location.origin}/call/${callId}`,
                    call_id: callId, // Additional custom data
                    call_type: isVideoCall ? 'video' : 'audio'
                }]
            })

            // Navigate to call page
            navigate(`/call/${callId}?video=${isVideoCall}`);

            toast.success(`${isVideoCall ? 'Video' : 'Audio'} call started!`);
        } catch (error) {
            console.error('Call failed:', error);
            toast.error(`Failed to start ${isVideoCall ? 'video' : 'audio'} call`);
        }
    }, [videoClient, channel, targetUser, navigate]);

    return (
        <div className="channel-header w-full h-[8vh] flex items-center bg-[#243447] px-10 justify-between rounded-b-[10px]">
            {/* User info */}
            <div className="user-info flex w-[30%] space-x-5 items-center">
                <img
                    src={targetUser?.user.image}
                    alt={targetUser?.user.name}
                    className='w-[45px] aspect-auto rounded-full'
                />
                <div>
                    <p className='text-[20px] font-[600] text-white'>{targetUser?.user.name}</p>
                    <p className={targetUser?.user.online ? 'text-green-400' : 'text-gray-300'}>
                        {targetUser?.user.online ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Call buttons */}
            <div className="call-buttons w-[15%] lg:w-[10%] flex justify-around">
                <button
                    onClick={() => startCall(false)}
                    disabled={!targetUser?.user.online}
                    className="p-2 hover:bg-[#3e4758] rounded-full transition"
                    aria-label="Start audio call"
                >
                    <img src={callIcon} alt="Audio call" className="w-6 h-6" />
                </button>
                <button
                    onClick={() => startCall(true)}
                    disabled={!targetUser?.user.online}
                    className="p-2 hover:bg-[#3e4758] rounded-full transition"
                    aria-label="Start video call"
                >
                    <img src={videoIcon} alt="Video call" className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default CustomChannelHeader;