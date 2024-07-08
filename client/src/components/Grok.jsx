import '../styles/grok.css'
import { useEffect } from 'react';
import HomeExtra from './HomeExtra';
import HomeNav from './HomeNav';

function Grok() {

    useEffect(() => {
        document.title = 'Grok / X'
    }, []);

    return (
        <div className='flex-row grok-page-container'>
            <HomeNav />
            <div className='flex-column grok-middle-of-page'>
                <h1>Grok something</h1>
                <p>Premium subscribers can now use our most advanced AI, Grok, on X.</p>
                <button>Subscribe now</button>
            </div>
            <HomeExtra />
        </div>
    )
}

export default Grok;