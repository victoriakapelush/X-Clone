// useHandleShowConversation.js
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import TokenContext from "../TokenContext";

export function useHandleShowConversation(selectedUser, closeWriteMessage) {
  const { formattedUsername, token } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleShowConversation = async () => {
    if (!selectedUser) {
      console.log("No user selected.");
      return;
    }

    try {
      // Fetch existing conversations for the current user
      const response = await axios.get(
        `http://localhost:3000/api/messages/current_conversations/${formattedUsername}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const conversations = response.data;
      // Check if a conversation with the selected user already exists
      const existingConversation = conversations.find((conversation) =>
        conversation.participants.some(
          (participant) => participant._id === selectedUser._id,
        ),
      );

      if (existingConversation) {
        // Navigate to the existing conversation
        navigate(`/messages/${existingConversation._id}`);
      } else {
        // No existing conversation, create a new one
        const newConversationResponse = await axios.post(
          "http://localhost:3000/api/messages/conversation/send",
          {
            receiver: selectedUser._id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const newConversation = newConversationResponse.data;
        // Navigate to the new conversation
        navigate(`/messages/${newConversation._id}`);
      }
    } catch (error) {
      console.error("Error checking or creating conversation:", error);
    } finally {
      closeWriteMessage();
    }
  };

  return { handleShowConversation, selectedUser };
}
