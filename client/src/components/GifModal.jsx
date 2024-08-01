/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/topost.css';
import '../styles/gifModal.css';

const GifModal = ({ isOpen, onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const [gifs, setGifs] = useState([]);

    const handleGifSearch = async () => {
        if (!query) return;

        try {
            const response = await axios.get('http://localhost:3000/api/gifs/search', { params: { query } });
            setGifs(response.data);
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };

    const handleGifClick = (gifUrl) => {
        onSelect(gifUrl);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            fetchRandomGifs();
        }
    }, [isOpen]);

    const fetchRandomGifs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/gifs/random', { params: { limit: 10 } });
            setGifs(response.data);
        } catch (error) {
            console.error('Error fetching random GIFs:', error);
        }
    };

    return (
        isOpen && (
            <div className="topost-popup-container flex-column">
            <div className="topost-black-window flexible-size flex-column">
            <div className="gif-modal">
                <div className="modal-content">
                    <button onClick={onClose}>Close</button>
                    <div>
                        <input
                            type="text"
                            value={query}
                            id="gif"
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for GIFs"
                        />
                        <button onClick={handleGifSearch}>
                            <svg className='upload-pic radius' viewBox="0 0 24 24" aria-hidden="true">
                                <g>
                                    <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                    <div className="gif-list">
                        {gifs.map((gif) => (
                            gif.images ? (
                                <img
                                    key={gif.id}
                                    src={gif.images.original.url}
                                    alt={gif.title}
                                    className="gif-item"
                                    onClick={() => handleGifClick(gif.images.original.url)}
                                />
                            ) : (
                                <div key={gif.id} className="gif-placeholder"> 
                                    GIF not available
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
            </div>
            </div>
        )
    );
};

export default GifModal;
