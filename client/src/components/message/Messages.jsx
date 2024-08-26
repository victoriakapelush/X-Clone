import "../../styles/profile.css";
import "../../styles/messages.css";
import HomeNav from "../HomeNav";
import { useEffect, useState } from "react";
import WriteMessageBtn from "./WriteMessageBtn";

function Messages() {
  const [showWriteMessage, setShowWriteMessage] = useState(false);

  const handleWriteMessageClick = () => {
    setShowWriteMessage(true);
    window.location.hash = "new_message";
  };

  const closeWriteMessage = () => {
    setShowWriteMessage(false);
    window.location.hash = "";
  };

  useEffect(() => {
    document.title = "Messages / X";
    if (window.location.hash === "#new_message") {
      setShowWriteMessage(true);
    }
  }, []);

  return (
    <div className="flex-row profile-page messages-profile-page">
      <HomeNav />
      <div className="profile-container messages-container flex-column">
        <header className="flex-row">
          <h2>Messages</h2>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="message-svg">
            <g>
              <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
            </g>
          </svg>
        </header>
        <main className="message-welcome flex-column">
          <h1>Welcome to your inbox!</h1>
          <div>
            Drop a line, share posts and more with private conversations between
            you and others on X.
          </div>
          <button
            className="new-post-btn radius write-message"
            onClick={handleWriteMessageClick}
          >
            Write a message
          </button>
        </main>
      </div>
      <div className="profile-container messages-container flex-column no-left-border">
        <header className="flex-row">
          <h2>Conversations</h2>
        </header>
        {showWriteMessage && <WriteMessageBtn handleWriteMessageClick={handleWriteMessageClick} closeWriteMessage={closeWriteMessage} showWriteMessage={showWriteMessage} setShowWriteMessage={setShowWriteMessage} />}
      </div>
    </div>
  );
}

export default Messages;
