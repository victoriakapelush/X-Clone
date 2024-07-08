import { useEffect } from 'react';
import HomeExtra from './HomeExtra';
import HomeNav from './HomeNav';

function Premium() {

    useEffect(() => {
        document.title = 'Premium / X'
    }, []);

    return (
        <div className='flex-row grok-page-container'>
            <HomeNav />
            <div className='flex-column grok-middle-of-page border-top'>
                <h1>Upgrade to Premium</h1>
                <p>Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security.</p>
                <button id="post-replace-btn">Subscribe & Pay</button>
            </div>
            <HomeExtra />
        </div>
    )
}

export default Premium;