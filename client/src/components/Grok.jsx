/* eslint-disable no-unused-vars */
import '../styles/grok.css'
import { useEffect, useContext } from 'react';
import HomeExtra from './HomeExtra';
import HomeNav from './HomeNav';
import UserContext from './UserContext';

function Grok() {
    const {randomUser, setRandomUser} = useContext(UserContext);

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
            <HomeExtra randomUser={randomUser}/>
        </div>
    )
}

export default Grok;