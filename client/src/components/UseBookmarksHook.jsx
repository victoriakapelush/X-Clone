import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import { jwtDecode } from "jwt-decode";

const useBookmark = (randomPosts, setRandomPosts) => {
    const { token, formattedUsername } = useContext(TokenContext);
    const [bookmarkedStates, setBookmarkedStates] = useState([]);
    const [userID, setUserID] = useState('');

    useEffect(() => {
      const fetchUserData = async () => {
        if (token) {
          const decoded = jwtDecode(token);
          setUserID(decoded.id);
        }
      };
      fetchUserData();
    }, [token]);

    useEffect(() => {
        if (randomPosts.length > 0 && userID) {
            const initialBookmarkedStates = randomPosts.map(post => post.bookmarks.includes(userID));
            setBookmarkedStates(initialBookmarkedStates);
        }
    }, [randomPosts, userID]);

    const handleBookmark = async (postId, index) => {
        if (!userID) return;

        try {
            const postIndex = randomPosts.findIndex(post => post._id === postId);
            if (postIndex === -1) return;

            const currentPost = randomPosts[postIndex];
            const updatedBookmarks = currentPost.bookmarks.includes(userID)
                ? currentPost.bookmarks.filter(bookmark => bookmark !== userID)
                : [...currentPost.bookmarks, userID];

            await axios.put(`http://localhost:3000/api/bookmarks/${formattedUsername}`, 
            { postId: postId }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedPosts = randomPosts.map(post =>
                post._id === postId ? { ...post, bookmarks: updatedBookmarks } : post
            );
            setRandomPosts(updatedPosts);
            setBookmarkedStates(prevStates =>
                prevStates.map((bookmarked, idx) => idx === index ? !bookmarked : bookmarked)
            );
        } catch (error) {
            console.error('Error updating bookmark status:', error);
        }
    };

    const getUserData = async () => {
      try {
          if (!token) {
              console.error('No token found in local storage.');
              return;
          }
          
          const response = await axios.get(`http://localhost:3000/api/home/posts/${formattedUsername}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });

          if (!response.data.posts) {
              console.error('Post data not found in response:', response.data);
              return;
          }
          
          const postsData = response.data.posts.map(post => ({
              ...post, 
              likeCount: post.likeCount, 
              likes: post.likes 
          }));
          
          setRandomPosts(postsData);
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };

  useEffect(() => {
      if (formattedUsername) {
          getUserData();
      }
  }, [formattedUsername]);

    return { bookmarkedStates, handleBookmark, getUserData };
};

export default useBookmark;

