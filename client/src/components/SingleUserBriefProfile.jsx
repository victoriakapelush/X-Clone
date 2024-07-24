/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/connectPeople.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import TokenContext from './TokenContext';
import axios from 'axios';

function SingleUserBriefProfile({ singleUserData }) {
    const { loggedinUserData, token, formattedUsername } = useContext(TokenContext);
    const [currentUserData, setCurrentUserData] = useState(loggedinUserData);
    const [otherUserData, setOtherUserData] = useState(singleUserData);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        // Check if loggedinUserData and its profile are defined
        if (loggedinUserData && loggedinUserData.profile && singleUserData) {
            // Check if the current user is following the single user
            const followingIndex = loggedinUserData.profile.totalFollowing.indexOf(singleUserData._id);
            setIsFollowing(followingIndex !== -1);
        }
    }, [loggedinUserData, singleUserData]);

    const handleFollow = async (otherUserId) => {
        try {
            if (!otherUserId) {
                throw new Error('Other user ID not provided');
            }
    
            // Access the other user in the singleUserData object
            const otherUser = singleUserData;
            console.log(otherUser)
            if (!otherUser || otherUser._id !== otherUserId) {
                throw new Error('Other user not found or ID mismatch');
            }
    
            // Access the current user data
            const currentUser = loggedinUserData;
            console.log(currentUser)
            if (!currentUser) {
                throw new Error('Current user not found');
            }
    
            // Send the update request to the server
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
    
            // Update local state after successful server update
            const updatedCurrentUser = { ...currentUser };
            const updatedOtherUser = { ...otherUser };
    
            // Update currentUser's following array and count
            const followingIndex = updatedCurrentUser.profile.totalFollowing.indexOf(otherUserId);
            if (followingIndex === -1) {
                updatedCurrentUser.profile.totalFollowing.push(otherUserId);
            } else {
                updatedCurrentUser.profile.totalFollowing.splice(followingIndex, 1);
            }
            updatedCurrentUser.profile.following = updatedCurrentUser.profile.totalFollowing.length;
    
            // Update otherUser's followers array and count
            const followersIndex = updatedOtherUser.profile.totalFollowers.indexOf(currentUser._id);
            if (followersIndex === -1) {
                updatedOtherUser.profile.totalFollowers.push(currentUser._id);
            } else {
                updatedOtherUser.profile.totalFollowers.splice(followersIndex, 1);
            }
            updatedOtherUser.profile.followers = updatedOtherUser.profile.totalFollowers.length;
    
            // Update state
            setCurrentUserData(updatedCurrentUser);
            setOtherUserData(updatedOtherUser);

            // Update isFollowing state
            setIsFollowing(followingIndex === -1);

            console.log(updatedCurrentUser);
            console.log(updatedOtherUser)
    
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