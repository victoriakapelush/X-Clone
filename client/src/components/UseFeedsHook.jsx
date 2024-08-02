import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import UserContext from './UserContext';
import { jwtDecode } from 'jwt-decode';

const UseFeedsHook = () => {
    const { token, formattedUsername } = useContext(TokenContext);
    const [postData, setPostData] = useState([]);
    const [bookmarkedStates, setBookmarkedStates] = useState([]);
    const [likedStates, setLikedStates] = useState([]);
    const [userID, setUserID] = useState('');
    const { userData } = useContext(UserContext);

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
        if (postData.length > 0 && userID) {
            const initialBookmarkedStates = postData.map(post => post.bookmarks.includes(userID));
            setBookmarkedStates(initialBookmarkedStates);
        }
    }, [postData, userID]);

    const getPost = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/feeds/${formattedUsername}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data)
            const posts = response.data || [];
            setPostData(posts);

            const initialBookmarkedStates = posts.map(post => post.bookmarks.includes(userID));
            setBookmarkedStates(initialBookmarkedStates);

            const initialLikedStates = posts.map(post => post.likes.includes(userID));
            setLikedStates(initialLikedStates);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleBookmark = async (postId, index) => {
        if (!userID) return;

        try {
            const postIndex = postData.findIndex(post => post._id === postId);
            if (postIndex === -1) return;

            const currentPost = postData[postIndex];
            const isBookmarked = currentPost.bookmarks.includes(userID);
            const updatedBookmarks = isBookmarked
                ? currentPost.bookmarks.filter(bookmark => bookmark !== userID)
                : [...currentPost.bookmarks, userID];

            await axios.put(`http://localhost:3000/api/bookmarks/${formattedUsername}`, 
            { postId: postId }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedPosts = postData.map(post =>
                post._id === postId ? { ...post, bookmarks: updatedBookmarks } : post
            );
            setPostData(updatedPosts);
            setBookmarkedStates(prevStates =>
                prevStates.map((bookmarked, idx) => idx === index ? !bookmarked : bookmarked)
            );
        } catch (error) {
            console.error('Error updating bookmark status:', error);
        }
    };

    const handleLike = async (postId, index) => {
        try {
            const postIndex = postData.findIndex(post => post._id === postId);
            if (postIndex === -1) return;

            const currentPost = postData[postIndex];
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
            { _id: postId }, 
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            const updatedPosts = postData.map(post =>
                post._id === postId ? { ...post, likeCount: updatedLikeCount, likes: updatedLikes } : post
            );
            setPostData(updatedPosts);
            setLikedStates(prevStates =>
                prevStates.map((liked, idx) => idx === index ? !liked : liked)
            );
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    useEffect(() => {
        if (formattedUsername && userID) {
            getPost();
        }
    }, [formattedUsername, userID]);

    return { userData, postData, bookmarkedStates, handleBookmark, likedStates, handleLike, getPost };
};

export default UseFeedsHook;