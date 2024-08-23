import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";
import UserContext from "./UserContext";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

const useNewPostHook = () => {
  const { token, formattedUsername } = useContext(TokenContext);
  const [postData, setPostData] = useState([]);
  const [bookmarkedStates, setBookmarkedStates] = useState([]);
  const [likedStates, setLikedStates] = useState([]);
  const [userID, setUserID] = useState("");
  const { userData } = useContext(UserContext);
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
    if (postData.length > 0 && userID) {
      const initialBookmarkedStates = postData.map((post) =>
        post.bookmarks.includes(userID),
      );
      setBookmarkedStates(initialBookmarkedStates);
    }
  }, [postData, userID]);

  const getPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/profile/post/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const posts = response.data.posts || [];
      setPostData(posts);

      const initialBookmarkedStates = posts.map((post) =>
        post.bookmarks.includes(userID),
      );
      setBookmarkedStates(initialBookmarkedStates);

      const initialLikedStates = posts.map((post) =>
        post.likes.includes(userID),
      );
      setLikedStates(initialLikedStates);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleBookmark = async (postId, index) => {
    if (!userID) return;

    try {
      const postIndex = postData.findIndex((post) => post._id === postId);
      if (postIndex === -1) return;

      const currentPost = postData[postIndex];
      const isBookmarked = currentPost.bookmarks.includes(userID);
      const updatedBookmarks = isBookmarked
        ? currentPost.bookmarks.filter((bookmark) => bookmark !== userID)
        : [...currentPost.bookmarks, userID];

      await axios.put(
        `http://localhost:3000/api/bookmarks/${formattedUsername}`,
        { postId: postId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedPosts = postData.map((post) =>
        post._id === postId ? { ...post, bookmarks: updatedBookmarks } : post,
      );
      setPostData(updatedPosts);
      setBookmarkedStates((prevStates) =>
        prevStates.map((bookmarked, idx) =>
          idx === index ? !bookmarked : bookmarked,
        ),
      );
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      // Find the current post
      const currentPost = postData.find((post) => post._id === postId);
      if (!currentPost) return;
  
      // Determine if the post has been liked
      const hasLiked = currentPost.likes.includes(userID);
  
      // Prepare the updated data
      const updatedLikes = hasLiked
        ? currentPost.likes.filter((user) => user !== userID)
        : [...currentPost.likes, userID];
      const updatedLikeCount = hasLiked
        ? Math.max(currentPost.likeCount - 1, 0)
        : currentPost.likeCount + 1;
  
      // Prepare payloads
      const updatePayload = { _id: postId };
      const originalUpdatePayload = currentPost.originalPostId
        ? { _id: currentPost.originalPostId._id }
        : null;
  
      // Update the original post if this is a repost
      if (originalUpdatePayload) {
        await axios.put(
          `http://localhost:3000/api/saveLikeCount/${formattedUsername}`,
          originalUpdatePayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
  
      // Update the current post
      await axios.put(
        `http://localhost:3000/api/saveLikeCount/${formattedUsername}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Update the local state immediately
      console.log("Before update:", postData);
      setPostData((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likeCount: updatedLikeCount, likes: updatedLikes }
            : post
        )
      );
      console.log("After update:", postData);
  
      setLikedStates((prevStates) =>
        prevStates.map((state, idx) =>
          postData[idx]._id === postId ? !state : state
        )
      );
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  

  useEffect(() => {
    if (username && userID) {
      getPost();
    }
  }, [username, formattedUsername, userID]);

  return {
    userData,
    postData,
    setPostData,
    bookmarkedStates,
    handleBookmark,
    likedStates,
    handleLike,
    getPost,
  };
};

export default useNewPostHook;
