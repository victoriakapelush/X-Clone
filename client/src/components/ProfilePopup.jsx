/* eslint-disable react/prop-types */
import "../styles/profilePopup.css";
import "../styles/popup.css";
import "../styles/editProfilePopup.css";
import "../styles/topost.css";
import { useState, useRef, useEffect } from "react";

function ProfilePopup({ userData, position }) {
  const tooltipRef = useRef(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 200, height: 80 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (tooltipRef.current) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const offset = 10; // The distance (in pixels) from the cursor to the tooltip

  let adjustedY;
  let adjustedX = position.x - tooltipSize.width / 2;

  // Determine whether to position the tooltip above or below the cursor
  if (window.innerHeight - position.y > tooltipSize.height + offset) {
    adjustedY = position.y + offset;
  } else {
    adjustedY = position.y - tooltipSize.height - offset;
  }

  // Ensure the tooltip stays within the left and right edges of the viewport
  if (adjustedX < 10) {
    adjustedX = 10;
  } else if (adjustedX + tooltipSize.width > window.innerWidth - 10) {
    adjustedX = window.innerWidth - tooltipSize.width - 10;
  }

  // Ensure the tooltip stays within the top and bottom edges of the viewport
  if (adjustedY < 10) {
    adjustedY = 10;
  } else if (adjustedY + tooltipSize.height > window.innerHeight - 10) {
    adjustedY = window.innerHeight - tooltipSize.height - 10;
  }

  // Handle mouse leave and enter events
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={`topost-black-window flexible-size flex-column tooltip ${isHovering ? "visible" : "hidden"}`}
      ref={tooltipRef}
      style={{
        top: `${adjustedY}px`,
        left: `${adjustedX}px`,
        position: "fixed",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tooltip-content flex-column">
        <img
          className="profile-pic tooltip-profile-pic"
          src={`https://xsocial.onrender.com/uploads/${userData?.profile.profilePicture}`}
        />
        <div className="tooltip-info">
          <span className="tooltip-name">{userData?.profile.updatedName}</span>
          <span className="tooltip-username">
            @{userData?.formattedUsername}
          </span>
        </div>
        <span className="tooltip-bio">{userData?.profile.profileBio}</span>
        <div className="tooltip-following-info flex-row">
          <span className="tooltip-username">
            <span className="tooltip-following-count">
              {userData?.profile.followers || 0}
            </span>{" "}
            followers
          </span>
          <span className="tooltip-username">
            <span className="tooltip-following-count">
              {userData?.profile.following || 0}
            </span>{" "}
            following
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
