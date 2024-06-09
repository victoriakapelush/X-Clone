import '../styles/profile.css'
import { Link } from 'react-router-dom';
import HomeNav from './HomeNav'
import HomeExtra from './HomeExtra'
import back from '../assets/icons/back.png'
import backgroundImage from '../assets/images/random.jpg'

function Profile() {
    return (
        <div className='flex-row'>
            <HomeNav />
            <div className='profile-container'>
                <header className='flex-row'>
                    <Link to='/home' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='flex-column profile-header-name'>
                        <h2>Victoria Kapelush</h2>
                        <span>0 posts</span>
                    </div>
                </header>
                <div className='background-image-holder'>
                    <img src={backgroundImage}/>
                </div>
                <div className='profile-photo-container flex-row'>
                    <img src={backgroundImage}/>
                    <div className='flex-row subscribe-panel'>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3zm-.86 13h-4.241c-.464 2.281-2.482 4-4.899 4s-4.435-1.719-4.899-4H2.87L4 9.05C4.51 5.02 7.93 2 12 2v2C8.94 4 6.36 6.27 5.98 9.3L5.13 16h13.73l-.38-3h2.02l.64 5zm-6.323 0H9.183c.412 1.164 1.51 2 2.817 2s2.405-.836 2.817-2z"></path></g></svg>                    
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14 6c0 2.21-1.791 4-4 4S6 8.21 6 6s1.791-4 4-4 4 1.79 4 4zm-4 5c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11zm12.223-5.89l-2.969 4.46L17.3 8.1l-1.2 1.6 3.646 2.73 4.141-6.21-1.664-1.11z"></path></g></svg>
                        <button className='subscribe-btn radius'>Subscribe</button>
                    </div>
                </div>
            </div>
            <HomeExtra />
        </div>

    )
}

export default Profile