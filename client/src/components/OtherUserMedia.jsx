/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/highlights.css';
import { useParams } from 'react-router-dom';

function OtherUserMedia() {
  const [media, setMedia] = useState([]);
  const { username } = useParams(); 

  useEffect(() => {
    const fetchMedia = async () => {
        if (!username) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/profile/media/${username}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        if (response) {
          setMedia(response.data.mediaPosts);
          console.log(response.data)
        } else {
          console.error('Failed to fetch media:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      } 
    };

    fetchMedia();
  }, [username]);

  return (
    media.length === 0 ? (
      <div className='flex-column highlights-container media-top-border'>
        <h1>Lights, camera … attachments!</h1>
        <p>When <span className='username'>@{username}</span> posts photos or videos, they will show up here.</p>
      </div>
    ) : (
      media.map((post, index) => (
          post.image && <img key={index} className='mediapost-image' src={`http://localhost:3000/uploads/${post.image}`} />
))
)
)}

export default OtherUserMedia;