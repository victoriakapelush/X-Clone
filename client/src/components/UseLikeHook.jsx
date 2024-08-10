import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import {jwtDecode} from 'jwt-decode';

const useLike = (randomPosts, setRandomPosts) => {
  const { token, formattedUsername } = useContext(TokenContext);
  const [likedStates, setLikedStates] = useState([]);
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
    if (randomPosts.length > 0) {
      const initialLikedStates = randomPosts.map(post => post.likes.includes(userID));
      setLikedStates(initialLikedStates);
    }
  }, [randomPosts, userID]);

  const handleLike = async (postId, index) => {
    try {
        const postIndex = randomPosts.findIndex(post => post._id === postId);
        const currentPost = randomPosts[postIndex];

        const userIndex = currentPost.likes.indexOf(userID);
        let updatedLikes;
        let updatedLikeCount;

        if (userIndex === -1) {
            updatedLikes = [...currentPost.likes, userID];
            updatedLikeCount = currentPost.likeCount + 1;
        } else {
            updatedLikes = currentPost.likes.filter(user => user !== userID);
            updatedLikeCount = Math.max(currentPost.likeCount - 1, 0);
        }

        await axios.put(`http://localhost:3000/api/saveLikeCount/${formattedUsername}`, 
        { 
            _id: postId
        }, 
        {
            headers: {
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        const updatedPosts = randomPosts.map(post =>
            post._id === postId ? { ...post, likeCount: updatedLikeCount, likes: updatedLikes } : post
        );
        setRandomPosts(updatedPosts);
        setLikedStates(prevStates => prevStates.map((liked, idx) => idx === index ? !liked : liked));
    } catch (error) {
        console.error('Error updating like status:', error);
    }
};

  return { likedStates, handleLike, setLikedStates };
};

export default useLike;