import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import Callui from './CallUi'
import {
  
    StreamVideoClient,
    StreamCall,
    StreamVideo,
StreamTheme ,
    CallControls,
    SpeakerLayout,
    
    CallingState,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import Loader from '../loading/Loading';
import "@stream-io/video-react-sdk/dist/css/styles.css";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_KEY;

// CallContent component for rendering the call UI



function CallPage() {
    const { id: callId } = useParams();
    const [searchParams] = useSearchParams();
    const isVideo = searchParams.get('video') !== 'false';
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    const { authUser, isLoading } = useAuthUser();

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser,
    });

    useEffect(() => {
        if (isLoading || !tokenData?.token || !authUser || !callId) return;

        const initCall = async () => {
            try {
                console.log("Initializing Stream video client...");

                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic,
                };

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                });

                // Use a more specific call type than "default"
                const callType = 'videocall'; // Must match your Stream dashboard
                const callInstance = videoClient.call(callType, callId);

                // Add call configuration with proper resolution settings
                await callInstance.join({
                    create: true,
                    data: {
                        members: [
                            { user_id: authUser._id, role: 'call_member' }
                        ],
                        settings_override: {
                            video: {
                                enabled: isVideo,
                                access_request_enabled: isVideo,
                                target_resolution: {  // Required field when video is enabled
                                    width: isVideo ? 640 : 240,  // Higher res for video calls
                                    height: isVideo ? 480 : 240   // Minimum 240x240 for audio
                                }
                            },
                            screensharing: {
                                enabled: isVideo,
                                settings: isVideo ? {  // Optional but recommended
                                    target_resolution: {
                                        width: 1280,
                                        height: 720
                                    }
                                } : undefined
                            }
                        }
                    }
                });

                console.log("Joined call successfully");
                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("Error joining call:", error);
                toast.error("Could not join the call. Please try again.");
                navigate('/'); // Redirect on error
            } finally {
                setIsConnecting(false);
            }
        };

        initCall();

        return () => {
            if (call) {
                call.leave().catch(console.error);
            }
            if (client) {
                client.disconnectUser();
            }
        };
    }, [tokenData, authUser, callId, navigate, isLoading]);

    if (isConnecting) {
        return <Loader message="Initializing call..." />;
    }

    return (
        <div className="h-screen w-screen bg-gray-900">
            {client && call ? (
                <StreamVideo client={client}>
                    <StreamCall call={call}>
                        <Callui  targetuser={ authUser._id}/>
                        {/* <CallContent /> */}
                    </StreamCall>
                </StreamVideo>
            ) : (
                <div className="flex items-center justify-center h-full text-white">
                    <p>Could not initialize call. Please refresh or try again later.</p>
                </div>
            )}
        </div>
    );
}

export default CallPage;

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    if (callingState === CallingState.LEFT) return navigate("/");

    return (
        <StreamTheme className="bg-white">
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    );
};

