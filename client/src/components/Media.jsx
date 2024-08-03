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
        const response = await axios.get(`http://localhost:3000/api/profile/media/${formattedUsername}`, {
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
  }, [formattedUsername]);

  return (
    media.length === 0 ? (
      <div className='flex-column highlights-container'>
        <h1>Lights, camera … attachments!</h1>
        <p>When you post photos or videos, they will show up here.</p>
      </div>
    ) : (
      media.map((post, index) => (
          post.image && <img key={index} className='mediapost-image' src={`http://localhost:3000/uploads/${post.image}`} />
))
)
)}


export default Media;