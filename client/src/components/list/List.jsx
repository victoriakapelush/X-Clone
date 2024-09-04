/* eslint-disable no-unused-vars */
import HomeNav from "../HomeNav";
import HomeExtra from "../HomeExtra";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import { useContext, useEffect, useState } from "react";
import TokenContext from "../TokenContext";
import "../../styles/list.css";
import axios from "axios";
import AddListPopup from "./AddListPopup";

function List() {
  const { randomUser } = useContext(UserContext);
  const { formattedUsername, token } = useContext(TokenContext);
  const [lists, setLists] = useState([]);
  const [showListPopup, setShowListPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lists / X";

    // Check if the URL has the hash to open the popup
    if (location.hash === "#create") {
      setShowListPopup(true);
    } else {
      setShowListPopup(false);
    }
  }, [location]);

  const togglePopup = () => {
    setShowListPopup((prevState) => {
      const newState = !prevState;

      if (newState) {
        navigate("#create"); // Add the hash to the URL
      } else {
        navigate("/lists"); // Remove the hash from the URL
      }

      return newState;
    });
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

  return (
    <div className="flex-row profile-page">
      <HomeNav />
      <div className="profile-container list-profile-page flex-column">
        <div className="flex-row lists-btn-name">
          <div className="profile-header-name bookmarks-header flex-column">
            <h2>Lists</h2>
            <span>@{formattedUsername}</span>
          </div>
          {showListPopup && (
            <AddListPopup
              closePopup={togglePopup}
              lists={lists}
              setLists={setLists}
              onUpdate={fetchLists}
            />
          )}
          <div
            className="svg-new-list-create flex-row radius"
            onClick={togglePopup}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
              </g>
            </svg>
          </div>
        </div>
        <div className="bookmarks-search flex-row">
          <div className="bookmarks-input flex-row" contentEditable="true">
            <div className="bookmarks-search-svg-container">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-"></path>
                </g>
              </svg>
            </div>
            <input
              placeholder="Search Lists"
              className="bookmarks-search-text"
            ></input>
          </div>
        </div>
        {lists && lists.length === 0 ? (
          <div className="lists-empty">
            <h2>Your Lists</h2>
          </div>
        ) : (
          <>
            <div className="lists-empty">
              <h2>Your Lists</h2>
            </div>
            {lists.map((list) => (
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
            ))}
          </>
        )}
      </div>
      <HomeExtra randomUser={randomUser} />
    </div>
  );
}

export default List;
