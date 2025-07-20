import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { StreamChat } from 'stream-chat';

import toast from 'react-hot-toast';

import CustomChannelHeader from './ChannelHeader';

import Loading from '../loading/Loading';
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import { StreamVideoClient } from '@stream-io/video-react-sdk';
const STREAM_API_KEY = import.meta.env.VITE_STREAM_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoClient, setVideoClient] = useState(null);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initClients = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        const chat = StreamChat.getInstance(STREAM_API_KEY);
        await chat.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenData.token);

        const vidClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token: tokenData.token,
        });

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = chat.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        await currChannel.markRead();
        setChatClient(chat);
        setChannel(currChannel);
        setVideoClient(vidClient);
      } catch (error) {
        console.error("Error initializing chat/video:", error);
        toast.error("Could not connect to chat.");
      } finally {
        setLoading(false);
      }
    };

    initClients();
  }, [tokenData, authUser, targetUserId]);
  useEffect(() => {
    if (!videoClient) return;

    const handleIncomingCall = (call) => {
      toast(`Incoming ${call.type} call from ${call.id}`);
      // Optionally auto-join or prompt user
    };

    videoClient.on('call.invited', handleIncomingCall);

    return () => {
      videoClient.off('call.invited', handleIncomingCall);
    };
  }, [videoClient]);

  if (loading || !chatClient || !channel) {
    return <Loading className='w-full flex items-center justify-center h-full' />;
  }

  return (
    <div className="bg-[#043933] custom-chat-theme h-[89vh] rounded-[5px] relative">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full h-full flex flex-col">
            <Window>
              <CustomChannelHeader videoClient={videoClient} />

              <div className="flex-1 overflow-hidden">
                <MessageList />
              </div>

              <div className=" border-t border-[#0a5249]">
                <MessageInput />
              </div>
            </Window>

            <Thread />
          </div>
        </Channel>
      </Chat>


    </div>
  );
};

export default ChatPage;