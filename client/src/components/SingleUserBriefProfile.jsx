/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/connectPeople.css';
import { Link } from 'react-router-dom';
import useFollow from './FollowUnfollowHook';

function SingleUserBriefProfile({ singleUserData }) {
    const { currentUserData, otherUserData, isFollowing, handleFollow } = useFollow(singleUserData);

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
