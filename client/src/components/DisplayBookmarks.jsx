import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import { jwtDecode } from 'jwt-decode';

const DisplayBookmarks = () => {
    const { token, formattedUsername } = useContext(TokenContext);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [bookmarkedStates, setBookmarkedStates] = useState([]);
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
        if (formattedUsername && userID) {
            fetchBookmarkedPosts();
        }
    }, [formattedUsername, userID]);

    const fetchBookmarkedPosts = async () => {
        if (!formattedUsername) return;

        try {
            const response = await axios.get(`http://localhost:3000/api/bookmarks/${formattedUsername}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const posts = response.data.bookmarks || [];
            setBookmarkedPosts(posts);

            // Initialize bookmarked states based on userID
            const initialBookmarkedStates = posts.map(post => post.bookmarks.includes(userID));
            setBookmarkedStates(initialBookmarkedStates);
        } catch (error) {
            console.error('Error fetching bookmarked posts:', error);
        }
    };

    const handleBookmark = async (postId, index) => {
        if (!userID) return;

        try {
            const postIndex = bookmarkedPosts.findIndex(post => post._id === postId);
            if (postIndex === -1) return;

            const currentPost = bookmarkedPosts[postIndex];
            const isBookmarked = currentPost.bookmarks.includes(userID);
            const updatedBookmarks = isBookmarked
                ? currentPost.bookmarks.filter(bookmark => bookmark !== userID)
                : [...currentPost.bookmarks, userID];

            await axios.put(`http://localhost:3000/api/bookmarks/${formattedUsername}`, 
            { postId: postId }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (isBookmarked) {
                setBookmarkedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                setBookmarkedStates(prevStates => prevStates.filter((_, idx) => idx !== index));
            } else {
                setBookmarkedPosts(prevPosts => {
                    const newPosts = [...prevPosts];
                    newPosts[postIndex] = { ...currentPost, bookmarks: updatedBookmarks };
                    return newPosts;
                });
                setBookmarkedStates(prevStates => {
                    const newStates = [...prevStates];
                    newStates[index] = !isBookmarked;
                    return newStates;
                });
            }
        } catch (error) {
            console.error('Error updating bookmark status:', error);
        }
    };
    useEffect(() => {
        if (bookmarkedPosts.length > 0) {
          const initialLikedStates = bookmarkedPosts.map(post => post.likes.includes(userID));
          setLikedStates(initialLikedStates);
        }
      }, [bookmarkedPosts, userID]);
    
      const handleLike = async (postId, index) => {
        try {
            const postIndex = bookmarkedPosts.findIndex(post => post._id === postId);
            const currentPost = bookmarkedPosts[postIndex];
    
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
    
            const updatedPosts = bookmarkedPosts.map(post =>
                post._id === postId ? { ...post, likeCount: updatedLikeCount, likes: updatedLikes } : post
            );
            setBookmarkedPosts(updatedPosts);
            setLikedStates(prevStates => prevStates.map((liked, idx) => idx === index ? !liked : liked));
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };
    
    return { bookmarkedPosts, bookmarkedStates, setBookmarkedPosts, setBookmarkedStates, handleBookmark, fetchBookmarkedPosts, likedStates, handleLike, setLikedStates };
};

export default DisplayBookmarks;