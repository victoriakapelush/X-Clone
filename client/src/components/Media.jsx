/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import '../styles/highlights.css';
import { useParams } from 'react-router-dom';

function Media() {
  const [media, setMedia] = useState([]);
  const { formattedUsername } = useContext(TokenContext);
  const { username } = useParams(); 

  useEffect(() => {
    const fetchMedia = async () => {
        if (!formattedUsername) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/profile/media/${username}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        if (response) {
          setMedia(response.data.mediaPosts);
        } else {
          console.error('Failed to fetch media:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      } 
    };

    fetchMedia();
    console.log(formattedUsername)

  }, [username]);

  return (
    media.length === 0 ? (
      username === formattedUsername ? (        
        <div className='flex-column highlights-container media-top-border'>
        <h1>Lights, camera … attachments!</h1>
        <p>When you post photos or videos, they will show up here.</p>
      </div>
    ) : (
      <div className='flex-column highlights-container media-top-border'>
        <h1>Lights, camera … attachments!</h1>
        <p>When @{username} post photos or videos, they will show up here.</p>
      </div>
    )
  ) : (
      media.map((post, index) => (
          post.image && <img key={index} className='mediapost-image' src={`http://localhost:3000/uploads/${post.image}`} />
))))}

export default Media;