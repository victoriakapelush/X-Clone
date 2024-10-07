import { useState, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useCommentRepost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, formattedUsername } = useContext(TokenContext);

  const repostComment = async (commentId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://xsocial.onrender.com/api/comment_repost/${formattedUsername}`,
        { commentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Reposted");
      setLoading(false);
      return response.data.post;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    repostComment,
    loading,
    error,
  };
};

export default useCommentRepost;