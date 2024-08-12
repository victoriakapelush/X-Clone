/* eslint-disable react/prop-types */
import '../styles/profilePopup.css';
import '../styles/popup.css';
import '../styles/editProfilePopup.css';
import '../styles/topost.css';

function ProfilePopup({ userData, position }) {
    const tooltipHeight = 80; 
    const tooltipWidth = 200; 

    let adjustedY = position.y + 10;
    let adjustedX = position.x + 10;

    if (window.innerHeight - position.y < tooltipHeight + 20) {
        adjustedY = position.y - tooltipHeight - 10; // Move above the cursor
    }

    if (window.innerWidth - position.x < tooltipWidth + 20) {
        adjustedX = position.x - tooltipWidth - 10; // Move to the left of the cursor
    }
    
    return (
        <div className="topost-black-window flexible-size flex-column tooltip"  
        style={{
            top: adjustedY + 'px',
            left: adjustedX + 'px',
            position: 'fixed',
        
        }}
        >
      <div className="tooltip-content">
        <img
          className="tooltip-profile-pic"
          src={`http://localhost:3000/uploads/${userData?.profile.profilePicture}`}
          alt="Profile"
        />
        <div className="tooltip-info">
          <span className="tooltip-name">{userData?.profile.updatedName}</span>
          <span className="tooltip-username">@{userData?.formattedUsername}</span>
        </div>
      </div>
    </div>
    );
}

export default ProfilePopup;
