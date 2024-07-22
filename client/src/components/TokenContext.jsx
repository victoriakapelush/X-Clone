/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const TokenContext = createContext({
    formattedUsername: '',
    setFormattedUsername: () => {},
    token: ''
});

export const TokenProvider = ({ children }) => {
    const [formattedUsername, setFormattedUsername] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    useEffect(() => {
        const fetchTokenData = () => {
            try {
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
    }, [formattedUsername]);

    return (
        <TokenContext.Provider value={{ formattedUsername, setFormattedUsername, token }}>
            {children}
        </TokenContext.Provider>
    );
};

export default TokenContext;

