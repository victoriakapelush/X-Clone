/* eslint-disable no-unused-vars */
import axios from "axios";

// Function to fetch trending tags
export const randomUsers = async (formattedUsername, token) => {
  try {
    const response = await axios.get(
      `https://xsocial.onrender.com/profile/${formattedUsername}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Random Users:", response);
    return response.data.randomUsers;
  } catch (error) {
    console.error("Error fetching trending tags:", error.message);
    return [];
  }
};
