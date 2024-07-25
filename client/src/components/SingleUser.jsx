/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const SingleUser = ({ user }) => {
    return (
        <Link key={user.id} to={`/profile/${user.formattedUsername}`}>
        <div className='who-tofollow-container flex-column'>
            <div className='who-tofollow-profile-box flex-row'>
                <div className='who-to-follow-single-user flex-row'>
                    <div className='who-tofollow-image-box'>
                        {user.profile.profilePicture ? (
                                <img src={`http://localhost:3000/uploads/${user.profile.profilePicture}`} alt={`${user.originalUsername}'s profile`} />
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

    );
};

export default SingleUser;