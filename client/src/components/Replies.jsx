/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TokenContext from "./TokenContext";
import PostAndComment from "./PostAndComment";
import useFollow from "./FollowUnfollowHook";
import "../styles/replies.css";
import "../styles/profile.css";
import { format, formatDistanceToNow } from "date-fns";
import default_user from "../assets/icons/default_user.png";

function Replies({ randomUser }) {
  const { formattedUsername, token } = useContext(TokenContext);
  const [reply, setReplies] = useState([]);
  const { username } = useParams();

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

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/profile/replies/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setReplies(response.data.posts);
      } catch (err) {
        console.error("Error fetching replies: ", err);
      }
    };

    fetchReplies();
  }, [username, token]);

  const userFollowStates = randomUser?.slice(0, 3).map((user) => ({
    user,
    ...useFollow(user),
  }));

  return (
    <div className="profile-right replies-profile-right flex-column no-gap-replies">
      {reply && reply.length > 0 ? (
        reply.map((reply, index) => {
          const formattedTime = formatPostTime(reply.time);
          return (
            <div key={reply._id}>
              <PostAndComment
                index={index}
                reply={reply}
                formattedTime={formattedTime}
              />
            </div>
          );
        })
      ) : (
        <div className="flex-column replies-container new-post-random-users">
          <div className="premium-header replies-header-who-tofollow">
            <h3>Who to follow</h3>
          </div>
          {userFollowStates &&
            userFollowStates.map(({ user, isFollowing, handleFollow }) => (
              <div key={user._id}>
                <div className="who-tofollow-container replies-who-to-follow-container flex-column">
                  <div
                    className="who-tofollow-profile-box flex-row"
                    id="replies-who-to-follow"
                  >
                    <div className="who-to-follow-single-user flex-row">
                      <div className="who-tofollow-image-box">
                        {user.profile.profilePicture ? (
                          <img
                            src={user.profile.profilePicture}
                            alt={`${user.originalUsername}'s profile`}
                          />
                        ) : (
                          <img className="profile-pic" src={default_user}></img>
                        )}
                      </div>
                      <div className="flex-column who-tofollow-name-box">
                        <Link
                          to={`/profile/${user.formattedUsername}`}
                          className="who-tofollow-namelink"
                        >
                          {user.originalUsername}
                        </Link>
                        <span className="who-tofollow-iglink">
                          @{user.formattedUsername}
                        </span>
                      </div>
                    </div>
                    <div className="who-tofollow-btn">
                      <button
                        className={`radius ${isFollowing ? "unfollow-button" : ""}`}
                        onClick={() => handleFollow(user._id)}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Replies;
