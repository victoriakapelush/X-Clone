/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "../styles/postreplacement.css";
import "../styles/connectPeople.css";
import { Link } from "react-router-dom";
import useFollow from "./FollowUnfollowHook";

function FollowersData({ userData, follower }) {
  const { isFollowing, handleFollow } = useFollow(follower);

  useEffect(() => {
    document.title = `People following ${userData.originalUsername} (@${userData.formattedUsername}) / X`;
  }, [userData]);

  return (
    <div className="brief-profile-container flex-column">
      <div className="brief-profile-box flex-row">
        <div className="brief-profile-single-user flex-row">
          <div className="who-tofollow-image-box">
            <img
              src={`http://localhost:3000/uploads/${follower.profile.profilePicture}`}
            />
          </div>
          <div className="flex-column brief-profile-name-box">
            <Link
              to={`/profile/${follower.formattedUsername}`}
              className="who-tofollow-namelink"
            >
              {follower.originalUsername}
            </Link>
            <span className="who-tofollow-iglink">
              @{follower.formattedUsername}
            </span>
          </div>
        </div>
        <div className="who-tofollow-btn">
          <button
            className={`radius ${isFollowing ? "unfollow-button" : ""}`}
            onClick={() => handleFollow(follower._id)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
      <span className="brief-profile-bio">{follower.profile.profileBio}</span>
    </div>
  );
}

export default FollowersData;
