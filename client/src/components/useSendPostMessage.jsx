/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TokenContext from "./TokenContext";
import { useHandleShowConversation } from "./message/useHandleShowConversation";
import NewPost from "./NewPost";

const useSendPostMessage = () => {
  const [conversations, setConversations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [messageText, setMessageText] = useState("");
  const [gif, setGif] = useState("");
  const [image, setImage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { formattedUsername, token } = useContext(TokenContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const { handleShowConversation } = useHandleShowConversation([selectedUser]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/messages/current_conversations/${formattedUsername}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };
    fetchConversations();
  }, [formattedUsername, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const res = await axios.post(
        `http://localhost:3000/api/sendPost/${formattedUsername}`,
        {
          postId: selectedPost,
          selectedUserId: selectedUser,
          text: messageText,
        },
        config,
      );
      setResponseMessage(res.data.message);
      console.log("Message sent", res.data);
    } catch (err) {
      console.error("Error sending message", err);
      setResponseMessage("Failed to send message.");
    }
  };

  return {
    conversations,
    posts,
    selectedConversation,
    selectedPost,
    messageText,
    responseMessage,
    setSelectedConversation,
    setSelectedPost,
    setMessageText,
    handleSubmit,
  };
};

export default useSendPostMessage;
