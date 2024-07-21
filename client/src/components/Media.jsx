/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TokenContext from './TokenContext';
import '../styles/highlights.css';

function Media() {

  return (
    <div className='flex-column highlights-container'>
        <h1>Lights, camera … attachments!</h1>
        <p>When you post photos or videos, they will show up here.</p>
    </div>
  );
}

export default Media;
