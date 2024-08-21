/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/profile.css";
import { format, formatDistanceToNow } from "date-fns";
import ReplyPopup from "./ReplyPopup";
import ProfilePopup from "./ProfilePopup";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useGenerateLink from "./GenerateLink";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRepost from './RepostHook';

function NewPost({
  postData,
  bookmarkedStates,
  handleBookmark,
  likedStates,
  handleLike,
  userData,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToPost, setShowToPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { generatePostLink } = useGenerateLink();
  const [copied, setCopied] = useState(false);
  const { repostPost, repostedPosts, loading, error } = useRepost();
  const [reposted, setReposted] = useState(false);

  const handleRepost = async (postId) => {
    try {
      await repostPost(postId);
      setReposted(true);
    } catch (err) {
      console.error('Failed to repost:', err);
    }
  };

  const handleCopy = (postId, username) => {
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPopup = () => {
    setShowToPost(true);
  };

  const handleClosePopup = () => {
    setShowToPost(false);
  };

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePostClick = (post) => {
    setShowToPost(true);
    setSelectedPostId(post);
  };

  const handleMouseOver = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowProfilePopup(true);
  };

  const handleMouseOut = () => {
    setShowProfilePopup(false);
  };

  return (
    <div className="profile-post-new-post">
      {showToPost && (
        <ReplyPopup
          onClose={handleClosePopup}
          onSave={handleClosePopup}
          selectedPostId={selectedPostId}
          postData={postData}
          postId={selectedPostId}
        />
      )}
      {showProfilePopup && (
        <ProfilePopup userData={userData} position={tooltipPosition} />
      )}
      {Array.isArray(postData) && postData.length > 0 ? (
        postData.map((post, index) => {
          const postLink = generatePostLink(
            post._id,
            post.user.formattedUsername,
          );
          const postTime = post?.time ? new Date(post.time) : null;
          let formattedTime = "";

          if (postTime && !isNaN(postTime)) {
            const now = new Date();
            const isRecent = now - postTime < 24 * 60 * 60 * 1000;

            formattedTime = isRecent
              ? formatDistanceToNow(postTime, { addSuffix: true })
              : format(postTime, "MMMM d");
          } else {
            formattedTime = "Invalid date";
          }
          return (
            <div key={index} className="post flex-column">
              {post.repostedFrom && <div className="icon-container flex-row repost-line">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path>
                  </g>
                </svg>
                <div className="repost-name">{post.user.formattedUsername} reposted</div></div>}
                <Link to={`/${post.repostedFrom ? post.repostedFrom.formattedUsername : userData.formattedUsername}/status/${post._id}`}>
                <div className="flex-row">
                  {userData?.profile?.profilePicture ? (
                    <img
                      className="profile-pic"
                      src={`http://localhost:3000/uploads/${userData.profile.profilePicture}`}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    />
                  ) : (
                    <div className="default-profile-image-post"></div>
                  )}
                  <div className="flex-column post-box">
                    <Link
                      className="link-to-profile"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      <span className="user-name">
                        {userData?.profile?.updatedName}{" "}
                      </span>
                      <span className="username-name">
                        @{userData?.formattedUsername} · {formattedTime}
                      </span>
                    </Link>
                    <p
                      className={`post-text ${isExpanded ? "expanded" : ""}`}
                      onClick={toggleText}
                    >
                      {post.text}
                    </p>
                    {post.image && (
                      <img
                        className="post-image"
                        src={`http://localhost:3000/uploads/${post.image}`}
                      />
                    )}
                    {post.gif && (
                      <img
                        className="post-gif"
                        src={post.gif}
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
                    onClick={() => handlePostClick(post)}
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
                    <span className="count">{post.reply}</span>
                  </div>
                </div>
                <div onClick={() => handleRepost(post._id)} disabled={loading}>
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
                    <span className="count">{post.repost}</span>
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
                    className={`icon-container color-hover flex-row ${likedStates[index] ? "liked" : "not-liked"}`}
                    id="pink-svg"
                    onClick={() => handleLike(post._id, index)}
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
                      className={`count ${likedStates[index] ? "liked" : "not-liked"}`}
                    >
                      {post.likeCount}
                    </span>
                  </div>
                </div>
                <div className="save-icons flex-row">
                  <div>
                    <div
                      className={`icon-container bookmark-icon color-hover ${bookmarkedStates[index] ? "bookmarked" : "not-bookmarked"}`}
                      id="save-svg"
                      onClick={() => handleBookmark(post._id, index)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="radius"
                        fill={
                          bookmarkedStates[index]
                            ? "bookmarked"
                            : "not-bookmarked"
                        }
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
                      handleCopy(post._id, post.user.formattedUsername)
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
          );
        })
      ) : (
        <div className="profile-right replies-profile-right flex-column">
          <span className="no-posts-to-display flex-row">
            No posts to display yet.
          </span>
        </div>
      )}
    </div>
  );
}

export default NewPost;
