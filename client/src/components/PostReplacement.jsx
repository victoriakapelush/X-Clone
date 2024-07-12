/* eslint-disable react/no-unescaped-entities */
import '../styles/postreplacement.css'
import { useState } from 'react';
import RandomPosts from './RandomPosts.jsx'

function PostReplacement() {
    const [showPosts, setShowPosts] = useState(false);

    const handleButtonClick = () => {
        setShowPosts(true);
    };

    return (
        <div className='flex-row grok-page-container'>
            {!showPosts ? (
            <div className='flex-column grok-middle-of-page border-top'>
                <h1>Welcome to X!</h1>
                <p>This is the best place to see what’s happening in your world. Find some people and topics to follow now.</p>
                <button id="post-replace-btn" onClick={handleButtonClick}>Let's go</button>          
            </div>
            ) : (
            <RandomPosts />
            )}  
        </div>
    )
}

export default PostReplacement;