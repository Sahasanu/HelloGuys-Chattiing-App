import {
  StreamTheme,
  CallControls,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
  CallingState,
  ParticipantView,
} from '@stream-io/video-react-sdk';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import  MicOffIcon  from '../assets/micoff.png';
 import  VideoOffIcon  from '../assets/videooff.png'; // Add your own icons

const CallContent = () => {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const participants = useParticipants();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // Get initial call type from URL or call settings
  const initialIsVideoCall = searchParams.get('video') !== 'false';
  const isVideoCall = call?.state?.settings?.video?.enabled ?? initialIsVideoCall;

  // Track media states
  const otherUser = participants.find(p => !p.isLocalParticipant);
  const isOtherUserVideoOn = otherUser?.publishedTracks.includes('video');
  const isOtherUserAudioOn = otherUser?.publishedTracks.includes('audio');

  // Sync local video state with call
  useEffect(() => {
    if (!call) return;
    
    const updateVideoState = async () => {
      if (isVideoCall) {
        await call.camera.enable();
        setIsVideoEnabled(true);
      } else {
        await call.camera.disable();
        setIsVideoEnabled(false);
      }
    };
    
    updateVideoState();
  }, [call, isVideoCall]);

  if (callingState === CallingState.JOINING || callingState === CallingState.RECONNECTING) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="animate-pulse">
          <div className="w-24 h-24 rounded-full bg-gray-600 mb-4" />
          <p>Connecting to {isVideoCall ? 'video' : 'audio'} call...</p>
        </div>
      </div>
    );
  }

  if (callingState === CallingState.LEFT) {
    navigate('/');
    return null;
  }

  const toggleVideo = async () => {
    if (!call) return;
    await call.camera.toggle();
    setIsVideoEnabled(!isVideoEnabled);
  };

  return (
    <StreamTheme>
      {/* Main Call Content */}
      <div className="relative h-full w-full">
        {isVideoCall ? (
          <>
            {isVideoEnabled ? (
              <SpeakerLayout participantsBarPosition="bottom" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ParticipantView
                  participant={otherUser}
                  muteAudio
                  className="w-full h-full"
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
            {otherUser?.image ? (
              <img
                src={otherUser.image}
                alt="User avatar"
                className="w-32 h-32 rounded-full border-2 border-gray-500 mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl uppercase mb-4">
                {otherUser?.name?.charAt(0) || 'U'}
              </div>
              
            )}
            <p className="text-xl font-medium">{otherUser?.name || 'Call participant'}</p>
            <div className="flex items-center mt-2 text-gray-400">
              {!isOtherUserAudioOn && <img src={MicOffIcon} alt="" className='w-5 h-5' />}
              {isVideoCall && !isOtherUserVideoOn && <img src={VideoOffIcon} className='w-5 h-5' alt="" />}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <CallControls
            onLeave={() => navigate('/')}
            additionalButtons={[
              {
                icon: isVideoEnabled ? <img src={VideoOffIcon} className='w-5 h-5' alt="" /> : <img src={VideoOffIcon} className='w-5 h-5' alt="" />,
                onClick: toggleVideo,
                disabled: !isVideoCall,
                tooltip: isVideoEnabled ? 'Turn off video' : 'Turn on video'
              }
            ]}
          />
        </div>

        {/* Call Type Indicator */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
          {isVideoCall ? 'Video Call' : 'Audio Call'}
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallContent;