/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import '../styles/popup.css'
import '../styles/editProfilePopup.css'
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

function EditProfilePopup({ onClose }) {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
    const [formattedUsername, setFormattedUsername] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [profileBio, setProfileBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');

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

    useEffect(() => {
        if (backgroundImage) {
            const background_url = URL.createObjectURL(backgroundImage);
            setBackgroundImageUrl(background_url);
            console.log('Background Image selected:', backgroundImage);
        }
    }, [backgroundImage]);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleBackgroundFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setBackgroundImage(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        document.getElementById('profilePicture').click();
    };
    const handleBackgroundUploadClick = () => {
        document.getElementById('backgroundHeaderImage').click();
    };

    const handleDeleteClick = () => {
        setSelectedImage(null);
        setImageUrl('');
    }

    const handleDeleteBackgroundClick = () => {
        setBackgroundImage(null);
        setBackgroundImageUrl('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (selectedImage) {
            formData.append('profilePicture', selectedImage);
        }
        if (backgroundImage) {
            formData.append('backgroundHeaderImage', backgroundImage);
        }
        formData.append('name', originalName);
        formData.append('bio', profileBio);
        formData.append('location', location);
        formData.append('website', website);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in local storage.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3000/profile/${formattedUsername}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            onClose();
            navigate('/profile');
        } catch (error) {
            console.error('Error uploading profile data:', error);
        }
    }

    return(
        <div className="edit-popup-container flex-row">
            <div className="edit-black-window flex-column">
                <div className='edit-popup-header flex-row'>
                    <div className='edit-popup-close-header flex-row'>
                        <button className='radius edit-popup-close-button' onClick={onClose}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>
                        </button>                    
                        <span>Edit profile</span>
                    </div>
                    <div className='edit-popup-save-btn flex-column'>
                        <button className='radius' onClick={handleSubmit}>Save</button>
                    </div>
                </div>
                <div className='uploads-container'
                    style={{ 
                        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' }}>
                        {!backgroundImage ? (
                        <button className='upload-photo-btn' onClick={handleBackgroundUploadClick}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path></g></svg>
                        </button>
                    ) : (
                        <div className='button-container edit-popup-btn-container flex-row'>
                            <button className='upload-photo-btn' onClick={handleDeleteBackgroundClick}>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>                                
                            </button>
                        </div>
                    )}
                    <input type="file"
                        id="backgroundHeaderImage"
                        style={{ display: 'none' }}
                        onChange={handleBackgroundFileChange}
                    />
                </div>
                <div className='edit-popup-photo-upload-frame flex-row'
                    style={{ 
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' }}>
                    {!selectedImage ? (
                        <button className='upload-photo-btn edit-popup-uploader-picture' onClick={handleUploadClick}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path></g></svg>
                        </button>
                    ) : (
                        <div className='button-container flex-row'>
                            <button className='upload-photo-btn edit-popup-uploader-picture' onClick={handleDeleteClick}>
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
                <form className='flex-column edit-popup-form'>
                    <input placeholder="Name" className='edit-popup-name-input' value={originalName} onChange={(e) => setOriginalName(e.target.value)} ></input>
                    <textarea placeholder='Bio' className='edit-popup-bio-input' value={profileBio} onChange={(e) => setProfileBio(e.target.value)} ></textarea>
                    <input placeholder='Location' className='edit-popup-location-input' value={location} onChange={(e) => setLocation(e.target.value)} ></input>
                    <input placeholder='Website' className='edit-popup-website-input' value={website} onChange={(e) => setWebsite(e.target.value)} ></input>
                </form>
            </div>
        </div>
    )
}

export default EditProfilePopup;