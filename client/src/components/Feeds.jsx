/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import '../styles/profile.css'
import HomeNav from './HomeNav';
import HomeExtra from './HomeExtra';
import TokenContext from './TokenContext';
import UserContext from './UserContext';
import useLike from './UseLikeHook';
import useBookmark from './UseBookmarksHook';

function Feeds() {
    const {randomUser, setRandomUser} = useContext(UserContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [randomPosts, setRandomPosts] = useState([]);
    const { likedStates, handleLike } = useLike(randomPosts, setRandomPosts);
    const { bookmarkedStates, handleBookmark, getUserData } = useBookmark(randomPosts, setRandomPosts);
    const { token, formattedUsername } = useContext(TokenContext);
    const { fetchUserData, userData } = useContext(UserContext);

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    }

    useEffect(() => {
        document.title = 'Feeds / X';
    });
  
    useEffect(() => {
        if (formattedUsername) {
          getUserData();
        }
      }, [formattedUsername]);
    
      useEffect(() => {
        if (!userData) {
          fetchUserData();
        }
      }, [userData]);

    return (
        <div className='flex-row profile-page'>
            <HomeNav />
        <div className='profile-container'>
            {randomPosts.map((post, index) => (
                <div key={index} className='post random-post flex-column'>
                    <div className='flex-row'>
                        {post && post.user.profile.profilePicture ? (
                            <img
                            className='profile-pic'
                            alt="Profile Image"
                            src={`http://localhost:3000/uploads/${post.user.profile.profilePicture}`}
                        />  ) : ( 
                            <div className='defaul-profile-image-post'></div>
                        )}                   
                        <div className='flex-column post-box'>
                            <Link to={`/profile/${post.user.formattedUsername}`} className='link-to-profile'>
                                <span className='user-name'>{post.user.profile.updatedName}</span> <span className='username-name'>@{post.user.formattedUsername} · {post.time}</span>
                            </Link>
                            {post.text && <p className={`post-text ${isExpanded ? 'expanded' : ''}`} onClick={toggleText}>{post.text}</p>}
                            {post.image && <img className='post-image' src={`http://localhost:3000/uploads/${post.image}`} alt={`Post ${index + 1}`} />}
                        </div>
                    </div>
                    <div className='flex-row post-icons-container'>
                            <div>
                                <div className="icon-container color-hover flex-row" id="blue-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g className='flex-row'>
                                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                                        </g>
                                    </svg>
                                    <span className="count">0</span>
                                </div>
                            </div>
                            <div>
                                <div className="icon-container color-hover flex-row" id="green-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>
                                    </svg>
                                    <span className="count">0</span>
                                </div>
                            </div>                    
                            <div>
                                <div className="icon-container color-hover flex-row" id="yellow-svg">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                        <g><path d="M2.01 21L23 12 2.01 3v7l15 2-15 2v7z" transform="rotate(-45 10 12)"></path></g>
                                    </svg> 
                                    <span className="count">0</span>
                                </div>
                            </div> 
                            <div>
                                <div className={`icon-container color-hover flex-row ${likedStates[index] ? 'liked' : 'not-liked'}`} id="pink-svg" onClick={() => handleLike(post._id, index)}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="radius">
                                        <g>
                                            <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                                        </g>
                                    </svg>                                    
                                    <span className={`count ${likedStates[index] ? 'liked' : 'not-liked'}`}>{post.likeCount}</span>
                                </div>
                            </div>                      
                            <div className='save-icons flex-row'>
                                <div>
                                    <div className={`icon-container bookmark-icon color-hover ${bookmarkedStates[index] ? 'bookmarked' : 'not-bookmarked'}`} id="save-svg" onClick={() => handleBookmark(post._id, index)}>                                        
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className='radius' fill={bookmarkedStates[index] ? "bookmarked" : "not-bookmarked"}>
                                            <g>
                                                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                                            </g>
                                        </svg>                                    
                                    </div>
                                </div>
                                <div>
                                    <div className="icon-container sendpost-icon color-hover" id="send-svg">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className='radius'>
                                            <g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            ))}
        </div>
    <HomeExtra randomUser={randomUser}/>
    </div>
);
} 

export default Feeds;