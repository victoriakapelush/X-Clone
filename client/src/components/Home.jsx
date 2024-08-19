/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import defaultProfileImage from "../assets/images/defaultProfileImage.jpg";
import HomeNav from "./HomeNav";
import HomeExtra from "./HomeExtra";
import PopupWindow from "./PopupWindow";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PostReplacement from "./PostReplacement.jsx";
import RandomPosts from "./RandomPosts.jsx";
import GifModal from "./GifModal";
import EmojiPicker, { Theme } from "emoji-picker-react";

function Home() {
  const [userData, setUserData] = useState(null);
  const [randomUser, setRandomUser] = useState(null);
  const [activeTab, setActiveTab] = useState("following");
  const [formattedUsername, setFormattedUsername] = useState("");
  const [text, setText] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [showGifModal, setShowGifModal] = useState(false);
  const [selectedGif, setSelectedGif] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { username } = useParams();
  const token = localStorage.getItem("token");
  const [userProfileData, setUserProfileData] = useState(null);

  const handleButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [showPopup, setShowPopup] = useState(() => {
    const savedPopupState = localStorage.getItem("showPopup");
    return savedPopupState === "false" ? false : true;
  });

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
    document.getElementById("topost-insert-image").style.display = "block";
  };
  const handleUploadClick = (e) => {
    e.preventDefault();
    document.getElementById("image").click();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("showPopup", false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const decodedUsername = decoded.originalUsername
            .toLowerCase()
            .replace(/\s+/g, "");
          setFormattedUsername(decodedUsername);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const showPopup = localStorage.getItem("showPopup");
        if (showPopup === true) {
          setShowPopup(false);
        }
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/profile/${formattedUsername}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(response.data.userProfile);
        setRandomUser(response.data.randomUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (formattedUsername !== "") {
      getUserData();
    }
  }, [formattedUsername]);

  useEffect(() => {
    document.title = "Home / X";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl && !selectedGif) {
      setError("Please enter some text, upload an image or a gif.");
      return;
    }
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("text", text);
      formData.append("image", profileImage);
      formData.append("gif", selectedGif);

      const response = await axios.post(
        `http://localhost:3000/api/profile/post/${formattedUsername}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status >= 200 && response.status < 300) {
        setText("");
        setImageUrl("");
        setProfileImage(null);
        setSelectedGif("");
        document.getElementById("topost-insert-image").style.display = "none";
      } else {
        console.error("Error creating a post:", response);
      }
    } catch (error) {
      console.error("Error creating a post:", error);
    }
  };

  const handleGifSelect = (gifUrl) => {
    setSelectedGif(gifUrl);
  };

  const fetchUserProfileData = async () => {
    if (!token) {
      console.error("No token found.");
      return;
    }
    try {
      if (!token) {
        console.error("No token found in local storage.");
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/home/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.data) {
        console.error("User data not found in response:", response.data);
        return;
      }
      setUserProfileData(response.data.userProfile);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserProfileData();
  }, [username]);

  return (
    <div className="flex-row home-container">
      <HomeNav />
      {showPopup ? (
        <PopupWindow onClose={handleClosePopup} onSave={handleClosePopup} />
      ) : (
        <div className="profile-center">
          <div className="flex-row mini-header-btns-container">
            <div
              className={`mini-header-btn ${activeTab === "foryou" ? "active" : ""}`}
            >
              <div className="blue-underline flex-column">
                <Link
                  to="/home"
                  className={`for-you-tab ${activeTab === "foryou" ? "active" : ""}`}
                  onClick={() => handleTabChange("foryou")}
                >
                  For you
                </Link>
              </div>
            </div>
            <div
              className={`mini-header-btn ${activeTab === "following" ? "active" : ""}`}
            >
              <div className="blue-underline flex-column">
                <Link
                  to="/home"
                  className={`for-you-tab ${activeTab === "following" ? "active" : ""}`}
                  onClick={() => handleTabChange("following")}
                >
                  Following
                </Link>
              </div>
            </div>
          </div>
          <div className="create-new-post-window">
            <div className="create-new-post-window-container flex-row">
              <Link to={`/profile/${formattedUsername}`}>
                {userData && userData.profile.profilePicture ? (
                  <img
                    className="profile-pic"
                    src={`http://localhost:3000/uploads/${userData.profile.profilePicture}`}
                    alt="Profile Picture"
                  />
                ) : (
                  <img
                    className="profile-pic"
                    src={defaultProfileImage}
                    alt="Default Profile Picture"
                  />
                )}
              </Link>
              <div className="form-container-new-post">
                <form onSubmit={handleSubmit}>
                  <textarea
                    className="post-textarea"
                    placeholder="What is happening?!"
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                  <div
                    className="topost-insert-image"
                    id="topost-insert-image"
                    style={{
                      display: imageUrl || selectedGif ? "block" : "none",
                      backgroundImage: imageUrl
                        ? `url(${imageUrl})`
                        : `url(${selectedGif})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "200px",
                      width: "100%",
                    }}
                  >
                    {selectedGif && (
                      <img
                        src={selectedGif}
                        alt="Selected GIF"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-row button-and-upload-pic">
                    <div className="upload-pic-container">
                      <button
                        onClick={handleUploadClick}
                        className="hover-effect"
                        data-username="Media"
                      >
                        <svg
                          className="upload-pic radius"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <g>
                            <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                          </g>
                        </svg>
                      </button>
                      <input
                        type="file"
                        id="image"
                        onChange={handleProfileImageChange}
                        style={{ display: "none" }}
                      />
                      <button
                        onClick={() => setShowGifModal(true)}
                        className="hover-effect"
                        data-username="GIF"
                      >
                        <svg
                          className="upload-pic radius"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <g>
                            <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                          </g>
                        </svg>
                      </button>
                      <GifModal
                        isOpen={showGifModal}
                        onClose={() => setShowGifModal(false)}
                        onSelect={handleGifSelect}
                      />
                      <input
                        id="gif"
                        onChange={handleProfileImageChange}
                        style={{ display: "none" }}
                      />
                      <button
                        onClick={handleButtonClick}
                        className="hover-effect"
                        data-username="Emoji"
                      >
                        <svg
                          className="upload-pic radius"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <g>
                            <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                          </g>
                        </svg>
                      </button>
                    </div>
                    <button
                      className="new-post-btn radius smaller-size"
                      type="submit"
                    >
                      Post
                    </button>
                  </div>
                </form>
                {showEmojiPicker && (
                  <EmojiPicker
                    theme={Theme.DARK}
                    style={{ position: "absolute" }}
                    onEmojiClick={onEmojiClick}
                  />
                )}
              </div>
            </div>
          </div>
          {activeTab === "foryou" && (
            <div className="home-profile-posts">
              <RandomPosts />
            </div>
          )}
          {activeTab === "following" && (
            <div className="home-profile-following-posts">
              <PostReplacement />
            </div>
          )}
        </div>
      )}
      {!showPopup && <HomeExtra randomUser={randomUser} />}
    </div>
  );
}

export default Home;
