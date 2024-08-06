import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

const DisplayBookmarks = () => {
    const { token, formattedUsername } = useContext(TokenContext);
    const [likedPosts, setLikedPosts] = useState([]);
    const [bookmarkedStates, setBookmarkedStates] = useState([]);
    const [likedStates, setLikedStates] = useState([]);
    const [userID, setUserID] = useState('');
    const { username } = useParams(); 

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
        const fetchLikes = async () => {
            if (!formattedUsername) return;
    
            try {
                const response = await axios.get(`http://localhost:3000/api/profile/likes/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.data) {
                    setLikedPosts(response.data.likedPosts);
                } else {
                    console.error('Failed to fetch liked posts:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching liked posts:', error);
            } 
        };
    
        fetchLikes();
    }, [username, token]);

    useEffect(() => {
        if (likedPosts.length > 0) {
            const initialBookmarkedStates = likedPosts.map(post => post.bookmarks.includes(userID));
            const initialLikedStates = likedPosts.map(post => post.likes.includes(userID));
            setBookmarkedStates(initialBookmarkedStates);
            setLikedStates(initialLikedStates);
        }
    }, [likedPosts, userID]);

    const handleBookmark = async (postId, index) => {
        if (!userID) return;

        try {
            const postIndex = likedPosts.findIndex(post => post._id === postId);
            if (postIndex === -1) return;

            const currentPost = likedPosts[postIndex];
            const isBookmarked = currentPost.bookmarks.includes(userID);
            const updatedBookmarks = isBookmarked
                ? currentPost.bookmarks.filter(bookmark => bookmark !== userID)
                : [...currentPost.bookmarks, userID];

            await axios.put(`http://localhost:3000/api/bookmarks/${formattedUsername}`, 
            { postId: postId }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedPosts = likedPosts.map(post =>
                post._id === postId ? { ...post, bookmarks: updatedBookmarks } : post
            );
            setLikedPosts(updatedPosts);
            setBookmarkedStates(prevStates => prevStates.map((bookmarked, idx) => idx === index ? !bookmarked : bookmarked));
        } catch (error) {
            console.error('Error updating bookmark status:', error);
        }
    };

    const handleLike = async (postId, index) => {
        if (!userID) return;

        try {
            const postIndex = likedPosts.findIndex(post => post._id === postId);
            if (postIndex === -1) return;

            const currentPost = likedPosts[postIndex];
            const isLiked = currentPost.likes.includes(userID);
            const updatedLikes = isLiked
                ? currentPost.likes.filter(like => like !== userID)
                : [...currentPost.likes, userID];
            const updatedLikeCount = isLiked ? currentPost.likeCount - 1 : currentPost.likeCount + 1;

            await axios.put(`http://localhost:3000/api/saveLikeCount/${formattedUsername}`, 
            { _id: postId }, 
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            const updatedPosts = likedPosts.map(post =>
                post._id === postId ? { ...post, likeCount: updatedLikeCount, likes: updatedLikes } : post
            );
            setLikedPosts(updatedPosts);
            setLikedStates(prevStates => prevStates.map((liked, idx) => idx === index ? !liked : liked));
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    return { 
        likedPosts, 
        bookmarkedStates, 
        likedStates, 
        handleBookmark, 
        handleLike 
    };
};

export default DisplayBookmarks;