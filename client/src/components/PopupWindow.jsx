/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import '../styles/popup.css'
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

function PopupWindow({ profileData, setProfileData, onClose, onSave }) {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [formattedUsername, setFormattedUsername] = useState('');

    useEffect(() => {
      const storedUsername = localStorage.getItem('token');
      const decoded = jwtDecode(storedUsername);
      const decodedUsername = decoded.originalUsername.toLowerCase().replace(/\s+/g, '');
      setFormattedUsername(decodedUsername);
    }, []);

    useEffect(() => {
        if (selectedImage) {
            const url = URL.createObjectURL(selectedImage);
            setImageUrl(url);
            console.log('Image selected:', selectedImage);
        }
    }, [selectedImage]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        document.getElementById('profilePicture').click();
    };

    const handleDeleteClick = () => {
        setSelectedImage(null);
        setImageUrl('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            console.error('No image selected.');
            return;
        }

        const formData = new FormData();
        console.log(selectedImage);
        if (selectedImage) {
            formData.append('profilePicture', selectedImage);
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3000/home/${formattedUsername}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            onClose();
            navigate('/home');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    }

    return(
        <div className="popup-container flex-row">
            <div className="black-window flex-column">
                <div className='svg-text-wrap-top flex-column'>
                    <svg className='popup-image flex-row' viewBox="0 0 15 15" aria-label="X" role="img"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                    <div className='popup-text flex-column'>
                        <span className='pick-img-popup-text'>Pick a profile picture</span>
                        <span className='selfie-popup-text'>Have a favorite selfie? Upload it now.</span>
                    </div>
                </div>
                <div className='photo-upload-frame flex-row'
                    style={{ 
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' }}>
                    {!selectedImage ? (
                        <button className='upload-photo-btn' onClick={handleUploadClick}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path></g></svg>
                        </button>
                    ) : (
                        <div className='button-container flex-row'>
                            <button className='upload-photo-btn' onClick={handleDeleteClick}>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>                                
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        id="profilePicture"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
                {!selectedImage ? (
                    <Link to='/home'>
                        <button className='skip-for-now-btn' onClick={onClose}>Skip for now</button>
                    </Link>
                ) : (
                    <Link to='/home'>
                        <button className='skip-for-now-btn' type='submit' onClick={handleSubmit}>Save</button>
                    </Link>
                )}  
            </div>
        </div>
    )
}

export default PopupWindow;