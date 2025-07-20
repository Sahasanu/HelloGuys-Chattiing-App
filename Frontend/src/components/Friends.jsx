import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from "react";
import { getOutgoingRequest, sendfriendrequest, getRecommendeduser, getUserfreinds } from "../lib/api";
import { Link } from "react-router-dom"; // Fixed import
import FriendCard from './FriendCard';
import Loading from '../loading/Loading';
import RecommendCard from './RecommendCard';
import home from '../assets/home.png'

function Friends({ setPendingFriendCount }) {

    const queryClient = useQueryClient();
    const [outgoingRequestIds, setOutgoingRequestIds] = useState([]);

    // Friends query
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ['friends'],
        queryFn: getUserfreinds,
        select: (data) => {
            // Ensure we always get an array
            return Array.isArray(data) ? data : [];
        }
    });
    // Recommended users query
    const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
        queryKey: ['recommendedUsers'],
        queryFn: getRecommendeduser,
    });

    // Outgoing friend requests query
    const { data: outgoingFriendReqs = [] } = useQuery({
        queryKey: ['outgoingFriendReqs'],
        queryFn: getOutgoingRequest,
    });

    // Send friend request mutation
    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendfriendrequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] });
        },
    });

    // Update outgoing request IDs on data fetch
    useEffect(() => {
        if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
            const outgoingIds = outgoingFriendReqs.map(req => req.id);
            setOutgoingRequestIds(outgoingIds);
        }
    }, [outgoingFriendReqs]);

    // Check if a user has an outgoing request
    const hasOutgoingRequest = (userId) => {
        return outgoingRequestIds.includes(userId);
    };
    useEffect(() => {
        if (setPendingFriendCount && Array.isArray(outgoingFriendReqs)) {
            setPendingFriendCount(outgoingFriendReqs.length);
        }
    }, [outgoingFriendReqs, setPendingFriendCount]);



    return (
        <div className='bg-gray-800 h-[83vh] rounded-[5px] relative px-5 mt-[1vh] '>
            <div className="flex userbar w-[100%] py-[5px]">
                <div className="heading w-full py-2  flex items-center justify-between">
                    <p className='text-[25px] font-[500]'>Your Friends</p>
                    <div className='py-1 px-4 border rounded-[30px] text-[13px]'>
                        <Link to="/">Friend Requests</Link>

                    </div>
                </div>
            </div>

            {loadingFriends ? (
                <Loading className='w-full flex items-center' />
            ) : friends.length === 0 ? (
                <p>No friends yet</p>
            ) : (
                <div className="flex flex-col items-center gap-5 ">
                    {friends.map(friend => (
                        <FriendCard key={friend._id} friend={friend} />
                    ))}
                </div>
            )}

            <div className="recommendation mb-6 sm:mb-8  mt-5">

                <div>
                    <h2 className='text-[25px] font-[500] tracking-tight'>Meet New friends</h2>
                </div>

            </div>

            {loadingUsers ? (
                <div className='flex justify-center items-center'>
                    <Loading />
                </div>
            ) : recommendedUsers.length === 0 ? (
                <div className='card p-6 text-center'>
                    <h3 className='font-semibold text-lg mb-2'>No recommendation available</h3>
                    <p>Check back later</p>
                </div>
            ) : (
                <div className='flex flex-col '>
                    {recommendedUsers.map((user) => (
                        <RecommendCard
                            key={user._id}
                            user={user}
                            hasRequest={hasOutgoingRequest(user._id)}
                            onSendRequest={() => sendRequestMutation(user._id)}
                            isPending={isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Friends
