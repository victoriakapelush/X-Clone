/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useNavigate, useParams } from "react-router-dom";
import back from "../../assets/icons/back.png";
import HomeNav from "../HomeNav";
import HomeExtra from "../HomeExtra";
import UserContext from "../UserContext";
import { useContext, useEffect, useState } from "react";
import TokenContext from "../TokenContext";
import axios from "axios";
import EditList from "./EditList";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useGenerateLink from "../GenerateLink";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRepost from "../RepostHook";
import { format, formatDistanceToNow } from "date-fns";

function SingleList() {
  const navigate = useNavigate();
  const { listId } = useParams();
  const { randomUser } = useContext(UserContext);
  const { token } = useContext(TokenContext);
  const [list, setList] = useState();
  const [showListPopup, setShowListPopup] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { generatePostLink } = useGenerateLink();
  const [copied, setCopied] = useState(false);
  const { repostPost, repostedPosts, loading, error } = useRepost();
  const [reposted, setReposted] = useState(false);
  const { userData } = useContext(UserContext);

  const handleRepost = async (postId) => {
    try {
      await repostPost(postId);
      setReposted(true);
    } catch (err) {
      console.error("Failed to repost:", err);
    }
  };

  const handleCopy = (postId, username) => {
    console.log(`Copied post link: ${postId}, username: ${username}`);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePopup = () => {
    setShowListPopup((prevState) => !prevState);
  };

  useEffect(() => {
    document.title = `${list?.name} by @${list?.owner.formattedUsername} / X`;
  }, [list?.name, list?.owner.formattedUsername]);

  // Fetch all data from a certain list
  const fetchListData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/lists/show/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setList(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchListData();
  }, [listId, token]);

  return (
    <div className="flex-row profile-page">
            <ToastContainer
        position="bottom-center"
        autoClose={1000} // This will close the toast after 1 second
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <HomeNav />
      <div className="profile-container list-profile-page flex-column">
        <header className="flex-row">
          <Link
            onClick={() => navigate(-1)}
            className="flex-row profile-icon-back"
          >
            <img src={back} />
          </Link>
          <div className="flex-column profile-header-name">
            <h2>{list?.name}</h2>
            <span>@{list?.owner.formattedUsername}</span>
          </div>
        </header>
        {list && list.image ? (
          <div className="background-image-holder">
            <img src={`http://localhost:3000/uploads/${list.image}`} />
          </div>
        ) : (
          <div className="defaul-profile-image-background"></div>
        )}
        <div className="flex-column list-descr-container">
          <h2>{list?.name}</h2>
          <span>{list?.description}</span>
          <Link className="flex-row">
            <img
              className="list-owner-img radius"
              src={`http://localhost:3000/uploads/${list?.owner?.profile.profilePicture}`}
            />
            <Link
              to={`/profile/${list?.owner?.formattedUsername}`}
              className="link-user-list"
            >
              {list?.owner?.profile.updatedName}
            </Link>
            <span className="grey-color">
              {" "}
              &nbsp; @{list?.owner?.formattedUsername}
            </span>
          </Link>
          <Link className="members-list-link" to={`/lists/${listId}/members`}>
            {list?.membersCount} <span className="grey-color">members</span>
          </Link>
          <button
            className="list-edit-profile-btn radius"
            onClick={togglePopup}
          >
            Edit List
          </button>
          {showListPopup && (
            <EditList
              closePopup={togglePopup}
              list={list}
              setList={setList}
              onUpdate={fetchListData}
            />
          )}
        </div>
        {list && list.posts.length === 0 ? (
  <div className="list-posts-container flex-column">
    <h1>Waiting for posts</h1>
    <span className="grey-color">
      Posts from people in this List will show up here.
    </span>
  </div>
) : (
  list?.posts.map((post, index) => {
    const postLink = generatePostLink(post._id, post.user.formattedUsername);
        const postTime = post?.time ? new Date(post.time) : null;
        const postTwoLinks = post.repostedFrom
          ? `/${post.repostedFrom.formattedUsername}/status/${post.originalPostId?._id}`
          : `/${userData?.formattedUsername}/status/${post._id}`;
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
    <div key={index} className="post random-post flex-column">
    <Link
      to={`/${post.user.formattedUsername}/status/${post._id}`}
      className="flex-row"
    >
      {post && post.user.profile.profilePicture ? (
        <img
          className="profile-pic"
          src={`http://localhost:3000/uploads/${post.user.profile.profilePicture}`}
        />
      ) : (
        <div className="defaul-profile-image-post"></div>
      )}
      <Link to={postTwoLinks}>
      <div className="flex-column post-box">
        <Link
          to={`/profile/${post.user.formattedUsername}`}
          className="link-to-profile"
        >
          <span className="user-name">
            {post.user?.profile.updatedName}
          </span>{" "}
          <span className="username-name">
            @{post.user?.formattedUsername} · {formattedTime}
          </span>
        </Link>
        {post.text && (
          <p
            className={`post-text ${isExpanded ? "expanded" : ""}`}
            onClick={toggleText}
          >
            {post.text}
          </p>
        )}
        {post.image && (
          <img
            className="post-image"
            src={`http://localhost:3000/uploads/${post.image}`}
          />
        )}
      </div>
      </Link>
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
          className="icon-container color-hover flex-row"
          id="pink-svg"
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
            className="count"
          >
            {post.likeCount}
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
  )})
)}
      </div>
      <HomeExtra randomUser={randomUser} />
    </div>
  );
}

export default SingleList;
