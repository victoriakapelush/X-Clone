/* eslint-disable react/prop-types */
import '../styles/profilePopup.css';
import '../styles/popup.css';
import '../styles/editProfilePopup.css';
import '../styles/topost.css';

function ProfilePopup({ userData, position }) {
    const tooltipHeight = 80; 
    const tooltipWidth = 200; 

    console.log(userData)

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
        }}>
      <div className="tooltip-content flex-column">
        <img className="profile-pic tooltip-profile-pic" src={`http://localhost:3000/uploads/${userData?.profile.profilePicture}`}/>
        <div className="tooltip-info">
          <span className="tooltip-name">{userData?.profile.updatedName}</span>
          <span className="tooltip-username">@{userData?.formattedUsername}</span>
        </div>
        <span className='tooltip-bio'>{userData?.profile.profileBio}</span>
        <div className='tooltip-following-info flex-row'>
          <span className="tooltip-username"><span className='tooltip-following-count'>{userData?.profile.followers || 0}</span> followers</span>
          <span className="tooltip-username"><span className='tooltip-following-count'>{userData?.profile.following || 0}</span> following</span>
        </div>
      </div>
    </div>
    );
}

export default ProfilePopup;
