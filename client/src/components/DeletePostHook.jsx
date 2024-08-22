import { useState, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';

function DeletePostHook() {
  const [updatedPosts, setUpdatedPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const { formattedUsername, token } = useContext(TokenContext);

  const handleDeletePost = async (postId) => {
    console.log("Post ID to delete:", postId);
    try {
      await axios.delete(
        `http://localhost:3000/api/profile/post/${formattedUsername}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId },
        }
      );
      setUpdatedPosts((previousPosts) => previousPosts.filter((post) => post._id !== postId));
      setPostCount((prevCount) => Math.max(prevCount - 1, 0)); 
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
    }
  };

  return {
    updatedPosts,
    setUpdatedPosts,
    postCount,
    setPostCount,
    handleDeletePost,
  };
}

export default DeletePostHook;
