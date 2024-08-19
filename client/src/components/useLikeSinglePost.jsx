import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";
import { jwtDecode } from "jwt-decode";

const useLikeSinglePost = (post, setPost) => {
  const { token, formattedUsername } = useContext(TokenContext);
  const [likedStates, setLikedStates] = useState({
    likes: false,
    repliesLikes: {},
  });
  const [userID, setUserID] = useState("");

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
    if (post) {
      setLikedStates({
        likes: post.likes.includes(userID),
        repliesLikes: post.totalReplies.reduce((acc, reply) => {
          acc[reply._id] = reply.likes.includes(userID);
          return acc;
        }, {}),
      });
    }
  }, [post, userID]);

  const handleLikePost = async () => {
    try {
      const userIndex = post.likes.indexOf(userID);
      const updatedLikes =
        userIndex === -1
          ? [...post.likes, userID]
          : post.likes.filter((user) => user !== userID);
      const updatedLikeCount =
        userIndex === -1 ? post.likeCount + 1 : Math.max(post.likeCount - 1, 0);

      const payload = {
        _id: post._id,
        likeCount: updatedLikeCount,
        likes: updatedLikes,
      };

      await axios.put(
        `http://localhost:3000/api/saveLikeCount/${formattedUsername}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setPost((prevPost) => ({
        ...prevPost,
        likeCount: updatedLikeCount,
        likes: updatedLikes,
      }));

      setLikedStates((prevStates) => ({
        ...prevStates,
        likes: !prevStates.likes,
      }));
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const reply = post.totalReplies.find((r) => r._id === replyId);
      const userIndex = reply.likes.indexOf(userID);
      const updatedReplyLikes =
        userIndex === -1
          ? [...reply.likes, userID]
          : reply.likes.filter((user) => user !== userID);
      const updatedReplyLikeCount =
        userIndex === -1
          ? reply.likeCount + 1
          : Math.max(reply.likeCount - 1, 0);

      const payload = {
        _id: replyId,
        post: post._id,
      };

      await axios.put(
        `http://localhost:3000/api/replies/${formattedUsername}/saveReplyLike/${replyId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedReplies = post.totalReplies.map((r) =>
        r._id === replyId
          ? { ...r, likeCount: updatedReplyLikeCount, likes: updatedReplyLikes }
          : r,
      );

      setPost((prevPost) => ({ ...prevPost, totalReplies: updatedReplies }));

      setLikedStates((prevStates) => ({
        ...prevStates,
        repliesLikes: {
          ...prevStates.repliesLikes,
          [replyId]: !prevStates.repliesLikes[replyId],
        },
      }));
    } catch (error) {
      console.error("Error updating reply like status:", error);
    }
  };

  return { likedStates, handleLikePost, handleLikeReply };
};

export default useLikeSinglePost;
