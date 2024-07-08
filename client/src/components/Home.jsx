/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import NewPost from './NewPost'
import defaultProfileImage from '../assets/images/defaultProfileImage.jpg'
import HomeNav from './HomeNav'
import HomeExtra from './HomeExtra'
import PopupWindow from './PopupWindow'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import PostReplacement from './PostReplacement.jsx'

function Home({ onClose, posts, setPosts }) {
    const [userData, setUserData] = useState(null);
    const [formattedUsername, setFormattedUsername] = useState('');

    const [showPopup, setShowPopup] = useState(() => {
        const savedPopupState = localStorage.getItem('showPopup');
        return savedPopupState === 'false' ? false : true;
    });

    const [text, setText] = useState('');
    const [images, setImages] = useState([]);


    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleImageUploadClick = () => {
        document.getElementById('image').click();
    };

    const handleClosePopup = () => {
        setShowPopup(false); 
        localStorage.setItem('showPopup', false);
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
                const showPopup = localStorage.getItem('showPopup');
                    if (showPopup === true) {
                        setShowPopup(false);
                    }
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }
                const response = await axios.get(`http://localhost:3000/profile/${formattedUsername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (formattedUsername !== '') {
        getUserData(); 
    }
}, [formattedUsername]);

useEffect(() => {
    document.title = 'Home / X';
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');            
        const response = await axios.post(`http://localhost:3000/post/${formattedUsername}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    onClose(); 
    } catch (error) {
        console.error('Error creating a post:', error);
    }
};


return (
    <div className="flex-row home-container">
        <HomeNav />
        {showPopup ? (
            <PopupWindow onClose={handleClosePopup} onSave={handleClosePopup} />
        ) : (
            <div className='profile-center'>
                <div className='flex-row mini-header-btns-container'>
                    <div className='mini-header-btn'>
                        <div className='blue-underline flex-column'>
                            <Link to="/home" className='for-you-tab'>For you</Link>
                            <div className='blue-underscore'></div>
                        </div>
                    </div>
                    <div className='mini-header-btn'>
                        <div className='blue-underline flex-column'>
                            <Link to="/home" className='for-you-tab'>Following</Link>
                            <div className='blue-underscore'></div>
                        </div>
                    </div>
                </div>
                <div className='create-new-post-window'>
                    <div className='create-new-post-window-container flex-row'>
                        <Link to='/profile'>
                            {userData && userData.profile.profilePicture ? (
                                <img className='profile-pic' src={`http://localhost:3000/uploads/${userData.profile.profilePicture}`} alt="Profile Picture" />
                                ) : (
                                <img className='profile-pic' src={defaultProfileImage} alt="Default Profile Picture" />
                            )}
                        </Link>
                        <div className='form-container-new-post'>
                            <form onSubmit={handleSubmit}>
                                <div className='post-textarea'
                                    contentEditable
                                    placeholder='What is happening?!'
                                    name='text'
                                    value={text}
                                    onInput={handleTextChange}
                                    onClick={handleTextChange}
                                 ></div>
                                <div className='flex-row button-and-upload-pic'>
                                    <div className='upload-pic-container'>
                                        <button onClick={handleImageUploadClick}>
                                            <input
                                            type="file"
                                            id="image"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g></svg>
                                        </button>
                                        <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path></g></svg>
                                        <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path></g></svg>
                                        <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path></g></svg>
                                        <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true"><g><path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path></g></svg>
                                    </div>
                                    <button className='new-post-btn radius smaller-size' type='submit'>Post</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <PostReplacement />
            </div>
        )}
        {!showPopup && <HomeExtra />}
    </div>
);
}
  
export default Home