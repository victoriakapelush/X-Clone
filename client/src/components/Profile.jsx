/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import "../styles/profile.css";
import "../styles/highlights.css";
import default_user from "../assets/icons/default_user.png";
import { useState, useEffect, useContext, useDebugValue } from "react";
import axios from "axios";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import HomeNav from "./HomeNav";
import ToPost from "./ToPost";
import HomeExtra from "./HomeExtra";
import EditProfilePopup from "./EditProfilePopup";
import NewPost from "./NewPost";
import Replies from "./Replies";
import Highlights from "./Highlights";
import Media from "./Media";
import Likes from "./Likes";
import back from "../assets/icons/back.png";
import UseNewPostHook from "./UseNewPostHook";
import DeletePostHook from "./DeletePostHook";
import PickListPopup from "./list/PickListPopup";
import { ToastContainer } from "react-toastify";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import TokenContext from "./TokenContext";
import UserContext from "./UserContext";
import useFollow from "./FollowUnfollowHook";

function Profile() {
  const { token, formattedUsername } = useContext(TokenContext);
  const { username } = useParams();
  const { userData, setUserData } = useContext(UserContext);
  const [randomUser, setRandomUser] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { isFollowing, handleFollow } = useFollow(userData);
  const [showListPopup, setShowListPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [originalUsername, setOriginalUsername] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    profileBio: "",
    location: "",
    website: "",
    updatedName: originalUsername,
    profilePicture: null,
    backgroundHeaderImage: null,
  });
  const {
    postData,
    setPostData,
    bookmarkedStates,
    handleBookmark,
    likedStates,
    handleLike,
    getPost,
  } = UseNewPostHook();
  const [lastValidName, setLastValidName] = useState("");
  const {
    updatedPosts,
    setUpdatedPosts,
    postCount,
    setPostCount,
    handleDeletePost,
  } = DeletePostHook();

  useEffect(() => {
    setUpdatedPosts(postData);
    setPostCount(userData?.profile?.posts);
  }, [postData, setPostCount, setUpdatedPosts, userData]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClosePopup = (updatedProfileData) => {
    setIsPopupOpen(false);
    if (updatedProfileData) {
      setProfileData(updatedProfileData);
      setUserData((prevUserData) => ({
        ...prevUserData,
        profile: { ...prevUserData.profile, ...updatedProfileData },
        post: { ...prevUserData.post },
      }));
    }
  };

  const fetchUserData = async () => {
    try {
      if (token) {
        const response = await axios.get(
          `http://localhost:3000/profile/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        // Set user data
        setUserData({ ...response.data.userProfile });

        // Update document title
        document.title = `${response.data.userProfile.originalUsername} (@${response.data.userProfile.formattedUsername}) / X`;

        // Get profile data
        const profile = response.data.userProfile.profile;

        // Set profile-specific data
        setProfileData({
          profileBio: profile.profileBio || "",
          location: profile.location || "",
          website: profile.website || "",
          updatedName: profile.updatedName || "", // Initial value
          profilePicture: profile.profilePicture || "",
          backgroundHeaderImage: profile.backgroundHeaderImage || "",
        });

        // Set the last valid name
        setLastValidName(profile.updatedName || "");
        setRandomUser(response.data.randomUsers);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  useEffect(() => {
    // Check if the URL has the hash to open the popup
    if (location.hash === "#pick") {
      setShowListPopup(true);
    } else {
      setShowListPopup(false);
    }
  }, [location]);

  const togglePopup = () => {
    setShowListPopup((prevState) => {
      const newState = !prevState;

      if (newState) {
        navigate("#pick"); // Add the hash to the URL
      } else {
        navigate(`/profile/${username}`); // Remove the hash from the URL
      }
      return newState;
    });
  };

  // Get common followers
  const [commonFollowers, setCommonFollowers] = useState([]);
  useEffect(() => {
    const fetchCommonFollowers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/common_followers/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data)
        setCommonFollowers(response.data.commonFollowers);
      } catch (err) {
        console.log(err);
      } 
    };

    fetchCommonFollowers();
  }, [username, token]);

  return (
    <div className="flex-row profile-page">
      {isPopupOpen && (
        <EditProfilePopup
          profileData={profileData}
          setProfileData={setProfileData}
          onClose={handleClosePopup}
          onSave={handleClosePopup}
        />
      )}
      <HomeNav />
      <div className="profile-container">
        <header className="flex-row">
          <Link
            onClick={() => navigate(-1)}
            className="flex-row profile-icon-back"
          >
            <img src={back} />
          </Link>
          <div className="flex-column profile-header-name">
            {profileData && <h2>{profileData.updatedName}</h2>}
            {userData && userData.profile && <span>{postCount} posts</span>}
          </div>
        </header>
        <div className="background-image-holder">
          {profileData && profileData.backgroundHeaderImage ? (
            <img
              src={`http://localhost:3000/uploads/${profileData.backgroundHeaderImage}`}
            />
          ) : (
            <div className="defaul-profile-image-background"></div>
          )}
        </div>
        <div className="profile-photo-container flex-row">
          {profileData && profileData.profilePicture ? (
            <img
              src={`http://localhost:3000/uploads/${profileData.profilePicture}`}
            />
          ) : (
            <img className="defaul-profile-image-profile" src={default_user} />
          )}
          {username === formattedUsername ? (
            <button
              onClick={handleOpenPopup}
              className="edit-profile-btn radius"
            >
              Edit profile
            </button>
          ) : (
            <>
              <button
                className={`edit-profile-btn radius ${isFollowing ? "unfollow-button" : ""}`}
                onClick={() => handleFollow(userData._id)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <Tooltip id="my-tooltip" />
              <div className="other-user-btns flex-row">
                <svg
                  className="white-msg-list"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Send message"
                >
                  <g>
                    <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                  </g>
                </svg>
                {showListPopup && (
                  <PickListPopup
                    closePopup={togglePopup}
                    currentUser={userData}
                  />
                )}
                <svg
                  onClick={togglePopup}
                  className="pink-add-list"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Add/Remove user to/from List"
                >
                  <title>Add/Remove user to/from List</title>
                  <g>
                    <path d="M16 6c0 2.21-1.79 4-4 4S8 8.21 8 6s1.79-4 4-4 4 1.79 4 4zm-.76 8.57l-3.95.58 2.86 2.78-.68 3.92L17 20l3.53 1.85-.68-3.92 2.86-2.78-3.95-.58L17 11l-1.76 3.57zm-.45-3.09c-.89-.32-1.86-.48-2.89-.48-2.35 0-4.37.85-5.86 2.44-1.48 1.57-2.36 3.8-2.63 6.46l-.11 1.09h8.58l.52-2.49-4.05-4.3 5.59-.99.85-1.73z"></path>
                  </g>
                </svg>
              </div>
            </>
          )}
        </div>
        <div className="flex-column personal-info-section">
          {profileData && (
            <span className="profile-user-name">{profileData.updatedName}</span>
          )}
          {userData?.formattedUsername && (
            <span className="user-tag">@{userData?.formattedUsername}</span>
          )}
          {profileData && profileData.profileBio && (
            <p className="user-profile-description">{profileData.profileBio}</p>
          )}
          <div className="flex-row location-date-container">
            {profileData && profileData.location && (
              <>
                <div className="flex-row location-container">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                    </g>
                  </svg>
                  <span>{profileData.location}</span>
                </div>
              </>
            )}
            {profileData && profileData.website && (
              <>
                <div className="flex-row location-container">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>
                    </g>
                  </svg>
                  <span>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      {profileData.website}
                    </a>
                  </span>
                </div>
              </>
            )}
            <div className="flex-row location-container">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
                </g>
              </svg>
              {userData?.profile ? (
                <span>{userData?.profile.registrationDate}</span>
              ) : (
                <span>No registration date available</span>
              )}
            </div>
          </div>
          <div className="flex-row following-container">
            {userData?.profile && (
              <Link
                to={`/${username}/followers?tab=following`}
                className="following-number"
              >
                {userData?.profile.following
                  ? userData?.profile.following
                  : "0"}{" "}
                <span className="following-grey">Following</span>
              </Link>
            )}
            {userData && userData?.profile && (
              <Link
                to={`/${username}/followers?tab=followers`}
                className="following-number"
              >
                {userData?.profile.followers
                  ? userData?.profile.followers
                  : "0"}{" "}
                <span className="following-grey">Followers</span>
              </Link>
            )}
          </div>
          {commonFollowers.length > 0 ? (
        <span className="followed-not">Followed by &nbsp;
          {commonFollowers.map((follower) => (
            <Link key={follower._id} to={`/profile/${follower.formattedUsername}`}>
              <span className="grey-color">@{follower.formattedUsername}&nbsp;</span>
            </Link>
          ))}
        </span>
      ) : (
        <span className="followed-not">
          Not followed by anyone you're following
        </span>
      )}
        </div>
        <nav className="profile-nav flex-row">
          <div className="blue-underline">
            <Link
              className={`profile-nav-link for-you-tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              Posts
            </Link>
          </div>
          <div className="blue-underline">
            <Link
              className={`profile-nav-link for-you-tab ${activeTab === "replies" ? "active" : ""}`}
              onClick={() => handleTabChange("replies")}
            >
              Replies
            </Link>
          </div>
          <div className="blue-underline">
            <Link
              className={`profile-nav-link for-you-tab ${activeTab === "highlights" ? "active" : ""}`}
              onClick={() => handleTabChange("highlights")}
            >
              Highlights
            </Link>
          </div>
          <div className="blue-underline">
            <Link
              className={`profile-nav-link for-you-tab ${activeTab === "media" ? "active" : ""}`}
              onClick={() => handleTabChange("media")}
            >
              Media
            </Link>
          </div>
          <div className="blue-underline">
            <Link
              className={`profile-nav-link for-you-tab ${activeTab === "likes" ? "active" : ""}`}
              onClick={() => handleTabChange("likes")}
            >
              Likes
            </Link>
          </div>
        </nav>
        <div
          className={`profile-post ${activeTab === "media" ? "extra-media-class" : ""}`}
        >
          {activeTab === "posts" && (
            <NewPost
              randomUser={randomUser}
              postData={updatedPosts}
              setPostData={setPostData}
              bookmarkedStates={bookmarkedStates}
              handleBookmark={handleBookmark}
              likedStates={likedStates}
              handleLike={handleLike}
              getPost={getPost}
              userData={userData}
              handleDeletePost={handleDeletePost}
              postCount={postCount}
              setPostCount={setPostCount}
            />
          )}
          {activeTab === "replies" && <Replies randomUser={randomUser} />}
          {activeTab === "highlights" && <Highlights />}
          {activeTab === "media" && <Media />}
          {activeTab === "likes" && <Likes />}
        </div>
      </div>
      <HomeExtra randomUser={randomUser} />
    </div>
  );
}

export default Profile;
