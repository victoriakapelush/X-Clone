import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserData = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in local storage.');
                    return;
                }

                const response = await axios.get(`http://localhost:3000/home`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.data) {
                    console.error('User data not found in response:', response.data);
                    return;
                }

                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, []);

    return userData;
};
