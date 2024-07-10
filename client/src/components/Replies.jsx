/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';

function Replies() {

    return (
        <div className='profile-right flex-column'>
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
        </div>
    </div>
    )
}

export default Replies