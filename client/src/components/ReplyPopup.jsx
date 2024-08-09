/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import '../styles/popup.css'
import '../styles/editProfilePopup.css'
import '../styles/topost.css'
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ReplyPopup({ onClose, postId }) {
    const [userData, setUserData] = useState({});
    const [profile, setProfile] = useState({});
    const [formattedUsername, setFormattedUsername] = useState('');
    const [text, setText] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [post, setPost] = useState([]);
    const { username } = useParams();

    console.log(postId)

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
        document.getElementById('topost-insert-image').style.display = "block";
    };

    const handleUploadClick = (e) => {
        e.preventDefault();
        document.getElementById('image').click();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const decodedUsername = decoded.originalUsername.toLowerCase().replace(/\s+/g, '');
                    setFormattedUsername(decodedUsername); 
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        };
        fetchUserData(); 
    }, []); 

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }
                
                const response = await axios.get(`http://localhost:3000/home/${formattedUsername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (!response.data) {
                    console.error('User data not found in response:', response.data);
                    return;
                }
        
                const profiles = response.data.userProfile.profile || [];
                const posts = response.data.userProfile.post || [];
                setUserData({ ...response.data.userProfile });
                setProfile(profiles);
                setPost(posts);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUserData();
    }, [formattedUsername]); 
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');   
            const formData = new FormData();    
            formData.append('text', text);
            formData.append('image', profileImage);

            const response = await axios.post(`http://localhost:3000/api/profile/post/${formattedUsername}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status >= 200 && response.status < 300) { 
                setText(''); 
                setImageUrl(''); 
                setProfileImage(null); 
                onClose();
            } else {
                console.error('Error creating a comment:', response);
            }
        } catch (error) {
            console.error('Error creating a comment:', error);
        }
    };

    return (
        <div className="topost-popup-container flex-column">
            <div className="topost-black-window flexible-size flex-column">
                <div className='edit-popup-header flex-row'>
                    <div className='edit-popup-close-header flex-row'>
                        <button className='radius edit-popup-close-button' onClick={() => onClose(null)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='flex-row popup-reply-post'>
                    <div className='pic-vertical-line-box flex-column'>
                        <img className='profile-pic no-bottom-margin' src={`http://localhost:3000/uploads/${postId.user.profile.profilePicture}`} />
                        <div className='vertical-line-reply'></div>
                    </div>
                    <div className='reply-summary-post flex-column'>
                        <span>{postId.user.profile.updatedName} <span className='reply-replying-to'>@{postId.user.formattedUsername} · {postId.time}</span></span>
                        {/* Check for text */}
                        {postId.text && (
                                <span className='reply-post-text'>{postId.text}</span>
                            )}
                        {/* Check for image */}
                        {postId.image && (
                                <img
                                    className='reply-post-text reply-post-image'
                                    src={`http://localhost:3000/uploads/${postId.image}`}
                                />
                        )}
                        {/* Check for GIF */}
                        {postId.gif && (
                                <img
                                    className='reply-post-text reply-post-gif'
                                    src={postId.gif}
                                />
                        )}                        
                        <span className='reply-replying-to'>Replying to <span className='replying-to-blue'>@{postId.user.formattedUsername}</span></span>
                    </div>
                </div>
                <div className='create-new-post-window'>
                    <div className='create-new-post-window-container flex-row'>
                        <Link to={`/profile/${username}`}>                                
                            <img className='profile-pic' src={`http://localhost:3000/uploads/${profile.profilePicture}`} />
                        </Link>
                        <div className='form-container-new-post'>
                            <form onSubmit={handleSubmit} className='flex-column'>
                                <textarea className='topost-textarea' 
                                 placeholder='Post your reply'
                                 name='text'
                                 value={text}
                                 onChange={(e) => setText(e.target.value)}
                                 >
                                 </textarea>
                                 <div className='topost-insert-image' id="topost-insert-image"
                                 style={{
                                    display: 'none',
                                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}>
                                 </div>
                                <div className='flex-row button-and-upload-pic'>
                                    <div className='upload-pic-container'>
                                        <button onClick={handleUploadClick}>
                                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true">
                                                <g>
                                                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                                                </g>
                                            </svg>
                                        </button>
                                        <input
                                            type="file"
                                            id="image"
                                            value={post.image}
                                            onChange={handleProfileImageChange}
                                            style={{ display: 'none' }}
                                        />
                                        <button>
                                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true">
                                                <g>
                                                    <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                                                </g>
                                            </svg>
                                        </button>
                                        <button>
                                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true">
                                                <g>
                                                    <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path>
                                                </g>
                                            </svg>
                                        </button>
                                        <button>
                                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true">
                                                <g>
                                                    <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                                                </g>
                                            </svg>
                                        </button>
                                        <button>
                                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true">
                                                <g>
                                                    <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path>
                                                </g>
                                            </svg>
                                        </button>                                    
                                    </div>
                                    <button className='new-post-btn radius smaller-size' type='submit' onClick={handleSubmit}>Post</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReplyPopup;