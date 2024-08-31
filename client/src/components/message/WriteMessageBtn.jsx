/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import CreateGroupPopup from "./CreateGroupPopup";
import { useContext, useState } from "react";
import useSearchUsers from "./UsersSearch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TokenContext from "../TokenContext";
import { useHandleShowConversation } from "./useHandleShowConversation";

function WriteMessageBtn({ closeWriteMessage }) {
  const { formattedUsername, token } = useContext(TokenContext);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const {
    query,
    results,
    loading,
    handleSearch,
    handleChange,
    setQuery,
    setResults,
  } = useSearchUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const navigate = useNavigate();
  const { handleShowConversation } = useHandleShowConversation(
    selectedUser,
    closeWriteMessage,
  );

  const onChange = (e) => {
    handleChange(e);
    handleSearch();
  };

  const handleShowCreateGroup = () => {
    setShowCreateGroup(true);
    window.location.hash = "new_group_message";
  };

  const addUser = (user) => {
    setSelectedUser(user);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="popup-container flex-row">
      <div className="black-window flex-column message-popup-container">
        <div className="message-window-header flex-row">
          <div className="flex-row h2-svg-message-popup">
            <button
              className="svg-btn-message-popup"
              onClick={closeWriteMessage}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </button>
            <h2>New Message</h2>
          </div>
          <button
            className="next-btn-message-popup radius"
            onClick={handleShowConversation}
          >
            Next
          </button>
        </div>
        <div className="search-message-popup flex-row">
          <span className="search-icon-wrapper">
            <svg
              className="search-svg-message-popup"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g>
                <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
              </g>
            </svg>
          </span>
          <form>
            <input
              className="search-ppl-msg-input"
              placeholder="Search people"
              type="text"
              value={query}
              onChange={onChange}
            />
          </form>
        </div>
        {/* Conditionally render the selected user or "Create a group" option */}
        {selectedUser ? (
          <div
            className="flex-row selected-user-container"
            onClick={() => setSelectedUser(null)}
          >
            <img
              src={`http://localhost:3000/uploads/${selectedUser.profile.profilePicture}`}
              className="selected-user-image"
            />
            <div>
              <span>{selectedUser.originalUsername}</span>
            </div>
            <div className="selected-user-x-svg">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </div>
          </div>
        ) : (
          <div
            className="create-group-container flex-row"
            onClick={handleShowCreateGroup}
          >
            <span>
              <svg
                className="grp-svg-msg-popup"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <g>
                  <path d="M12 5c-.83 0-1.5.67-1.5 1.5S11.17 8 12 8s1.5-.67 1.5-1.5S12.83 5 12 5zM8.5 6.5C8.5 4.57 10.07 3 12 3s3.5 1.57 3.5 3.5S13.93 10 12 10 8.5 8.43 8.5 6.5zm-3.25 1c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zm-2.75.75c0-1.52 1.23-2.75 2.75-2.75S8 6.73 8 8.25 6.77 11 5.25 11 2.5 9.77 2.5 8.25zm16.25-.75c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zM16 8.25c0-1.52 1.23-2.75 2.75-2.75s2.75 1.23 2.75 2.75S20.27 11 18.75 11 16 9.77 16 8.25zM12 13c-1.29 0-2.37.54-3.22 1.61C8 15.6 7.4 17.07 7.12 19h9.76c-.27-1.85-.83-3.28-1.57-4.28C14.45 13.58 13.34 13 12 13zm-4.78.36C8.41 11.86 10.06 11 12 11c2.02 0 3.7.92 4.91 2.53 1.18 1.57 1.88 3.77 2.09 6.39l.08 1.08H4.92L5 19.92c.22-2.7.96-4.97 2.22-6.56zM2.95 16c.16-.55.39-.97.66-1.28.4-.46.94-.72 1.64-.72v-2c-1.26 0-2.35.49-3.15 1.4-.78.89-1.22 2.11-1.35 3.51L.65 18H4v-2H2.95zm18.95-2.6c.78.89 1.22 2.11 1.35 3.51l.1 1.09H20v-2h1.05c-.16-.55-.39-.97-.66-1.28-.4-.46-.94-.72-1.64-.72v-2c1.26 0 2.35.49 3.15 1.4z"></path>
                </g>
              </svg>
            </span>
            <div>Create a group</div>
          </div>
        )}
        {/* Render the user search results */}
        {results.length > 0 && (
          <div className="flex-column">
            {results.map((user) => {
              return (
                <div
                  key={user._id}
                  className="flex-row dropdown-user-msg-popup"
                  onClick={() => addUser(user)}
                >
                  <img
                    src={`http://localhost:3000/uploads/${user.profile.profilePicture}`}
                    className="user-search-image-dropdown"
                  />
                  <div className="flex-column">
                    <span>{user.originalUsername}</span>
                    <span className="grey-color">
                      @{user.formattedUsername}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {showCreateGroup && (
          <CreateGroupPopup closeWriteMessage={closeWriteMessage} />
        )}
      </div>
    </div>
  );
}

export default WriteMessageBtn;
