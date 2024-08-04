/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import '../styles/profile.css'
import '../styles/highlights.css'
import { Link } from 'react-router-dom';
import back from '../assets/icons/back.png'
import HomeNav from './HomeNav'
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import NewPost from './NewPost'
import Replies from './Replies'
import Highlights from './Highlights'
import Media from './Media'
import Likes from './Likes'
import { useState, useEffect, useContext } from 'react';
import TokenContext from './TokenContext';
import OtherUserPostsHook from './OtherUserPostsHook';
import OtherUserMedia from './OtherUserMedia';
import OtherUsersLikedPosts from './OtherUsersLikedPosts';

function OtherUsersProfiles() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState('posts');
    const { postData, bookmarkedStates, handleBookmark, likedStates, handleLike, getPost, userData, randomUser } = OtherUserPostsHook();
    const { token, formattedUsername } = useContext(TokenContext);
    const [currentUser, setCurentUser] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };

      useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (token) {    
                    const decoded = jwtDecode(token);
                    const response = await axios.get(`http://localhost:3000/api/profile/${username}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setCurentUser(response.data);
                    document.title = `${response.data.user.originalUsername} (@${response.data.user.formattedUsername}) / X`;
                    setFollowers(response.data.profile.totalFollowers);

                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [username, token]);

    return(
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='profile-container'>
                <header className='flex-row'>
                    <Link to='/home' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='flex-column profile-header-name'>
                        {userData && <h2>{userData.originalUsername}</h2>}
                        {userData && userData.profile && <span>{userData.profile.posts} posts</span>}
                    </div>
                </header>
                <div className='background-image-holder'>
                    {userData && userData.profile ? (
                        <img src={`http://localhost:3000/uploads/${userData.profile.backgroundHeaderImage}`} />
                    ) : (
                        <div className='defaul-profile-image-background'></div>
                    )}
                </div>
                <div className='profile-photo-container flex-row'>
                    {userData && userData.profile ? (
                        <img src={`http://localhost:3000/uploads/${userData.profile.profilePicture}`} />
                        ) : (
                        <div className='defaul-profile-image-profile'></div>
                        )}
                    <div className='flex-row subscribe-panel'>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"></path></g></svg>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3zm-.86 13h-4.241c-.464 2.281-2.482 4-4.899 4s-4.435-1.719-4.899-4H2.87L4 9.05C4.51 5.02 7.93 2 12 2v2C8.94 4 6.36 6.27 5.98 9.3L5.13 16h13.73l-.38-3h2.02l.64 5zm-6.323 0H9.183c.412 1.164 1.51 2 2.817 2s2.405-.836 2.817-2z"></path></g></svg>                    
                        <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M14 6c0 2.21-1.791 4-4 4S6 8.21 6 6s1.791-4 4-4 4 1.79 4 4zm-4 5c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11zm12.223-5.89l-2.969 4.46L17.3 8.1l-1.2 1.6 3.646 2.73 4.141-6.21-1.664-1.11z"></path></g></svg>
                        <button className='subscribe-btn radius'>Subscribe</button>
                    </div>
                </div>
                <div className='flex-column personal-info-section'>
                    {userData && (
                        <span className='profile-user-name'>
                            {userData.updatedName ? userData.updatedName : userData.originalUsername}
                        </span>
                        )}
                        {userData.formattedUsername && <span className='user-tag'>@{userData.formattedUsername}</span>}
                        {userData && userData.profileBio && (
                            <p className='user-profile-description'>{userData.profileBio}</p>
                        )}
                        <div className='flex-row location-date-container'>
                        {userData && userData.location && (
                            <>
                                <div className='flex-row location-container'>
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <g><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path></g>
                                    </svg>
                                    <span>{userData.location}</span>
                                </div>
                                </>
                            )}
                        {userData && userData.website && (
                        <>
                            <div className='flex-row location-container'>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" ><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg>
                                    <span>
                                        <a href='' target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline"}}>
                                            {userData.website}
                                        </a>
                                    </span>
                            </div>
                        </>)}
                            <div className='flex-row location-container'>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g></svg>                            
                                {userData.profile ? (<span>{userData.profile.registrationDate}</span>) : <span>No registration date available</span>}                            
                            </div>
                        </div>
                        <div className='flex-row following-container'>
                            {userData.profile && (
                                <Link to='/followers?tab=following' className='following-number'>
                                    {userData.profile.following ? userData.profile.following : '0'}{' '}
                                    <span className='following-grey'>Following</span>
                                </Link>
                            )}
                            {userData && userData.profile && (
                                <Link to='/followers?tab=followers' className='following-number'>
                                    {userData.profile.followers ? userData.profile.followers : '0'}{' '} 
                                    <span className='following-grey'>Followers</span>
                                </Link>
                            )}
                        </div>
                        <span className='followed-not'>Not followed by anyone you're following</span>
                    </div>
                <nav className='profile-nav flex-row'>
                    <div className='blue-underline'>
                        <Link className={`profile-nav-link for-you-tab ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => handleTabChange('posts')} >Posts</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className={`profile-nav-link for-you-tab ${activeTab === 'replies' ? 'active' : ''}`}
                            onClick={() => handleTabChange('replies')} >Replies</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className={`profile-nav-link for-you-tab ${activeTab === 'highlights' ? 'active' : ''}`}
                            onClick={() => handleTabChange('highlights')} >Highlights</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className={`profile-nav-link for-you-tab ${activeTab === 'media' ? 'active' : ''}`}
                            onClick={() => handleTabChange('media')} >Media</Link>
                    </div>
                    <div className='blue-underline'>
                        <Link className={`profile-nav-link for-you-tab ${activeTab === 'likes' ? 'active' : ''}`}
                            onClick={() => handleTabChange('likes')} >Likes</Link>
                    </div>
                </nav>
                <div className={`profile-post ${activeTab === 'media' ? 'extra-media-class' : ''}`}>                    
                    {activeTab === 'posts' && <NewPost randomUser={randomUser} postData={postData} bookmarkedStates={bookmarkedStates} handleBookmark={handleBookmark} likedStates={likedStates} handleLike={handleLike} getPost={getPost} userData={userData} />}
                    {activeTab === 'replies' && <Replies randomUser={randomUser}/>}
                    {activeTab === 'highlights' && <Highlights />}
                    {activeTab === 'media' && <OtherUserMedia />}
                    {activeTab === 'likes' && <OtherUsersLikedPosts />}
                </div>
        </div>
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
    </div>
</div>
)}

export default OtherUsersProfiles;