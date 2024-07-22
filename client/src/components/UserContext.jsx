/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';

const UserContext = createContext({
    userData: null,
    setUserData: () => {},
    fetchUserData: () => {},
    randomUser: null,
    setRandomUser: () => {}
});

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [randomUser, setRandomUser] = useState(null);
    const { token, formattedUsername } = useContext(TokenContext);

    const fetchUserData = async () => {

        if (!token) {
            console.error('No token found.');
            return;
        }

        try {
            if (!token) {
                console.error('No token found in local storage.');
                return;
            }

            const response = await axios.get(`http://localhost:3000/home/${formattedUsername}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data) {
                console.error('User data not found in response:', response.data);
                return;
            }
            setUserData(response.data.userProfile);
            setRandomUser(response.data.randomUsers)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [formattedUsername]);

    return (
        <UserContext.Provider value={{ userData, setUserData, fetchUserData, randomUser, setRandomUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

