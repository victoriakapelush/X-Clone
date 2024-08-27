/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSearchUsers from "./UsersSearch";

function CreateGroupPopup({ closeWriteMessage }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {
    query,
    results,
    loading,
    handleSearch,
    handleChange,
    setQuery,
    setResults,
  } = useSearchUsers();

  const onChange = (e) => {
    handleChange(e);
    handleSearch();
  };

  const addUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setQuery("");
    setResults([]);
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
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
            <div className="flex-column cre-grp-add-ppl">
              <h2>Create a group</h2>
              <span>Add people</span>
            </div>
          </div>
          <button className="next-btn-message-popup radius">Next</button>
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
          <input
            className="search-ppl-msg-input"
            placeholder="Search people"
            value={query}
            onChange={onChange}
          />
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex-row cr-grp-box">
            {selectedUsers.map((user) => (
              <div key={user._id} className="flex-row selected-user-container">
                <div className="flex-row" onClick={() => removeUser(user._id)}>
                  <img
                    src={`http://localhost:3000/uploads/${user.profile.profilePicture}`}
                    className="selected-user-image"
                  />
                  <div>
                    <span>{user.originalUsername}</span>
                  </div>
                  <div className="selected-user-x-svg">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <g>
                        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
      </div>
    </div>
  );
}

export default CreateGroupPopup;
