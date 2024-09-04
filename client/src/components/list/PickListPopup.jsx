/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../../styles/popup.css";
import "../../styles/editProfilePopup.css";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";
import TokenContext from "../TokenContext";
import AddListPopup from "./AddListPopup";

function PickListPopup({ closePopup, currentUser }) {
  const { userData } = useContext(UserContext);
  const [lists, setLists] = useState([]);
  const [showListPopup, setShowListPopup] = useState(true);
  const { token, formattedUsername } = useContext(TokenContext);
  const [showCreateListPopup, setShowCreateListPopup] = useState(false);
  const navigate = useNavigate();

  console.log(currentUser._id);

  const handleCreateListClick = (e) => {
    e.preventDefault();
    setShowCreateListPopup(true);
  };

  // Fetch all existing lists for current user
  const fetchLists = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/lists/${formattedUsername}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setLists(response.data.lists);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [formattedUsername, token]);

  useEffect(() => {
    // Check the hash in the URL to determine if the create list popup should be open
    if (location.hash === "#create") {
      setShowCreateListPopup(true);
    } else {
      setShowCreateListPopup(false);
    }
  }, [location]);

  const toggleCreateListPopup = () => {
    setShowCreateListPopup((prevState) => {
      const newState = !prevState;

      if (newState) {
        navigate("#create"); // Add the hash to the URL
      } else {
        navigate(""); // Remove the hash from the URL
        closePopup(); // Call the closePopup function if you want to close the main popup
      }

      return newState;
    });
  };

  return (
    <>
      {showListPopup && (
        <div className="edit-popup-container flex-row">
          <div className="edit-black-window flex-column diff-flex">
            <div className="edit-popup-header flex-row">
              <div className="edit-popup-close-header flex-row">
                <button
                  className="radius edit-popup-close-button"
                  onClick={closePopup}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                    </g>
                  </svg>
                </button>
                <span>Pick a List</span>
              </div>
            </div>
            {lists && lists.length === 0 ? (
              <div className="lists-empty-popup flex-column">
                <Link
                  to="#create"
                  onClick={handleCreateListClick}
                  className="blue-letters"
                >
                  Create a new List
                </Link>
                {showCreateListPopup && (
                  <AddListPopup
                    closePopup={toggleCreateListPopup}
                    onUpdate={fetchLists}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="lists-empty-popup flex-column">
                  <Link
                    to="#create"
                    onClick={handleCreateListClick}
                    className="blue-letters"
                  >
                    Create a new List
                  </Link>
                  {showCreateListPopup && (
                    <AddListPopup
                      onUpdate={fetchLists}
                      closePopup={toggleCreateListPopup}
                    />
                  )}
                </div>
                {lists.map((list) => (
                  <>
                    <Link
                      key={list._id}
                      to={`/lists/${list._id}`}
                      className="list-post flex-row"
                    >
                      <div className="list-post-box-link">
                        <img
                          src={`http://localhost:3000/uploads/${list.image}`}
                          className="list-img"
                        />
                      </div>
                      <div className="flex-column list-brief-summary">
                        <span>{list.name}</span>
                        <div className="flex-row">
                          <img
                            className="list-owner-img radius"
                            src={`http://localhost:3000/uploads/${list.owner.profile.profilePicture}`}
                          />
                          <span>{list.owner.profile.updatedName} &nbsp;</span>
                          <span className="grey-color">
                            {" "}
                            @{list.owner.formattedUsername}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PickListPopup;
