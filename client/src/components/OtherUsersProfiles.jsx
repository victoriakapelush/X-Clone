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
import { useState, useEffect } from 'react';
import TokenContext from './TokenContext';
import UseNewPostHook from './UseNewPostHook'

function OtherUsersProfiles() {
    const { username } = useParams();
    const [singleUser, setSingleUser] = useState({});
    const [randomUser, setRandomUser] = useState(null);
    const [formattedUsername, setFormattedUsername] = useState('');
    const [singlePostData, setSinglePostData] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const { postData, bookmarkedStates, handleBookmark, likedStates, handleLike, getPost } = UseNewPostHook();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };
    
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                const decodedUsername = decoded.originalUsername.toLowerCase().replace(/\s+/g, '');
                setFormattedUsername(decodedUsername); 

                const response = await axios.get(`http://localhost:3000/api/profile/otheruser/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSingleUser({ ...response.data.user });
                document.title = `${response.data.user.originalUsername} (@${response.data.user.formattedUsername}) / X`;
                setSinglePostData(response.data.posts);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData(); 
    }, [username]); 


    return(
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='profile-container'>
                <header className='flex-row'>
                    <Link to='/home' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='flex-column profile-header-name'>
                        {singleUser && <h2>{singleUser.originalUsername}</h2>}
                        {singleUser && singleUser.profile && <span>{singleUser.profile.posts} posts</span>}
                    </div>
                </header>
                <div className='background-image-holder'>
                    {singleUser && singleUser.backgroundHeaderImage ? (
                        <img src={`http://localhost:3000/uploads/${singleUser.backgroundHeaderImage}`} />
                    ) : (
                        <div className='defaul-profile-image-background'></div>
                    )}
                </div>
                <div className='profile-photo-container flex-row'>
                    {singleUser && singleUser.profilePicture ? (
                        <img src={`http://localhost:3000/uploads/${singleUser.profilePicture}`} />
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
                        {singleUser && <span className='profile-user-name'>{singleUser.updatedName}</span>}
                        {singleUser.formattedUsername && <span className='user-tag'>@{singleUser.formattedUsername}</span>}
                        {singleUser && singleUser.profileBio && (
                            <p className='user-profile-description'>{singleUser.profileBio}</p>
                        )}
                        <div className='flex-row location-date-container'>
                        {singleUser && singleUser.location && (
                            <>
                                <div className='flex-row location-container'>
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <g><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path></g>
                                    </svg>
                                    <span>{singleUser.location}</span>
                                </div>
                                </>
                            )}
                        {singleUser && singleUser.website && (
                        <>
                            <div className='flex-row location-container'>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" ><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg>
                                    <span>
                                        <a href='' target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline"}}>
                                            {singleUser.website}
                                        </a>
                                    </span>
                            </div>
                        </>)}
                            <div className='flex-row location-container'>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g></svg>                            
                                {singleUser.profile ? (<span>{singleUser.profile.registrationDate}</span>) : <span>No registration date available</span>}                            
                            </div>
                        </div>
                        <div className='flex-row following-container'>
                            {singleUser.profile && (
                                <span className='following-number'>
                                    {singleUser.profile.following ? singleUser.profile.following : '0'}{' '}
                                    <span className='following-grey'>Following</span>
                                </span>
                            )}
                            {singleUser && singleUser.profile && (
                                <span className='following-number'>
                                    {singleUser.profile.followers ? singleUser.profile.followers : '0'}{' '} 
                                    <span className='following-grey'>Followers</span>
                                </span>
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
                    {activeTab === 'posts' && <NewPost postData={postData} bookmarkedStates={bookmarkedStates} handleBookmark={handleBookmark} likedStates={likedStates} handleLike={handleLike} getPost={getPost} />}
                    {activeTab === 'replies' && <Replies randomUser={randomUser}/>}
                    {activeTab === 'highlights' && <Highlights />}
                    {activeTab === 'media' && <Media />}
                    {activeTab === 'likes' && <Likes />}
                </div>
                <div>
                {singlePostData && singlePostData.length > 0 && (singlePostData.map((post, index) => (                
                    <div key={index} className='post flex-row'>
                    <img
                        className='profile-pic'
                        src={`http://localhost:3000/uploads/${singleUser.profile.profilePicture || 'defaultProfileImage.jpg'}`}
                    />                    
                    <div className='flex-column post-box'>
                        <Link to='/profile' className='link-to-profile'>
                            <span className='user-name'>{singleUser.originalUsername}</span> <span className='username-name'>@{singleUser.formattedUsername} · {post.time}</span>
                        </Link>
                        {post.text && <p className='post-text'>{post.text}</p>}
                        {post.image && <img className='post-image' src={`http://localhost:3000/uploads/${post.image}`} />}
                        <div className='flex-row post-icons-container'>
                            <Link to='/home'>
                                <div className="icon-container color-hover flex-row" id="blue-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g className='flex-row'>
                                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                                        </g>
                                    </svg>
                                    <span className="count">876</span>
                                </div>
                            </Link>
                            <Link to='/home'>
                                <div className="icon-container color-hover flex-row" id="green-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>
                                    </svg>
                                    <span className="count">302</span>
                                </div>
                            </Link>                    
                            <Link to='/home'>
                                <div className="icon-container color-hover flex-row" id="yellow-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g><path d="M2.01 21L23 12 2.01 3v7l15 2-15 2v7z" transform="rotate(-45 10 12)"></path></g>
                                    </svg> 
                                    <span className="count">5</span>
                                </div>
                            </Link> 
                            <Link to='/home'>
                                <div className="icon-container color-hover flex-row" id="pink-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>
                                    </svg>
                                    <span className="count">94</span>
                                </div>
                            </Link>                      
                            <div className='save-icons flex-row'>
                                <Link to='/home'>
                                    <div className="icon-container">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g>
                                        </svg>
                                    </div>
                                </Link>
                                <Link to='/home'>
                                    <div className="icon-container">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g>
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                ))   
            )}
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