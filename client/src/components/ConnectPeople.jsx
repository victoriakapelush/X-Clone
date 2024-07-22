/* eslint-disable no-unused-vars */
import '../styles/connectPeople.css';
import back from '../assets/icons/back.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import HomeNav from './HomeNav'
import HomeExtra from './HomeExtra'
import SingleUserBriefProfile from './SingleUserBriefProfile'

function ConnectPeople() {
    const [singleUserData, setSingleUserData] = useState(null);
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
                const response = await axios.get(`http://localhost:3000/home/connect_people/${formattedUsername}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSingleUserData(response.data.users);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (formattedUsername !== '') {
        getUserData(); 
    }
}, [formattedUsername]);

useEffect(() => {
    document.title = 'Connect / X';
}, []);

    return (
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='connect-center-container flex-column'>
                <header className='flex-row'>
                    <Link to='/home' className='flex-row profile-icon-back'>
                        <img src={back}/>
                    </Link>
                    <div className='connect-h2'>
                        <h2>Connect</h2>
                    </div>
                </header>
                <h2 className='connect-h2-suggested'>Suggested for you</h2>
                {singleUserData && singleUserData.map(user => (
                    <SingleUserBriefProfile key={user.id} singleUserData={user} />
                ))}            
            </div>
            <HomeExtra />
        </div>
    )
}

export default ConnectPeople;