/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/topost.css";
import "../styles/gifModal.css";

const GifModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);

  const handleGifSearch = async () => {
    if (!query) return;

    try {
      const response = await axios.get(
        "https://xsocial.onrender.com/api/gifs/search",
        { params: { query } },
      );
      setGifs(response.data);
      setQuery("");
    } catch (error) {
      console.error("Error fetching GIFs:", error);
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
      const response = await axios.get(
        "https://xsocial.onrender.com/api/gifs/random",
        { params: { limit: 10 } },
      );
      setGifs(response.data);
    } catch (error) {
      console.error("Error fetching random GIFs:", error);
    }
  };

  return (
    isOpen && (
      <div className="topost-popup-container flex-column">
        <div className="topost-black-window flexible-size flex-column">
          <div className="gif-modal">
            <div className="modal-content">
              <div className="flex-row gif-modal-x-search">
                <button onClick={onClose} className="gif-modal-close-btn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                    </g>
                  </svg>
                </button>
                <div className="flex-row gif-modal-serach-bar">
                  <div className="bookmarks-search flex-row gif-modal-width-search">
                    <div
                      className="bookmarks-input flex-row"
                      contentEditable="true"
                    >
                      <div className="bookmarks-search-svg-container">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <g>
                            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                          </g>
                        </svg>
                      </div>
                      <input
                        placeholder="Search for GIFs"
                        className="bookmarks-search-text"
                        type="text"
                        value={query}
                        id="gif"
                        onChange={(e) => setQuery(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <button
                    onClick={handleGifSearch}
                    className="gif-modal-serach-btn"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="gif-list">
                {gifs.map((gif) =>
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
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GifModal;
