/* eslint-disable react/no-unescaped-entities */
import '../styles/postreplacement.css'
import { Link } from 'react-router-dom';

function PostReplacement() {

    return (
        <div className='flex-row grok-page-container'>
            <div className='flex-column grok-middle-of-page-post-replace border-top'>
                <h1>Welcome to X!</h1>
                <p>This is the best place to see what’s happening in your world. Find some people and topics to follow now.</p>
                <Link to='connect_people'>
                    <button id="post-replace-btn">Let's go</button>
                </Link>
            </div>
        </div>
    )
}

export default PostReplacement;