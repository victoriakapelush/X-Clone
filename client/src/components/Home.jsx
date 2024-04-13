import { Link } from 'react-router-dom';
import NewPost from './NewPost'
import user from '../assets/icons/user.png'
import home from '../assets/icons/home.png'
import messages from '../assets/icons/messages.png'
import hashtag from '../assets/icons/hashtag.png'
import notifications from '../assets/icons/notifications.png'
import bookmark from '../assets/icons/bookmark.png'
import icon from '../assets/icons/butterfly.svg';

function Home() {
    return (
      <div className="flex-row home-container">
        <div className='links-container flex-column'>
            <a className='flex-row header-and-mini-header' href='/home'>
                <h1>BeSocial</h1>
                <img src={icon} className='mini-header flex-row'></img>
            </a>
            <Link to="/home" className='links-home-page flex-column opacity'>
                <div className='flex-row nav-links-container'>
                    <img className='nav-img' src={home}/>
                    <p className='nav-links'>Home</p>
                </div>
            </Link>
            <Link to="/home" className='links-home-page flex-column opacity'>
                <div className='flex-row nav-links-container'>
                    <img className='nav-img' src={hashtag}/>
                    <p className='nav-links'>Feeds</p>
                </div>
            </Link>
            <Link to="/home">
                <div className='flex-row nav-links-container opacity'>
                    <img className='nav-img' src={notifications}/>
                    <p className='nav-links'>Notifications</p>
                </div>
            </Link>
            <Link to="/home">
                <div className='flex-row nav-links-container opacity'>
                    <img className='nav-img' src={bookmark}/>
                    <p className='nav-links'>Bookmarks</p>
                </div>
            </Link>
            <Link to="/home">
                <div className='flex-row nav-links-container opacity'>
                    <img className='nav-img' src={messages}/>
                    <p className='nav-links'>Messages</p>
                </div>
            </Link>
            <Link to="/home">
                <div className='flex-row nav-links-container opacity'>
                    <img className='nav-img' src={user}/>
                    <p className='nav-links'>Profile</p>
                </div>
            </Link>
            <a href='/home' className='new-post-btn'>New Post</a>
        </div>
        <div className='profile-center'>
            <div className='flex-row mini-header-btns-container'>
                <Link to="/home" className='mini-header-btn'>Following</Link>
                <Link to="/home" className='mini-header-btn'>Discover</Link>
            </div>
        <NewPost />
        <NewPost />
        <NewPost />
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