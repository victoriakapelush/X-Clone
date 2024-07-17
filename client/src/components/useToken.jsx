import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const useToken = () => {
    const [formattedUsername, setFormattedUsername] = useState('');

    useEffect(() => {
        const fetchTokenData = () => {
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
        fetchTokenData(); 
    }, []); 

    return formattedUsername;
};

