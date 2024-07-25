/* eslint-disable no-unused-vars */
import axios from 'axios';

// Function to fetch trending tags
export const fetchTrendingTags = async (formattedUsername, token) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/trendingTags/${formattedUsername}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching trending tags:', error.message);
        return []; 
    }
};
