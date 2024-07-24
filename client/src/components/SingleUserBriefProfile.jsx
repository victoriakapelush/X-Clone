/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/connectPeople.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import TokenContext from './TokenContext';
import axios from 'axios';

function SingleUserBriefProfile({ singleUserData }) {
    const { loggedinUserData, token, loggedinUserId } = useContext(TokenContext);
    const [currentUserId, setCurrentUserId] = useState(loggedinUserId);
    const [currentUserData, setCurrentUserData] = useState(loggedinUserData);
    const [otherUserData, setOtherUserData] = useState(singleUserData);
    const [isFollowing, setIsFollowing] = useState(loggedinUserData?.profile?.totalFollowing.includes(singleUserData._id));

    const handleFollow = async (otherUserId) => {
        try {
            // Ensure otherUserId is provided
            if (!otherUserId) {
                throw new Error('Other user ID not provided');
            }
    
            // Access the other user in the singleUserData object
            const otherUser = singleUserData;
            if (!otherUser || otherUser._id !== otherUserId) {
                throw new Error('Other user not found or ID mismatch');
            }
    
            // Access the current user data
            const currentUser = loggedinUserData;
            if (!currentUser) {
                throw new Error('Current user not found');
            }
    
            // Check if the current user is already following the other user
            const ifFollowed = currentUser.profile.totalFollowing.indexOf(otherUserId);
    
            let updatedFollowingArray = [...currentUser.profile.totalFollowing];
            let updatedFollowersArray = [...otherUser.profile.totalFollowers];
            let updatedFollowingCount;
            let updatedFollowersCount;
    
            if (ifFollowed === -1) {
                // Current user is not following the other user yet
                updatedFollowersArray.push(currentUserId);
                updatedFollowersCount = otherUser.profile.followers + 1;
    
                updatedFollowingArray.push(otherUserId);
                updatedFollowingCount = currentUser.profile.following + 1;
            } else {
                // Current user is already following the other user
                const followerIndex = otherUser.profile.totalFollowers.indexOf(currentUserId);
                if (followerIndex > -1) {
                    otherUser.profile.totalFollowers.splice(followerIndex, 1);
                }
                updatedFollowersCount = Math.max(otherUser.profile.followers - 1, 0); // Ensure followers count does not go below 0
    
                const followingIndex = currentUser.profile.totalFollowing.indexOf(otherUserId);
                if (followingIndex > -1) {
                    updatedFollowingArray.splice(followingIndex, 1);
                }
                updatedFollowingCount = Math.max(currentUser.profile.following - 1, 0); // Ensure following count does not go below 0
            }
    
            // Send the update request to the server
            await axios.put('http://localhost:3000/api/saveFollowing', 
            { 
                _id: otherUserId
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });
    
            // Update local state after successful server update
            setCurrentUserData({
                ...currentUser,
                profile: {
                    ...currentUser.profile,
                    totalFollowing: updatedFollowingArray,
                    following: updatedFollowingCount
                }
            });
    
            setOtherUserData({
                ...otherUser,
                profile: {
                    ...otherUser.profile,
                    totalFollowers: updatedFollowersArray,
                    followers: updatedFollowersCount
                }
            });
    
        } catch (error) {
            console.error('Error updating following status:', error);
        }
    };
    

    return (
        <div className='brief-profile-container flex-column'>
            <div className='brief-profile-box flex-row'>
                <div className='brief-profile-single-user flex-row'>
                    <div className='who-tofollow-image-box'>
                        <img src={`http://localhost:3000/uploads/${singleUserData.profile.profilePicture}`} />
                    </div>                            
                    <div className='flex-column brief-profile-name-box'>
                        <Link to={`/profile/${singleUserData.formattedUsername}`} className='who-tofollow-namelink'>{singleUserData.originalUsername}</Link>
                        <span className='who-tofollow-iglink'>@{singleUserData.formattedUsername}</span>
                    </div>
                </div>
                <div className='who-tofollow-btn'>
                    <button className={`radius ${isFollowing ? 'unfollow-button' : ''}`} onClick={() => handleFollow(singleUserData._id)}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            </div>
            <span className='brief-profile-bio'>{singleUserData.profile.profileBio}</span>
        </div>
    )
}

export default SingleUserBriefProfile;