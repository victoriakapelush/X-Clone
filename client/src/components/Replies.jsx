/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';
import '../styles/replies.css';
import '../styles/profile.css';
import useFollow from './FollowUnfollowHook';

function Replies({ randomUser }) {
    return (
        <div className='profile-right replies-profile-right flex-column'>
            <div className='flex-column replies-container new-post-random-users'>
                <div className='premium-header replies-header-who-tofollow'>
                    <h3>Who to follow</h3>
                </div>
                {randomUser && randomUser.slice(0, 3).map(user => {
                    const { isFollowing, handleFollow } = useFollow(user);

                    return (
                        <div key={user._id}>
                            <div className='who-tofollow-container replies-who-to-follow-container flex-column'>
                                <div className='who-tofollow-profile-box flex-row' id='replies-who-to-follow'>
                                    <div className='who-to-follow-single-user flex-row'>
                                        <div className='who-tofollow-image-box'>
                                            {user.profile.profilePicture ? (
                                                <img src={user.profile.profilePicture} alt={`${user.originalUsername}'s profile`} />
                                            ) : (
                                                <div className='no-profile-picture'></div>
                                            )}
                                        </div>  
                                        <div className='flex-column who-tofollow-name-box'>
                                            <Link to={`/profile/${user.formattedUsername}`} className='who-tofollow-namelink'>{user.originalUsername}</Link>
                                            <span className='who-tofollow-iglink'>@{user.formattedUsername}</span>
                                        </div>
                                    </div>
                                    <div className='who-tofollow-btn'>
                                        <button
                                            className={`radius ${isFollowing ? 'unfollow-button' : ''}`}
                                            onClick={() => handleFollow(user._id)}
                                        >
                                            {isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Replies;