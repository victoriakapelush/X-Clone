/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import '../styles/postreplacement.css';
import '../styles/connectPeople.css';
import { Link } from 'react-router-dom';
import useFollow from './FollowUnfollowHook';

function FollowingData({ userData, following, removeFollowing }) {
    const { isFollowing, handleFollow } = useFollow(following);

    const handleFollowClick = async (followerId) => {
        await handleFollow(followerId);
        removeFollowing(followerId);
    };

    useEffect(() => {
        document.title = `People following ${userData.originalUsername} (@${userData.formattedUsername}) / X`;
    }, [userData]);

    return (
        <div className='brief-profile-container flex-column'>
            <div className='brief-profile-box flex-row'>
                <div className='brief-profile-single-user flex-row'>
                    <div className='who-tofollow-image-box'>
                        <img src={`http://localhost:3000/uploads/${following.profile.profilePicture}`} />
                    </div>                            
                    <div className='flex-column brief-profile-name-box'>
                        <Link to={`/profile/${following.formattedUsername}`} className='who-tofollow-namelink'>{following.originalUsername}</Link>
                        <span className='who-tofollow-iglink'>@{following.formattedUsername}</span>
                    </div>
                </div>
                <div className='who-tofollow-btn'>
                    <button className={`radius ${isFollowing ? 'unfollow-button' : ''}`} onClick={() => handleFollowClick(following._id)}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            </div>
            <span className='brief-profile-bio'>{following.profile.profileBio}</span>
        </div>
    );
}

export default FollowingData;