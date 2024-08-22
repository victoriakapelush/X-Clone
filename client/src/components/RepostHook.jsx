import { useState, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";

const useRepost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repostedPosts, setRepostedPosts] = useState([]);
  const { token, formattedUsername } = useContext(TokenContext);

  const repostPost = async (postId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/repost/${formattedUsername}`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRepostedPosts((prevPosts) => [response.data, ...prevPosts]);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    repostPost,
    repostedPosts,
    loading,
    error,
  };
};

export default useRepost;
