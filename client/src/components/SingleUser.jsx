/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useState } from "react";
import useFollow from "./FollowUnfollowHook";
import ProfilePopup from "./ProfilePopup";

const SingleUser = ({ user }) => {
  const { isFollowing, handleFollow } = useFollow(user);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <div className="who-tofollow-container flex-column">
      <div className="who-tofollow-profile-box flex-row">
        <Link key={user.id} to={`/profile/${user.formattedUsername}`}>
          <div className="who-to-follow-single-user flex-row">
            <div className="who-tofollow-image-box">
              {user.profile.profilePicture ? (
                <img
                  src={`http://localhost:3000/uploads/${user.profile.profilePicture}`}
                />
              ) : (
                <div className="no-profile-picture"></div>
              )}
            </div>
            <div className="flex-column who-tofollow-name-box">
              <span className="who-tofollow-namelink">
                {user.originalUsername}
              </span>
              <span className="who-tofollow-iglink">
                @{user.formattedUsername}
              </span>
            </div>
          </div>
        </Link>
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
  );
};

export default SingleUser;
