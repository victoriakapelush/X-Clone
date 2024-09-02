/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import TokenContext from "../TokenContext";

export function useHandleShowConversation(selectedUsers, closeWriteMessage) {
  const { formattedUsername, token } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleShowConversation = async () => {
    if (selectedUsers.length === 0) {
      console.log("No users selected.");
      return;
    }

    try {
      const participants = selectedUsers.map((user) => user._id);

      // Request to check for an existing conversation or create a new one
      const response = await axios.post(
        "http://localhost:3000/api/messages/conversation/send",
        { participants },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const conversation = response.data;

      // Navigate to the conversation
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      console.error("Error checking or creating conversation:", error);
    } finally {
      closeWriteMessage();
    }
  };

  return { handleShowConversation };
}
