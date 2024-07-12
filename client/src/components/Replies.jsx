/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';
import '../styles/replies.css';

function Replies({ randomUser }) {

return (
    <div className='profile-right replies-profile-right flex-column'>
        <div className='flex-column replies-container'>
            <div className='premium-header'>
                <h3>Who to follow</h3>
            </div>
            {randomUser && randomUser.slice(0, 3).map(user => (
            <Link key={user.id} to={`/profile/${user.formattedUsername}`}>
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
                                <span className='who-tofollow-namelink'>{user.originalUsername}</span>
                                <span className='who-tofollow-iglink'>@{user.formattedUsername}</span>
                            </div>
                        </div>
                        <div className='who-tofollow-btn'>
                            <button className='radius'>Follow</button>
                        </div>
                    </div>
                </div>
            </Link>
            ))}
        </div>
    </div>
    )
}

export default Replies