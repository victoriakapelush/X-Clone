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

      const targetPostId = postData.originalPostId || postId;

      if (Array.isArray(postData)) {
        const postIndex = postData.findIndex(
          (post) => post._id === targetPostId,
        );
        if (postIndex === -1) return;

        const currentPost = postData[postIndex];
        const hasLiked = currentPost.likes.includes(userID);

        // Print before like state
        console.log("Before like:", {
          postId: targetPostId,
          post: currentPost,
          hasLiked,
          likeCount: currentPost.likeCount,
          likes: currentPost.likes,
        });

        const updatedLikes = hasLiked
          ? currentPost.likes.filter((id) => id !== userID)
          : [...currentPost.likes, userID];

        const updatedLikeCount = hasLiked
          ? Math.max(currentPost.likeCount - 1, 0)
          : currentPost.likeCount + 1;

        // Update the like in the backend
        await axios.put(
          `http://localhost:3000/api/saveLikeCount/${formattedUsername}`,
          { _id: targetPostId },
          config,
        );

        updatedPosts = [...postData];
        updatedPosts[postIndex] = {
          ...currentPost,
          likes: updatedLikes,
          likeCount: updatedLikeCount,
        };

        setPostData(updatedPosts);

        if (index !== null) {
          updatedLikedStates = [...likedStates];
          updatedLikedStates[index] = !hasLiked;
          setLikedStates(updatedLikedStates);
        }

        // Print after like state
        console.log("After like:", {
          postId: targetPostId,
          updatedPost: updatedPosts[postIndex],
          likeCount: updatedPosts[postIndex].likeCount,
          likes: updatedPosts[postIndex].likes,
        });
      } else if (postData && postData._id === targetPostId) {
        const hasLiked = postData.likes.includes(userID);

        // Print before like state
        console.log("Before like:", {
          postId: targetPostId,
          post: postData,
          hasLiked,
          likeCount: postData.likeCount,
          likes: postData.likes,
        });

        const updatedLikes = hasLiked
          ? postData.likes.filter((id) => id !== userID)
          : [...postData.likes, userID];

        const updatedLikeCount = hasLiked
          ? Math.max(postData.likeCount - 1, 0)
          : postData.likeCount + 1;

        await axios.put(
          `http://localhost:3000/api/saveLikeCount/${formattedUsername}`,
          { _id: targetPostId },
          config,
        );

        const updatedPost = {
          ...postData,
          likes: updatedLikes,
          likeCount: updatedLikeCount,
        };

        setPostData(updatedPost);
        setLikedStates(!hasLiked);

        // Print after like state
        console.log("After like:", {
          postId: targetPostId,
          updatedPost,
          likeCount: updatedPost.likeCount,
          likes: updatedPost.likes,
        });
      }
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
