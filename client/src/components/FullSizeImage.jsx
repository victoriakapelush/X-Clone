/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/fullSizeImage.css';
import React, { useEffect, useRef } from 'react';

function FullSizeImage({ imageUrl, onClick, imageType }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClick();
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [onClick]);

    return(
        <div className="popup-container flex-row">
            <div className={`modal-content ${imageType}`} ref={modalRef}>                
                <img src={imageUrl} alt="Full Screen" className="full-screen-image" />
            </div>
        </div>
    )
}

export default FullSizeImage;
