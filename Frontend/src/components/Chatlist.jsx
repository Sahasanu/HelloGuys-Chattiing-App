import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { useQuery } from '@tanstack/react-query';
import userPlaceholder from '../assets/user.svg';
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken } from '../lib/api';
import Loading from '../loading/Loading';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_KEY;

const ChatList = ({ setUnreadMessageCount }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const [chatClient, setChatClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const fetchChannels = async (client) => {
    const filters = { type: 'messaging', members: { $in: [authUser._id] } };
    const sort = { last_message_at: -1 };
    const queriedChannels = await client.queryChannels(filters, sort, {
      watch: true,
      state: true,
    });
    setChannels(queriedChannels);
  };

  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData?.token) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        await fetchChannels(client);
        setChatClient(client);

        const handleEvent = async (event) => {
          if (
            event.type === 'message.new' ||
            event.type === 'notification.added_to_channel' ||
            event.type === 'channel.updated' ||
            event.type === 'channel.deleted'
          ) {
            await fetchChannels(client);
          }
        };

        client.on(handleEvent);

        return () => {
          client.off(handleEvent);
        };
      } catch (err) {
        console.error('Stream Chat init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [authUser, tokenData]);

  // ✅ Update unread count on channel changes
  useEffect(() => {
    if (setUnreadMessageCount && channels.length > 0) {
      const totalUnread = channels.reduce((sum, ch) => sum + ch.countUnread(), 0);
      setUnreadMessageCount(totalUnread);
    }
  }, [channels, setUnreadMessageCount]);

  if (loading) return <div className="text-white p-4"><Loading /></div>;

  return (
    <div className="chats space-y-[20px] h-[83vh] pt-[2vh] mt-[1vh] bg-gray-800 rounded-[5px] px-[10px] overflow-y-auto">
      {channels.map((channel) => {
        const messages = channel.state.messages;
        const lastMessage = messages[messages.length - 1];
        const unreadCount = channel.countUnread();

        const membersArray = Object.values(channel?.state?.members || {});
        const otherMember = membersArray.find(
          (m) => m?.user?.id && m.user.id !== authUser._id
        );

        const userName = otherMember?.user?.name || 'Unknown User';
        const userImage = otherMember?.user?.image || userPlaceholder;

        return (
          <div
            key={channel.id}
            className="chatcard flex gap-[5px] w-[100%] cursor-pointer hover:bg-gray-700 p-[10px] hover:rounded-[5px] mb-2"
            onClick={() => navigate(`/chat/${otherMember?.user?.id || ''}`)}
          >
            <div className="w-[15%] flex items-center">
              <img
                src={userImage}
                alt=""
                className="w-[90%] rounded-full object-cover"
              />
            </div>
            <div className="message-name w-[70%] pl-[20px] overflow-hidden">
              <p className="text-[20px] text-white truncate">{userName}</p>
              <p className="text-gray-300 truncate">
                {lastMessage?.text || 'No messages yet'}
              </p>
            </div>
            <div className="notofication-count w-[15%] text-right">
              {lastMessage?.created_at && (
                <p className="time text-[10px] text-gray-400">
                  {new Date(lastMessage.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              {unreadCount > 0 && (
                <p className="border w-[20px] h-[20px] rounded-full flex items-center justify-center bg-green-400 text-black text-[12px] font-[600] mt-[5px] ml-auto">
                  {unreadCount}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
