/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';

function HomeExtra({ randomUser }) {

    return (
        <div className='profile-right flex-column profile-right-no-display'>
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>Subscribe to Premium</h3>
            </div>
            <div className='premium-paragraph'>
                <p>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
            </div>
            <button className='new-post-btn radius smaller-size'>Subscribe</button>
        </div>
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>What's happening</h3>
            </div>
            <div className='whatshappenning-container flex-column'>
                <Link to='/explore'>
                    <div className='trending-hashtag-container flex-column'>
                        <span className='trending-name'>Sports · Trending</span>
                        <span className='trending-hashtag'>#GoYankees</span>
                        <span className='trending-number-posts'>9,000 posts</span>
                    </div>
                </Link>
                <Link to='/explore'>
                    <div className='trending-hashtag-container flex-column'>
                        <span className='trending-name'>Trending in United States</span>
                        <span className='trending-hashtag'>#GoYankees</span>
                        <span className='trending-number-posts'>9,000 posts</span>
                    </div>
                </Link>
                <Link to='/explore'>
                    <div className='trending-hashtag-container flex-column'>
                        <span className='trending-name'>Sports · Trending</span>
                        <span className='trending-hashtag'>#GoYankees</span>
                        <span className='trending-number-posts'>9,000 posts</span>
                    </div>
                </Link>
            </div>
        </div>
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>Who to follow</h3>
            </div>
            {randomUser && randomUser.slice(0, 3).map(user => (
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
            ))}
        </div>
    </div>
    )
}

export default HomeExtra