import '../styles/popup.css'
import { useState } from 'react';
import uploadImageUser from '../assets/images/user-icon-upload.png'

function PopupWindow() {
    const [backgroundImage, setBackgroundImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return(
        <div className="popup-container flex-row">
            <div className="black-window flex-column">
                <svg className='popup-image flex-row' viewBox="0 0 15 15" aria-label="X" role="img"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                <div className='popup-text flex-column'>
                    <span className='pick-img-popup-text'>Pick a profile picture</span>
                    <span className='selfie-popup-text'>Have a favorite selfie? Upload it now.</span>
                </div>
                <div className='photo-upload-frame flex-row' style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}>
                    <img src={uploadImageUser}/>
                    <button className='upload-photo-btn'>
                        <svg viewBox="0 0 15 15" aria-hidden="true"><g><path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path></g></svg>
                    </button>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
            </div>
        </div>
    )
}

export default PopupWindow;