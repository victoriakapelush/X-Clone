import { Link } from 'react-router-dom';
import user from '../assets/icons/user.png'
import home from '../assets/icons/home.png'
import hashtag from '../assets/icons/hashtag.png'
import notifications from '../assets/icons/notifications.png'
import icon from '../assets/icons/butterfly.svg';
import comment from '../assets/icons/comment.png';
import repost from '../assets/icons/repost.png';
import sendpost from '../assets/icons/send-post.png';
import likebefore from '../assets/icons/like-before.png';
import random from '../assets/images/random.jpg'
// eslint-disable-next-line no-unused-vars
import likeafter from '../assets/icons/like-after.png';

function Home() {
    return (
      <div className="flex-row home-container">
        <div className='links-container flex-column'>
            <img src={user} className='main-user-icon'/>
            <Link to="/home" className='links-home-page flex-column'>
                <div className='flex-row nav-links-container'>
                    <img className='nav-img' src={home}/>
                    <p className='nav-links'>Home</p>
                </div>
            </Link>
            <Link to="/home" className='links-home-page flex-column'>
                <div className='flex-row nav-links-container'>
                    <img className='nav-img' src={hashtag}/>
                    <p className='nav-links'>Feeds</p>
                </div>
            </Link>
            <Link to="/home">
                <div className='flex-row nav-links-container'>
                    <img className='nav-img' src={notifications}/>
                    <p className='nav-links'>Notifications</p>
                </div>
            </Link>
            <Link to="/home">
                <div className='flex-row nav-links-container'>
                    <img className='nav-img' src={user}/>
                    <p className='nav-links'>Profile</p>
                </div>
            </Link>
            <a href='/home' className='new-post-btn'>New Post</a>
        </div>
        <div className='profile-center'>
            <header className='mini-header flex-row'>
                <img src={icon}></img>
            </header>
            <div className='flex-row mini-header-btns-container'>
                <Link to="/home" className='mini-header-btn'>Following</Link>
                <Link to="/home" className='mini-header-btn'>Discover</Link>
            </div>
            <div className='post flex-row'>
                <img className='profile-pic' src={icon}></img>
                <div className='flex-column post-box'>
                    <Link to='/home' className='link-to-profile'>Phil Lewis @phillewis.bsky.social·4h</Link>
                    <p className='post-text'>Put a heating pad on one of the cat hammocks and it is like stuffing them in a get along shirt</p>
                    <img className='post-image' src={random}></img>
                    <div className='flex-row post-icons-container'>
                        <Link to='/home'><img className='post-icon' src={comment} /></Link>
                        <Link to='/home'><img className='post-icon' src={repost} /></Link>
                        <Link to='/home'><img className='post-icon' src={sendpost} /></Link>
                        <Link to='/home'><img className='post-icon' src={likebefore} /></Link>
                    </div>
                </div>
            </div>
        </div>
        <div className='profile-right flex-column'>
            <div className='flex-column more-feed-links'>
                <Link to="/home" className='feed-link'>Following</Link>
                <Link to="/home" className='feed-link'>Discover</Link>
                <Link to="/home" className='feed-link'>More feeds</Link>   
            </div>
            <ul className='flex-row terms-list'>
                <li className='no-bullets'><a href='/home'>Feedback</a></li>
                <li><a href='/home'>Privacy</a></li>
                <li><a href='/home'>Terms</a></li>
                <li><a href='/home'>Help</a></li>
            </ul>
        </div>
      </div>
    )
  }
  
  export default Home