/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../../styles/popup.css";
import "../../styles/editProfilePopup.css";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";
import TokenContext from "../TokenContext";

function AddList({ onUpdate }) {
  const [imageUrl, setImageUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const { userData } = useContext(UserContext);
  const [lists, setLists] = useState([]);
  const [showListPopup, setShowListPopup] = useState(true);
  const { token, formattedUsername } = useContext(TokenContext);
  const { listId } = useParams();
  const navigate = useNavigate();

  // Close "create a new list" window
  const closePopup = () => {
    setShowListPopup(false);
  };

  // Delete image from List Profile
  const handleDeleteBackgroundClick = () => {
    setLists((prevData) => ({
      ...prevData,
      image: null,
    }));
    setBackgroundImageUrl("");

    // Reset the file input
    if (backgroundImageInputRef.current) {
      backgroundImageInputRef.current.value = ""; // Resetting the value of file input
    }
  };

  const handleBackgroundUploadClick = () => {
    document.getElementById("backgroundHeaderImage").click();
  };

  const handleBackgroundImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLists((prevData) => ({
        ...prevData,
        image: file,
      }));
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
      setBackgroundImageUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLists((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", lists.name);
      formData.append("description", lists.description);
      if (lists.image) {
        formData.append("image", lists.image);
      }
      const response = await axios.put(
        `http://localhost:3000/api/lists/update/${listId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // Update local state with the new list data
      onUpdate();

      setShowListPopup(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/lists/delete/${listId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Update local state with the new list data
      onUpdate();
      navigate("/lists");

      setShowListPopup(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <>
      {showListPopup && (
        <div className="edit-popup-container flex-row">
          <div className="edit-black-window flex-column">
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
                <span>Edit List</span>
              </div>
              <div className="edit-popup-save-btn flex-column">
                <button className="radius" onClick={handleUpdate}>
                  Save
                </button>
              </div>
            </div>
            <div
              className="uploads-container"
              style={{
                backgroundImage: backgroundImageUrl
                  ? `url(${backgroundImageUrl})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {lists && lists.image ? (
                <div className="button-container edit-popup-btn-container flex-row">
                  <button
                    className="upload-photo-btn"
                    onClick={handleDeleteBackgroundClick}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <g>
                        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                      </g>
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="upload-photo-btn"
                  onClick={handleBackgroundUploadClick}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                    </g>
                  </svg>
                </button>
              )}
              <input
                type="file"
                id="backgroundHeaderImage"
                onChange={handleBackgroundImageChange}
                style={{ display: "none" }}
              />
            </div>
            <form
              className="flex-column edit-popup-form"
              encType="multipart/form-data"
            >
              <input
                placeholder="Name"
                className="edit-popup-name-input"
                name="name"
                onChange={handleChange}
              />
              <textarea
                placeholder="Description"
                className="edit-popup-bio-input"
                name="description"
                onChange={handleChange}
              />
            </form>
            <div className="del-list-btn flex-row" onClick={handleDelete}>
              Delete List
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddList;
