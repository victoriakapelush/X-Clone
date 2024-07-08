/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';
import profileImage from '../assets/images/emoji.png'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

function HomeExtra() {
    const [randomUserData, setRandomUserData] = useState(null);
    const [formattedUsername, setFormattedUsername] = useState('');

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
                const response = await axios.get(`http://localhost:3000/profile/${formattedUsername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRandomUserData(response.data); 
                console.log(randomUserData);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (formattedUsername !== '') {
        getUserData(); 
    }
}, [formattedUsername]);

    return (
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
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>Who to follow</h3>
            </div>
            <Link to='/profile'>
                <div className='who-tofollow-container flex-column'>
                    <div className='who-tofollow-profile-box flex-row'>
                        <div className='who-to-follow-single-user flex-row'>
                            <div className='who-tofollow-image-box'>
                                <img src={profileImage}></img>
                            </div>
                            <div className='flex-column who-tofollow-name-box'>
                                <span className='who-tofollow-namelink'>Dongwook</span>
                                <span className='who-tofollow-iglink'>@DongWookChung2</span>
                            </div>
                        </div>
                        <div className='who-tofollow-btn'>
                            <button className='radius'>Follow</button>
                        </div>
                    </div>
                </div>
            </Link>
            <Link to='/profile'>
                <div className='who-tofollow-container flex-column'>
                    <div className='who-tofollow-profile-box flex-row'>
                        <div className='who-to-follow-single-user flex-row'>
                            <div className='who-tofollow-image-box'>
                                <img src={profileImage}></img>
                            </div>
                            <div className='flex-column who-tofollow-name-box'>
                                <span className='who-tofollow-namelink'>Dongwook</span>
                                <span className='who-tofollow-iglink'>@DongWookChung2</span>
                            </div>
                        </div>
                        <div className='who-tofollow-btn'>
                            <button className='radius'>Follow</button>
                        </div>
                    </div>
                </div>
            </Link>
            <Link to='/profile'>
                <div className='who-tofollow-container flex-column'>
                    <div className='who-tofollow-profile-box flex-row'>
                        <div className='who-to-follow-single-user flex-row'>
                            <div className='who-tofollow-image-box'>
                                <img src={profileImage}></img>
                            </div>
                            <div className='flex-column who-tofollow-name-box'>
                                <span className='who-tofollow-namelink'>Dongwook</span>
                                <span className='who-tofollow-iglink'>@DongWookChung2</span>
                            </div>
                        </div>
                        <div className='who-tofollow-btn'>
                            <button className='radius'>Follow</button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    </div>
    )
}

export default HomeExtra