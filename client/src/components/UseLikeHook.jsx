import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";
import { jwtDecode } from "jwt-decode";

const useLike = (postsOrPost, setPostsOrPost) => {
  const { token, formattedUsername } = useContext(TokenContext);
  const [likedStates, setLikedStates] = useState([]);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserID(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    if (Array.isArray(postsOrPost)) {
      const initialLikedStates = postsOrPost.map((post) =>
        post.likes.includes(userID),
      );
      setLikedStates(initialLikedStates);
    } else if (postsOrPost && postsOrPost.likes) {
      setLikedStates(postsOrPost.likes.includes(userID));
    }
  }, [postsOrPost, userID]);

  const handleLike = async (postId, index) => {
    try {
      let updatedPosts;
      let updatedLikedStates;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (Array.isArray(postsOrPost)) {
        const postIndex = postsOrPost.findIndex((post) => post._id === postId);
        if (postIndex === -1) return;

        const currentPost = postsOrPost[postIndex];
        const hasLiked = currentPost.likes.includes(userID);

        const updatedLikes = hasLiked
          ? currentPost.likes.filter((id) => id !== userID)
          : [...currentPost.likes, userID];

        const updatedLikeCount = hasLiked
          ? Math.max(currentPost.likeCount - 1, 0)
          : currentPost.likeCount + 1;

        // Update the like in the backend
        await axios.put(
          `https://xsocial.onrender.com/api/saveLikeCount/${formattedUsername}`,
          { _id: postId },
          config,
        );

        updatedPosts = [...postsOrPost];
        updatedPosts[postIndex] = {
          ...currentPost,
          likes: updatedLikes,
          likeCount: updatedLikeCount,
        };

        setPostsOrPost(updatedPosts);

        if (index !== null) {
          updatedLikedStates = [...likedStates];
          updatedLikedStates[index] = !hasLiked;
          setLikedStates(updatedLikedStates);
        }
      } else if (postsOrPost && postsOrPost._id === postId) {
        const hasLiked = postsOrPost.likes.includes(userID);

        const updatedLikes = hasLiked
          ? postsOrPost.likes.filter((id) => id !== userID)
          : [...postsOrPost.likes, userID];

        const updatedLikeCount = hasLiked
          ? Math.max(postsOrPost.likeCount - 1, 0)
          : postsOrPost.likeCount + 1;

        await axios.put(
          `https://xsocial.onrender.com/api/saveLikeCount/${formattedUsername}`,
          { _id: postId },
          config,
        );

        const updatedPost = {
          ...postsOrPost,
          likes: updatedLikes,
          likeCount: updatedLikeCount,
        };

        setPostsOrPost(updatedPost);
        setLikedStates(!hasLiked);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return { likedStates, handleLike, setLikedStates };
};

export default useLike;
