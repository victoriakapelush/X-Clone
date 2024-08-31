/* eslint-disable no-unused-vars */
import "../../styles/profile.css";
import "../../styles/messages.css";
import HomeNav from "../HomeNav";
import { useEffect, useState, useContext } from "react";
import WriteMessageBtn from "./WriteMessageBtn";
import { Link, useParams } from "react-router-dom";
import TokenContext from "../TokenContext";
import UserContext from "../UserContext";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import { useHandleShowConversation } from "./useHandleShowConversation";

function Messages() {
  const [showWriteMessage, setShowWriteMessage] = useState(false);
  const { formattedUsername, token } = useContext(TokenContext);
  const [convos, setConvos] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const { userData } = useContext(UserContext);
  const [receiverId, setReceiverId] = useState(null);

  console.log(selectedConvo);

  const sendMessage = async () => {
    try {
      const messageData = {
        receiver: receiverId,
        text: messageText,
        image,
        gif,
        participants: userData._id,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const convoId = selectedConvo._id;
      const response = await axios.put(
        `http://localhost:3000/api/messages/conversation/${convoId}`,
        messageData,
        config,
      );

      console.log("Message sent successfully:", response.data);

      setMessageText("");
      setImage(null);
      setGif(null);

      setSelectedConvo((prevConvo) => ({
        ...prevConvo,
        messages: [...prevConvo.messages, response.data],
      }));

      setConvos((prevConvos) =>
        prevConvos.map((convo) =>
          convo._id === selectedConvo._id
            ? { ...convo, messages: [...convo.messages, response.data] }
            : convo,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleWriteMessageClick = () => {
    setShowWriteMessage(true);
    window.location.hash = "new_message";
  };

  const closeWriteMessage = () => {
    setShowWriteMessage(false);
    window.location.hash = "";
  };

  useEffect(() => {
    if (selectedConvo) {
      const receiverNames = selectedConvo.participants
        .map((receiver) => receiver.formattedUsername)
        .join(", ");

      document.title = `@${receiverNames} / X`;
    } else if (window.location.hash === "#new_message") {
      document.title = "New Message / X";
      setShowWriteMessage(true);
    } else {
      document.title = "Messages / X";
    }
  }, [selectedConvo]);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/messages/current_conversations/${formattedUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("API Response:", response.data);
        setConvos(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConvos();
  }, [formattedUsername, token]);

  const handleConvoClick = (convoId) => {
    const convo = convos.find((c) => c._id === convoId);
    setSelectedConvo(convo);
    const participantIds = convo.participants.map((user) => user._id);
    const currentUserId = userData._id;
    const receiverId = participantIds.find((id) => id !== currentUserId);
    setReceiverId(receiverId);
  };

  return (
    <div className="flex-row profile-page messages-profile-page">
      <HomeNav />
      <div className="profile-container messages-container flex-column">
        <header className="flex-row">
          <h2>Messages</h2>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="message-svg"
            onClick={handleWriteMessageClick}
          >
            <g>
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
            </g>
          </svg>
        </header>
        {convos.length > 0 ? (
          convos.map((convo) => {
            const lastMessage = convo?.messages?.[convo.messages.length - 1];
            const messageTime = lastMessage?.time
              ? new Date(lastMessage.time)
              : null;
            let formattedTime = "";

            if (convo.messages.length > 0) {
              // Only set formattedTime if there are messages
              if (messageTime && !isNaN(messageTime)) {
                const now = new Date();
                const isRecent = now - messageTime < 24 * 60 * 60 * 1000;

                formattedTime = isRecent
                  ? formatDistanceToNow(messageTime, { addSuffix: true })
                  : format(messageTime, "MMMM d");
              } else {
                formattedTime = "Invalid date";
              }
            }

            return (
              <main
                key={convo._id}
                onClick={() => handleConvoClick(convo._id)}
                className="message-user-info flex-column"
              >
                {convo.participants
                  .filter((participant) => participant._id !== userData?._id)
                  .map((participant) => (
                    <div
                      key={participant._id}
                      className="flex-row dropdown-user-msg-popup selected-user-convo"
                    >
                      <img
                        src={`http://localhost:3000/uploads/${participant?.profile?.profilePicture}`}
                        className="user-search-image-dropdown"
                      />
                      <div className="flex-column">
                        <div className="flex-row msg-un-img-holder">
                          <span>
                            {participant?.originalUsername}&nbsp;&nbsp;
                          </span>
                          <span className="grey-color">
                            @{participant?.formattedUsername}&nbsp;&nbsp;
                          </span>
                          <span> · {formattedTime}</span>
                        </div>
                        <div className="display-msg">
                          {convo?.messages?.length > 0
                            ? lastMessage.text
                            : "No messages yet"}
                        </div>
                      </div>
                    </div>
                  ))}
              </main>
            );
          })
        ) : (
          <main className="message-welcome flex-column">
            <h1>Welcome to your inbox!</h1>
            <div>
              Drop a line, share posts and more with private conversations
              between you and others on X.
            </div>
            <button
              className="new-post-btn radius write-message"
              onClick={handleWriteMessageClick}
            >
              Write a message
            </button>
          </main>
        )}
      </div>
      {!selectedConvo ? (
        <div className="profile-container messages-container conversation-container flex-column no-left-border">
          <header className="flex-row">
            <h2>Conversations</h2>
          </header>
        </div>
      ) : (
        <div className="profile-container messages-container conversation-container flex-column no-left-border">
          {selectedConvo.participants
            .filter((participant) => participant._id !== userData?._id)
            .map((participant, idx) => (
              <Link to={`/profile/${participant?.formattedUsername}`} key={idx}>
                <header className="flex-row selected-user-header-convo">
                  <img
                    src={`http://localhost:3000/uploads/${participant?.profile?.profilePicture}`}
                    className="user-search-image-dropdown"
                  />
                  <h2>{participant.originalUsername}</h2>
                </header>
              </Link>
            ))}
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                overflowY: "auto",
                padding: "10px",
                height: "600px",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {selectedConvo &&
                selectedConvo.messages &&
                selectedConvo?.messages?.map((message, idx) => {
                  // Convert and format the message time
                  const messageTime = message?.time
                    ? new Date(message.time)
                    : null;
                  let formattedTime = "";
                  const isSender = message?.sentBy?.includes(userData._id);

                  if (messageTime && !isNaN(messageTime)) {
                    const now = new Date();
                    const isRecent = now - messageTime < 24 * 60 * 60 * 1000; // Check if the message is within the last 24 hours

                    formattedTime = isRecent
                      ? formatDistanceToNow(messageTime, { addSuffix: true })
                      : format(messageTime, "MMMM d");
                  } else {
                    formattedTime = "Invalid date";
                  }

                  return (
                    <div
                      className="flex-column"
                      key={idx}
                      style={{
                        backgroundColor: isSender
                          ? "rgb(29, 155, 240)"
                          : "rgb(113, 118, 123)",
                        color: "white",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "5px",
                        alignSelf: isSender ? "flex-end" : "flex-start",
                        maxWidth: "60%",
                      }}
                    >
                      {message.text}
                      <span className="display-time-msg">{formattedTime}</span>
                    </div>
                  );
                })}
            </div>
            <div className="styled-textarea">
              <div className="msg-svg-container flex-row">
                <button className="hover-effect" data-username="Media">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="msg-svg-media"
                  >
                    <g>
                      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                    </g>
                  </svg>
                </button>
                <button className="hover-effect" data-username="GIF">
                  <svg
                    className="msg-svg-media"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                    </g>
                  </svg>
                </button>
                <button className="hover-effect" data-username="Emoji">
                  <svg
                    className="msg-svg-media"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <textarea
                placeholder="Start a new message"
                className="growing-textarea"
                rows="1"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height to auto
                  e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on scrollHeight
                }}
              ></textarea>
              <button onClick={sendMessage} className="send-pers-msg radius">
                <svg className="radius" viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {showWriteMessage && (
        <WriteMessageBtn
          handleWriteMessageClick={handleWriteMessageClick}
          closeWriteMessage={closeWriteMessage}
          showWriteMessage={showWriteMessage}
          setShowWriteMessage={setShowWriteMessage}
        />
      )}
    </div>
  );
}

export default Messages;
