import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";
import {jwtDecode} from "jwt-decode";

const useBookmarkSinglePost = (post, setPost) => {
  const { token, formattedUsername } = useContext(TokenContext);
  const [bookmarked, setBookmarked] = useState(false);
  const [repliesBookmarks, setRepliesBookmarks] = useState({});
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
    if (post && userID) {
      // Check if the post itself is bookmarked
      setBookmarked(post.bookmarks.includes(userID));

      // Initialize the bookmarked states for replies
      const repliesBookmarkState = post.totalReplies.reduce((acc, reply) => {
        acc[reply._id] = reply.bookmarks.includes(userID);
        return acc;
      }, {});
      setRepliesBookmarks(repliesBookmarkState);
    }
  }, [post, userID]);

  const handleBookmark = async () => {
    try {
      const userIndex = post.bookmarks.indexOf(userID);
      const updatedBookmarks =
        userIndex === -1
          ? [...post.bookmarks, userID]
          : post.bookmarks.filter((user) => user !== userID);

      const payload = {
        postId: post._id,
        bookmarks: updatedBookmarks,
      };

      await axios.put(
        `https://xsocial.onrender.com/api/bookmarks/${formattedUsername}`,
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
        bookmarks: updatedBookmarks,
      }));

      setBookmarked((prev) => !prev);
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  const handleBookmarkReply = async (replyId) => {
    try {
      const reply = post.totalReplies.find((r) => r._id === replyId);
      const userIndex = reply.bookmarks.indexOf(userID);
      const updatedReplyBookmarks =
        userIndex === -1
          ? [...reply.bookmarks, userID]
          : reply.bookmarks.filter((user) => user !== userID);

      const payload = {
        _id: replyId,
        post: post._id,
      };

      await axios.put(
        `https://xsocial.onrender.com/api/replies/bookmarks/${formattedUsername}/saveReplyBookmark/${replyId}`,
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
          ? { ...r, bookmarks: updatedReplyBookmarks }
          : r,
      );

      setPost((prevPost) => ({ ...prevPost, totalReplies: updatedReplies }));

      setRepliesBookmarks((prevStates) => ({
        ...prevStates,
        [replyId]: !prevStates[replyId],
      }));
    } catch (error) {
      console.error("Error updating reply bookmark status:", error);
    }
  };

  return { bookmarked, repliesBookmarks, handleBookmark, handleBookmarkReply };
};

export default useBookmarkSinglePost;

