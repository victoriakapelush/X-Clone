/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../styles/popup.css";
import "../styles/editProfilePopup.css";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function EditProfilePopup({
  profileData,
  setProfileData,
  onClose,
  onSave,
  handleCloseImage,
}) {
  const [originalUsername, setOriginalUsername] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [formattedUsername, setFormattedUsername] = useState("");
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const [lastValidName, setLastValidName] = useState(profileData.updatedName);

  useEffect(() => {
    const storedUsername = localStorage.getItem("token");
    if (storedUsername) {
      const decoded = jwtDecode(storedUsername);
      setOriginalUsername(decoded.originalUsername);
      setFormattedUsername(
        decoded.originalUsername.toLowerCase().replace(/\s+/g, ""),
      );
      setProfileData((prevData) => ({
        ...prevData,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "updatedName") {
      if (value.trim()) {
        setProfileData((prevData) => ({
          ...prevData,
          [name]: value.trim(),
        }));
        setLastValidName(value.trim());
      } else {
        // If input is empty, keep the last valid name
        setProfileData((prevData) => ({
          ...prevData,
          [name]: lastValidName,
        }));
      }
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value.trim(),
      }));
    }
  };

  useEffect(() => {
    if (
      profileData.profilePicture &&
      typeof profileData.profilePicture === "string"
    ) {
      setImageUrl(
        `http://localhost:3000/uploads/${profileData.profilePicture}`,
      );
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [profileData.profilePicture, imageUrl]);

  useEffect(() => {
    if (
      profileData.backgroundHeaderImage &&
      typeof profileData.backgroundHeaderImage === "string"
    ) {
      setBackgroundImageUrl(
        `http://localhost:3000/uploads/${profileData.backgroundHeaderImage}`,
      );
    }
    return () => {
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
    };
  }, [profileData.backgroundHeaderImage, backgroundImageUrl]);

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleBackgroundImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prevData) => ({
        ...prevData,
        backgroundHeaderImage: file,
      }));
      if (backgroundImageUrl) {
        URL.revokeObjectURL(backgroundImageUrl);
      }
      setBackgroundImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    document.getElementById("profilePicture").click();
  };

  const handleBackgroundUploadClick = () => {
    document.getElementById("backgroundHeaderImage").click();
  };

  const handleDeleteClick = () => {
    setProfileData((prevData) => ({
      ...prevData,
      profilePicture: null,
    }));
    setImageUrl("");

    // Reset the file input
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = ""; // Resetting the value of file input
    }
  };

  const handleDeleteBackgroundClick = () => {
    setProfileData((prevData) => ({
      ...prevData,
      backgroundHeaderImage: null,
    }));
    setBackgroundImageUrl("");

    // Reset the file input
    if (backgroundImageInputRef.current) {
      backgroundImageInputRef.current.value = ""; // Resetting the value of file input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileBio", profileData.profileBio);
      formData.append("location", profileData.location);
      formData.append("website", profileData.website);
      formData.append("updatedName", profileData.updatedName || lastValidName);
      formData.append("profilePicture", profileData.profilePicture);
      formData.append(
        "backgroundHeaderImage",
        profileData.backgroundHeaderImage,
      );
      const response = await axios.post(
        `http://localhost:3000/profile/${formattedUsername}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      onSave(response.data.profile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="edit-popup-container flex-row">
      <div className="edit-black-window flex-column">
        <div className="edit-popup-header flex-row">
          <div className="edit-popup-close-header flex-row">
            <button
              className="radius edit-popup-close-button"
              onClick={() => onClose(null)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                </g>
              </svg>
            </button>
            <span>Edit profile</span>
          </div>
          <div className="edit-popup-save-btn flex-column">
            <button className="radius" onClick={handleSubmit}>
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
          {profileData && profileData.backgroundHeaderImage ? (
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
        <div
          className="edit-popup-photo-upload-frame flex-row"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {profileData && profileData.profilePicture ? (
            <div className="button-container flex-row">
              <button
                className="upload-photo-btn edit-popup-uploader-picture"
                onClick={handleDeleteClick}
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
              className="upload-photo-btn edit-popup-uploader-picture"
              onClick={handleUploadClick}
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
            id="profilePicture"
            onChange={handleProfileImageChange}
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
            name="updatedName"
            onChange={handleChange}
          />
          <textarea
            placeholder="Bio"
            className="edit-popup-bio-input"
            name="profileBio"
            onChange={handleChange}
          />
          <input
            placeholder="Location"
            className="edit-popup-location-input"
            name="location"
            onChange={handleChange}
          />
          <input
            placeholder="Website"
            className="edit-popup-website-input"
            name="website"
            onChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
}

export default EditProfilePopup;
