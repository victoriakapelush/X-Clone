import { Link } from 'react-router-dom';
import icon from '../assets/icons/butterfly.svg';
import comment from '../assets/icons/comment.png';
import repost from '../assets/icons/repost.png';
import sendpost from '../assets/icons/send-post.png';
import likebefore from '../assets/icons/like-before.png';
import random from '../assets/images/random.jpg'
import iconbookmark from '../assets/icons/icon-bookmark.png'
import save from '../assets/icons/save.png'
// eslint-disable-next-line no-unused-vars
import likeafter from '../assets/icons/like-after.png';

function NewPost() {
    return (
        <div className='post flex-row'>
            <img className='profile-pic' src={icon}></img>
            <div className='flex-column post-box'>
                <Link to='/home' className='link-to-profile'><span className='user-name opacity'>Phil Lewis</span> <span className='username-name'>@phillewis.bsky.social · 4h</span></Link>
                <p className='post-text'>Put a heating pad on one of the cat hammocks and it is like stuffing them in a get along shirt</p>
                <img className='post-image' src={random}></img>
                <div className='flex-row post-icons-container'>
                    <Link to='/home'><img className='post-icon opacity' src={comment} title='Reply'/></Link>
                    <Link to='/home'><img className='post-icon opacity' src={repost} title='Repost'/></Link>
                    <Link to='/home'><img className='post-icon opacity' src={sendpost} title='Share'/></Link>
                    <Link to='/home'><img className='post-icon opacity' src={likebefore} title='Like'/></Link>
                    <div className='save-icons flex-row'>
                        <Link to='/home'><img className='post-icon opacity' src={iconbookmark} title='Bookmark'/></Link>
                        <Link to='/home'><img className='post-icon opacity' src={save} title='Save' /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPost