/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import HomeNav from "./HomeNav";
import "../styles/connectPeople.css";
import back from "../assets/icons/back.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import defaultProfileImage from "../assets/images/defaultProfileImage.jpg";
import GifModal from "./GifModal";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useLikeSinglePost from "./useLikeSinglePost";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useGenerateLink from "./GenerateLink";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PostPage() {
  const navigate = useNavigate();
  const { username, postId } = useParams();
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
  const token = localStorage.getItem("token");
  const [userProfileData, setUserProfileData] = useState(null);
  const [post, setPost] = useState("");
  const { likedStates, handleLikePost, handleLikeReply } = useLikeSinglePost(
    post,
    setPost,
  );
  const { generatePostLink } = useGenerateLink();
  const [copied, setCopied] = useState(false);
  const postLink = generatePostLink(post?._id, post?.user?.formattedUsername);

  const handleCopy = (postId, username) => {
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

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

  const getFirstFewWords = (text, wordCount) => {
    return text.split(" ").slice(0, wordCount).join(" ");
  };

  useEffect(() => {
    if (post && post.text) {
      const firstWords = getFirstFewWords(post.text, 10);
      document.title = `${post.user.originalUsername} on X: "${firstWords}" / X`;
    }
  }, [post]);

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

  useEffect(() => {
    const getPostWithComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/post/${username}/comment/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!response.data || !response.data.post) {
          console.error("User data not found in response:", response.data);
          return;
        }
        setPost(response.data.post);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getPostWithComments();
  }, [username, postId, token]);

  function formatPostTime(postTime) {
    if (!postTime) return "Invalid date";

    const date = new Date(postTime);

    if (isNaN(date)) return "Invalid date";

    const now = new Date();
    const isRecent = now - date < 24 * 60 * 60 * 1000;

    return isRecent
      ? formatDistanceToNow(date, { addSuffix: false })
      : format(date, "MMMM d");
  }

  return (
    <div className="flex-row home-container">
      <HomeNav />
      <div className="connect-center-container flex-column">
        <header className="flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex-row profile-icon-back"
          >
            <img src={back} alt="Back" />
          </button>
          <div className="connect-h2">
            <h2>Post</h2>
          </div>
        </header>
        <div className="flex-column popup-reply-post">
          <div className="flex-row comment-hover">
            <div className="pic-vertical-line-box flex-column">
              {(post.repostedFrom
                ? post.repostedFrom.profile
                : post.user?.profile) && (
                <img
                  className="profile-pic no-bottom-margin"
                  src={`http://localhost:3000/uploads/${(post.repostedFrom ? post.repostedFrom.profile : post.user.profile).profilePicture}`}
                />
              )}
              <div className="vertical-line-reply"></div>
            </div>
            <div className="reply-summary-post flex-column">
              {(post.repostedFrom
                ? post.repostedFrom.profile
                : post.user?.profile) && (
                <span>
                  {post.repostedFrom
                    ? post.repostedFrom.profile.updatedName
                    : post.user.profile.updatedName}
                  <span className="reply-replying-to">
                    {" "}
                    @
                    {post.repostedFrom
                      ? post.repostedFrom.user?.formattedUsername
                      : post.user?.formattedUsername}{" "}
                    · {formatPostTime(post.time)}
                  </span>
                </span>
              )}

              {post && post.text && (
                <span className="reply-post-text">{post.text}</span>
              )}
              {post && post.image && (
                <img
                  className="reply-post-text reply-post-image"
                  src={`http://localhost:3000/uploads/${post.image}`}
                />
              )}
              {post && post.gif && (
                <img
                  className="reply-post-text reply-post-gif"
                  src={post.gif}
                />
              )}
              {(post.repostedFrom ? post.repostedFrom : post.user) && (
                <span className="reply-replying-to">
                  Replying to{" "}
                  <Link
                    to={`/profile/${post.repostedFrom ? post.repostedFrom.formattedUsername : post.user?.formattedUsername}`}
                    className="replying-to-blue"
                  >
                    {" "}
                    @
                    {post.repostedFrom
                      ? post.repostedFrom.formattedUsername
                      : post.user?.formattedUsername}
                  </Link>
                </span>
              )}
            </div>
          </div>
          <div className="flex-row post-icons-container horizontal-line-replies-section">
            <div>
              <div
                className="icon-container color-hover flex-row"
                id="blue-svg"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="radius">
                  <g className="flex-row">
                    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                  </g>
                </svg>
                <span className="count">{post.reply}</span>
              </div>
            </div>
            <div>
              <div
                className="icon-container color-hover flex-row"
                id="green-svg"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="radius">
                  <g>
                    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                  </g>
                </svg>
                <span className="count">0</span>
              </div>
            </div>
            <div>
              <div
                className="icon-container color-hover flex-row"
                id="yellow-svg"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="radius">
                  <g>
                    <path
                      d="M2.01 21L23 12 2.01 3v7l15 2-15 2v7z"
                      transform="rotate(-45 10 12)"
                    ></path>
                  </g>
                </svg>
                <span className="count">0</span>
              </div>
            </div>
            <div>
              <div>
                <div
                  className={`icon-container color-hover flex-row ${likedStates.likes ? "liked" : "not-liked"}`}
                  id="pink-svg"
                  onClick={handleLikePost}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="radius"
                  >
                    <g>
                      <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                    </g>
                  </svg>
                  <span
                    className={`count ${likedStates.likes ? "liked" : "not-liked"}`}
                  >
                    {post.likeCount}
                  </span>
                </div>
              </div>
            </div>
            <div className="save-icons flex-row">
              <div>
                <div
                  className="icon-container bookmark-icon color-hover"
                  id="save-svg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="radius"
                  >
                    <g>
                      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <ToastContainer
                position="bottom-center"
                autoClose={1000}
                hideProgressBar={false}
                closeOnClick
              />
              <CopyToClipboard
                text={postLink}
                onCopy={() =>
                  handleCopy(post._id, post?.user.formattedUsername)
                }
              >
                <div>
                  <div
                    className="icon-container sendpost-icon color-hover"
                    id="send-svg"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="radius"
                    >
                      <g>
                        <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </CopyToClipboard>
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
                    placeholder="Post your reply"
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
          {post && post.totalReplies && post.totalReplies.length > 0 ? (
            post.totalReplies.map((reply) => (
              <div
                key={reply._id}
                className="flex-column comment-hover horizontal-line-replies-section"
              >
                <Link
                  to={`/post/${reply.user.formattedUsername}/status/${reply._id}`}
                >
                  <div className="flex-row top-border-horizontal">
                    <div className="pic-vertical-line-box flex-column">
                      <img
                        className="profile-pic no-bottom-margin"
                        src={`http://localhost:3000/uploads/${reply.user.profile.profilePicture}`}
                      />
                    </div>
                    <div className="reply-summary-post flex-column">
                      <span>
                        {reply.user.profile.updatedName}
                        <span className="reply-replying-to">
                          {" "}
                          @{reply.user.formattedUsername} ·{" "}
                          {formatPostTime(reply.time)}
                        </span>
                      </span>
                      {reply.text && (
                        <span className="reply-post-text">{reply.text}</span>
                      )}
                      {reply.image && (
                        <img
                          className="reply-post-text reply-post-image"
                          src={`http://localhost:3000/uploads/${reply.image}`}
                        />
                      )}
                      {reply.gif && (
                        <img
                          className="reply-post-text reply-post-gif"
                          src={reply.gif}
                        />
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex-row post-icons-container">
                  <div>
                    <div
                      className="icon-container color-hover flex-row"
                      id="blue-svg"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="radius"
                      >
                        <g className="flex-row">
                          <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                        </g>
                      </svg>
                      <span className="count">{reply.reply}</span>
                    </div>
                  </div>
                  <div>
                    <div
                      className="icon-container color-hover flex-row"
                      id="green-svg"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="radius"
                      >
                        <g>
                          <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                        </g>
                      </svg>
                      <span className="count">0</span>
                    </div>
                  </div>
                  <div>
                    <div
                      className="icon-container color-hover flex-row"
                      id="yellow-svg"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="radius"
                      >
                        <g>
                          <path
                            d="M2.01 21L23 12 2.01 3v7l15 2-15 2v7z"
                            transform="rotate(-45 10 12)"
                          ></path>
                        </g>
                      </svg>
                      <span className="count">0</span>
                    </div>
                  </div>
                  <div>
                    <div
                      className={`icon-container color-hover flex-row ${likedStates.repliesLikes?.[reply._id] ? "liked" : "not-liked"}`}
                      id="pink-svg"
                      onClick={() => handleLikeReply(reply._id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="radius"
                      >
                        <g>
                          <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                        </g>
                      </svg>
                      <span
                        className={`count ${likedStates.repliesLikes?.[reply._id] ? "liked" : "not-liked"}`}
                      >
                        {reply.likeCount}
                      </span>
                    </div>
                  </div>
                  <div className="save-icons flex-row">
                    <div>
                      <div
                        className="icon-container bookmark-icon color-hover"
                        id="save-svg"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="radius"
                        >
                          <g>
                            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <ToastContainer
                      position="bottom-center"
                      autoClose={1000}
                      hideProgressBar={false}
                      closeOnClick
                    />
                    <CopyToClipboard
                      text={postLink}
                      onCopy={() =>
                        handleCopy(post._id, post?.user.formattedUsername)
                      }
                    >
                      <div>
                        <div
                          className="icon-container sendpost-icon color-hover"
                          id="send-svg"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="radius"
                          >
                            <g>
                              <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="top-border-horizontal no-comments-yet">
              No comments yet.
            </p>
          )}
        </div>
      </div>
      <div className="profile-right flex-column profile-right-no-display">
        <div className="flex-column premium-subscribe-container">
          <div className="premium-header">
            <h3>Subscribe to Premium</h3>
          </div>
          <div className="premium-paragraph">
            <p>
              Subscribe to unlock new features and if eligible, receive a share
              of ads revenue.
            </p>
          </div>
          <button className="new-post-btn radius smaller-size">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
