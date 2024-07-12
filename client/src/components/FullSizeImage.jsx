/* eslint-disable react/prop-types */
import '../styles/fullSizeImage.css';

function FullSizeImage({handleCloseImage, profileData}) {
    return(
        <div className="popup-container flex-row">
            <div className="modal-content">
                <button className="close-button" onClick={handleCloseImage}></button>
                <img src={`http://localhost:3000/uploads/${profileData.backgroundHeaderImage}`} alt="Full Screen" className="full-screen-image" />
            </div>
        </div>
    )
}

export default FullSizeImage;
