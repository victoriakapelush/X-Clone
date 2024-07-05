import { Link } from 'react-router-dom';
import { useState } from 'react';
import user from '../assets/icons/user.png'
import home from '../assets/icons/home.png'
import explore from '../assets/icons/explore.png'
import messages from '../assets/icons/messages.png'
import hashtag from '../assets/icons/hashtag.png'
import notifications from '../assets/icons/notifications.png'
import bookmark from '../assets/icons/bookmark.png'
import grok from '../assets/icons/grok.png'
import lists from '../assets/icons/lists.png'
import communities from '../assets/icons/communities.png'
import premium from '../assets/icons/premium.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ToPost from './ToPost'

function HomeNav() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();
    const [formattedUsername, setFormattedUsername] = useState('');

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleLogout = async (e) => {
      e.preventDefault();
      try {
        const getToken = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/home/${formattedUsername}`);
        const { token } = response.data;
        localStorage.removeItem('token', token);
        navigate('/');
        if (getToken) {
            const decoded = jwtDecode(token);
            const decodedUsername = decoded.originalUsername.toLowerCase().replace(/\s+/g, '');
            setFormattedUsername(decodedUsername); 
        }
    } catch (error) {
        console.error('Logout error:', error);
        console.error('Error decoding token:', error);
      }
    };

    return (
        <>
        {isPopupOpen && <ToPost onClose={handleClosePopup}/>}
            <div className='links-container flex-column'>
                <Link className='flex-row header-and-mini-header' to='/home'>
                    <svg id='mini-header' className='radius' viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                        <path d="M86.8918 28.25H99.0219L72.5243 58.5334L103.698 99.75H79.285L60.1647 74.7536L38.2929 99.75H26.1627L54.5069 67.3565L24.5938 28.25H49.6199L66.9004 51.0974L86.8918 28.25ZM82.6337 92.4904H89.3555L45.9716 35.1301H38.7584L82.6337 92.4904Z" fill="white"/>
                    </svg>
                </Link>
                <Link to="/home" className='links-home-page flex-column'>
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={home}/>
                        <p className='nav-links'>Home</p>
                    </div>
                </Link>
                <Link to="/explore" className='links-home-page flex-column'>
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={explore}/>
                        <p className='nav-links'>Explore</p>
                    </div>
                </Link>
                <Link to="/feeds" className='links-home-page flex-column'>
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={hashtag}/>
                        <p className='nav-links'>Feeds</p>
                    </div>
                </Link>
                <Link to="/notifications">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={notifications}/>
                        <p className='nav-links'>Notifications</p>
                    </div>
                </Link>
                <Link to="/messages">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={messages}/>
                        <p className='nav-links'>Messages</p>
                    </div>
                </Link>
                <Link to="/grok">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={grok}/>
                        <p className='nav-links'>Grok</p>
                    </div>
                </Link>
                <Link to="/lists">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={lists}/>
                        <p className='nav-links'>Lists</p>
                    </div>
                </Link>
                <Link to="/bookmarks">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={bookmark}/>
                        <p className='nav-links'>Bookmarks</p>
                    </div>
                </Link>
                <Link to="/communities">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={communities}/>
                        <p className='nav-links'>Communities</p>
                    </div>
                </Link>
                <Link to="/premium">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={premium}/>
                        <p className='nav-links'>Premium</p>
                    </div>
                </Link>
                <Link to="/profile">
                    <div className='flex-row nav-links-container radius'>
                        <img className='nav-img' src={user}/>
                        <p className='nav-links'>Profile</p>
                    </div>
                </Link>
                <button onClick={handleOpenPopup} className='new-post-btn radius'>Post</button>
                <button className='logout-btn radius' onClick={handleLogout}>Log out</button>
            </div>
        </>
    )
}

export default HomeNav