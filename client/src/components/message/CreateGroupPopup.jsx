/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

function CreateGroupPopup() {
    const history = useHistory();

  const handleButtonClick = () => {
    // Close the message popup    
    // Navigate to the previous page
    history.goBack();
  };

  return (
    <div className="popup-container flex-row">
      <div className="black-window flex-column message-popup-container">
        <div className="message-window-header flex-row">
          <div className="flex-row h2-svg-message-popup">
            <button className="svg-btn-message-popup" onClick={handleButtonClick}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
            </button>
            <div className="flex-column cre-grp-add-ppl">
                <h2>Create a group</h2>
                <span>Add people</span>
            </div>
          </div>
          <button className="next-btn-message-popup radius">Next</button>
        </div>
        <div className="search-message-popup flex-row">
          <span className="search-icon-wrapper">
            <svg className="search-svg-message-popup" viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
              </g>
            </svg>
          </span>
          <input className="search-ppl-msg-input" placeholder="Search people" />
        </div>
      </div>
    </div>
  );
}

export default CreateGroupPopup;