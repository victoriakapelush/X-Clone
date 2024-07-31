/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import UserContext from './UserContext';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

const OtherUserPostsHook = () => {
    const { token, formattedUsername } = useContext(TokenContext);
    const [postData, setPostData] = useState([]);
    const [bookmarkedStates, setBookmarkedStates] = useState([]);
    const [likedStates, setLikedStates] = useState([]);
    const [userID, setUserID] = useState('');
    const [loggedinUserID, setLoggedinUserID] = useState('');
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [randomUser, setRandomUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (token) {    
                    const decoded = jwtDecode(token);
                    setLoggedinUserID(decoded.id);    
                    const response = await axios.get(`http://localhost:3000/api/profile/otheruser/${username}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUserData({ ...response.data.user });
                    setUserID(response.data.user._id);
                    document.title = `${response.data.user.originalUsername} (@${response.data.user.formattedUsername}) / X`;

                    const responseRandomUser = await axios.get(`http://localhost:3000/profile/${formattedUsername}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setRandomUser(responseRandomUser.data.randomUsers);
                    console.log(responseRandomUser)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [token, formattedUsername, username]);

    useEffect(() => {
        if (postData.length > 0 && loggedinUserID) {
            const initialBookmarkedStates = postData.map(post => post.bookmarks.includes(loggedinUserID));
            setBookmarkedStates(initialBookmarkedStates);
        }
    }, [postData, loggedinUserID]);

    const getPost = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/profile/otheruser/${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const posts = response.data.posts || [];
            setPostData(posts);

            const initialBookmarkedStates = posts.map(post => post.bookmarks.includes(loggedinUserID));
            setBookmarkedStates(initialBookmarkedStates);

            const initialLikedStates = posts.map(post => post.likes.includes(loggedinUserID));
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
            const isBookmarked = currentPost.bookmarks.includes(loggedinUserID);
            const updatedBookmarks = isBookmarked
                ? currentPost.bookmarks.filter(bookmark => bookmark !== loggedinUserID)
                : [...currentPost.bookmarks, loggedinUserID];

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
            const userIndex = currentPost.likes.indexOf(loggedinUserID);
            let updatedLikes;
            let updatedLikeCount;

            if (userIndex === -1) {
                updatedLikes = [...currentPost.likes, loggedinUserID];
                updatedLikeCount = currentPost.likeCount + 1;
            } else {
                updatedLikes = currentPost.likes.filter(user => user !== loggedinUserID);
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
        if (formattedUsername && loggedinUserID) {
            getPost();
        }
    }, [formattedUsername, loggedinUserID]);

    return { userData, postData, bookmarkedStates, handleBookmark, likedStates, handleLike, getPost, randomUser };
};


export default OtherUserPostsHook;