/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const TokenContext = createContext({
    formattedUsername: '',
    setFormattedUsername: () => {},
});

export const TokenProvider = ({ children }) => {
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

    return (
        <TokenContext.Provider value={{ formattedUsername, setFormattedUsername }}>
            {children}
        </TokenContext.Provider>
    );
};

export default TokenContext;

