import '../styles/profile.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeNav from './HomeNav'
import HomeExtra from './HomeExtra'
import back from '../assets/icons/back.png'
import TokenContext from './TokenContext';
import UserContext from './UserContext';
import SingleUserBriefProfile from './SingleUserBriefProfile';

function Followers() {
    const { formattedUsername, token } = useContext(TokenContext);
    const [userData, setUserData] = useState({});
    const { randomUser } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('followers');
    const [followers, setFollowers] = useState([]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };


    const fetchUserData = async () => {
        try {
            if (token) {
                const response = await axios.get(`http://localhost:3000/profile/${formattedUsername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setUserData({ ...response.data.userProfile });
                setFollowers(response.data.userProfile.profile.totalFollowers);   
                console.log(userData)         
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData(); 
    }, [formattedUsername]); 

    return (
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='profile-container'>
                <header className='flex-row'>
                    <Link to='/home' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='flex-column profile-header-name'>
                        {userData && userData.profile && <h2>{userData.profile.updatedName}</h2>}                        
                        {userData && userData.profile && <span>@{userData.formattedUsername}</span>}
                    </div>
                </header>
                <div className='flex-row mini-header-btns-container'>
                    <div className={`mini-header-btn ${activeTab === 'foryou' ? 'active' : ''}`}>
                        <div className='blue-underline flex-column'>
                        <Link 
                            to="/home" 
                            className={`for-you-tab ${activeTab === 'foryou' ? 'active' : ''}`} 
                            onClick={() => handleTabChange('foryou')}
                        >
                            Followers
                        </Link>
                        </div>
                    </div>
                    <div className={`mini-header-btn ${activeTab === 'following' ? 'active' : ''}`}>
                        <div className='blue-underline flex-column'>
                        <Link 
                            to="/home" 
                            className={`for-you-tab ${activeTab === 'following' ? 'active' : ''}`} 
                            onClick={() => handleTabChange('following')}
                        >
                            Following
                        </Link>
                        </div>
                    </div>
                </div>          
                <div>
               
                </div>
            </div>
            <HomeExtra randomUser={randomUser} />
        </div>
    )
}

export default Followers;