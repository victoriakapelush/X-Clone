import '../styles/profile.css';
import '../styles/followers.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';
import HomeNav from './HomeNav'
import HomeExtra from './HomeExtra'
import back from '../assets/icons/back.png'
import TokenContext from './TokenContext';
import UserContext from './UserContext';
import FollowersData from './FollowersData';
import FollowingData from './FollowingData';

function Followers() {
    const { formattedUsername, token } = useContext(TokenContext);
    const [userData, setUserData] = useState({});
    const { randomUser } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('followers');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const location = useLocation();
    const { username } = useParams();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };

      const fetchUserData = async () => {
        try {
            const [userResponse, followersResponse] = await Promise.all([
                axios.get(`http://localhost:3000/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }),
                axios.get(`http://localhost:3000/api/followers/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }),
            ]);
            setUserData(userResponse.data.userProfile);
            setFollowers(followersResponse.data.followers);
            setFollowing(followersResponse.data.following);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (formattedUsername && token) {
            fetchUserData();
        }
    }, [formattedUsername, token]);

    const removeFollowing = (userId) => {
        setFollowing(following.filter(following => following._id !== userId));
    };

    return (
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='profile-container'>
                <header className='flex-row'>
                    <Link to='/profile' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='flex-column profile-header-name'>
                        {userData && userData.profile && <h2>{userData.profile.updatedName}</h2>}                        
                        {userData && userData.profile && <span>@{userData.formattedUsername}</span>}
                    </div>
                </header>
                <div className='flex-row mini-header-btns-container'>
                    <div className={`mini-header-btn ${activeTab === 'followers' ? 'active' : ''}`}>
                        <div className='blue-underline flex-column'>
                        <Link 
                            to={`/${username}/followers?tab=followers`}
                            className={`for-you-tab ${activeTab === 'followers' ? 'active' : ''}`} 
                            onClick={() => handleTabChange('followers')}
                        >
                            Followers
                        </Link>
                        </div>
                    </div>
                    <div className={`mini-header-btn ${activeTab === 'following' ? 'active' : ''}`}>
                        <div className='blue-underline flex-column'>
                        <Link 
                            to={`/${username}/followers?tab=following`}
                            className={`for-you-tab ${activeTab === 'following' ? 'active' : ''}`} 
                            onClick={() => handleTabChange('following')}
                        >
                            Following
                        </Link>
                        </div>
                    </div>
                </div>          
                <div>
                {activeTab === 'followers' && (
                        <div className='home-profile-posts followers-container'>
                            {followers.length === 0 ? (
                                <div className='no-followers-message flex-column'>
                                    <h2>Looking for followers?</h2>
                                    <p>When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.</p>
                                </div>
                            ) : (
                                followers.map(follower => (
                                    <FollowersData key={follower._id} follower={follower} userData={userData} />
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'following' && (
                        <div className='home-profile-posts followers-container'>
                            {following.length === 0 ? (
                                <div className='no-followers-message flex-column'>
                                    <h2>Be in the know.</h2>
                                    <p>Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.</p>
                                </div>
                            ) : (
                                following.map(following => (
                                    <FollowingData key={following._id} following={following} userData={userData} removeFollowing={removeFollowing} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
            <HomeExtra randomUser={randomUser} />
        </div>
    )
}

export default Followers;