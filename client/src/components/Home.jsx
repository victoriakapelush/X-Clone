import { Link } from 'react-router-dom';
import user from '../assets/icons/user.png'
import home from '../assets/icons/home.png'
import hashtag from '../assets/icons/hashtag.png'
import notifications from '../assets/icons/notifications.png'

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

        </div>
        <div className='profile-right flex-column'>
            <Link to="/home">Following</Link>
            <Link to="/home">Discover</Link>
            <Link to="/home">More feeds</Link>
            <ul className='flex-row'>
                <li>Feedback</li>
                <li>Privacy</li>
                <li>Terms</li>
                <li>Help</li>
            </ul>
        </div>
      </div>
    )
  }
  
  export default Home