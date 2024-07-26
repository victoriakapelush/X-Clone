/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import TokenContext from './TokenContext';

const useBookmark = (randomPosts, setRandomPosts) => {
  const { token, formattedUsername } = useContext(TokenContext);
  const [bookmarkedStates, setBookmarkedStates] = useState([]);
  const [userID, setUserID] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        const decoded = jwtDecode(token);
        setUserID(decoded.id);
      }
    };
    fetchUserData();
  }, [token]);

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

  useEffect(() => {
    if (randomPosts.length > 0 && userID) {
      const initialBookmarkedStates = randomPosts.map(post => post.bookmarks.includes(userID));
      setBookmarkedStates(initialBookmarkedStates);
    }
  }, [randomPosts, userID]);

  const handleBookmark = async (postId, index) => {
    if (!userID) {
      console.error('User ID is invalid');
      return;
    }

    try {
      const postIndex = randomPosts.findIndex(post => post._id === postId);
      if (postIndex === -1) {
        console.error('Post not found');
        return;
      }
      const currentPost = randomPosts[postIndex];

      const userBookmarkIndex = currentPost.user.bookmarks.indexOf(postId);
      const postBookmarkIndex = currentPost.bookmarks.indexOf(userID);

      let updatedUserBookmarks;
      let updatedPostBookmarks;

      if (userBookmarkIndex === -1 && postBookmarkIndex === -1) {
        updatedUserBookmarks = [...currentPost.user.bookmarks, postId];
        updatedPostBookmarks = [...currentPost.bookmarks, userID];
      } else {
        updatedUserBookmarks = currentPost.user.bookmarks.filter(bookmark => bookmark !== postId);
        updatedPostBookmarks = currentPost.bookmarks.filter(bookmark => bookmark !== userID);
      }

      await axios.put(`http://localhost:3000/api/bookmarks/${formattedUsername}`, 
      { postId: postId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      const updatedPosts = randomPosts.map(post =>
        post._id === postId ? { 
          ...post, 
          user: { 
            ...post.user, 
            bookmarks: updatedUserBookmarks 
          },
          bookmarks: updatedPostBookmarks
        } : post
      );
      setRandomPosts(updatedPosts);

      setBookmarkedStates(prevStates =>
        prevStates.map((bookmarked, idx) => idx === index ? !bookmarked : bookmarked)
      );

    } catch (error) {
      console.error('Error updating bookmark status:', error);
    }
  };

  return { bookmarkedStates, handleBookmark, getUserData, setBookmarkedStates };
};

export default useBookmark;





