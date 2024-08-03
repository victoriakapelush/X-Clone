import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';

const useFollow = (initialUser) => {
    const { loggedinUserData, token, formattedUsername } = useContext(TokenContext);
    const [currentUserData, setCurrentUserData] = useState(loggedinUserData);
    const [otherUserData, setOtherUserData] = useState(initialUser);
    const [isFollowing, setIsFollowing] = useState(false);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    console.log(initialUser)

    const fetchUserData = async () => {
        try {
            const responseFollowers = await axios.get(`http://localhost:3000/api/followers/${formattedUsername}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            setFollowers(responseFollowers.data.followers);
            setFollowing(responseFollowers.data.following);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };    

    useEffect(() => {
        if (formattedUsername && token) {
            fetchUserData();
        }
    }, [formattedUsername, token]);


    useEffect(() => {
        if (loggedinUserData && loggedinUserData.profile && initialUser) {
            const followingIndex = loggedinUserData.profile.totalFollowing.indexOf(initialUser._id);
            setIsFollowing(followingIndex !== -1);
        }
    }, [loggedinUserData, initialUser]);

    const handleFollow = async (otherUserId) => {
        try {
            if (!otherUserId) {
                throw new Error('Other user ID not provided');
            }

            const otherUser = initialUser;
            if (!otherUser || otherUser._id !== otherUserId) {
                throw new Error('Other user not found or ID mismatch');
            }

            const currentUser = loggedinUserData;
            if (!currentUser) {
                throw new Error('Current user not found');
            }

            await axios.put(
                `http://localhost:3000/api/saveFollowing/${formattedUsername}`,
                { _id: otherUserId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const updatedCurrentUser = { ...currentUser };
            const updatedOtherUser = { ...otherUser };

            const followingIndex = updatedCurrentUser.profile.totalFollowing.indexOf(otherUserId);
            if (followingIndex === -1) {
                updatedCurrentUser.profile.totalFollowing.push(otherUserId);
            } else {
                updatedCurrentUser.profile.totalFollowing.splice(followingIndex, 1);
            }
            updatedCurrentUser.profile.following = updatedCurrentUser.profile.totalFollowing.length;

            const followersIndex = updatedOtherUser.profile.totalFollowers.indexOf(currentUser._id);
            if (followersIndex === -1) {
                updatedOtherUser.profile.totalFollowers.push(currentUser._id);
            } else {
                updatedOtherUser.profile.totalFollowers.splice(followersIndex, 1);
            }
            updatedOtherUser.profile.followers = updatedOtherUser.profile.totalFollowers.length;

            setCurrentUserData(updatedCurrentUser);
            setOtherUserData(updatedOtherUser);
            setIsFollowing(followingIndex === -1);
        } catch (error) {
            console.error('Error updating following status:', error);
        }
    };

    return { currentUserData, otherUserData, isFollowing, handleFollow, followers, following };
};

export default useFollow;