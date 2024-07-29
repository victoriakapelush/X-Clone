/* eslint-disable no-unused-vars */
import '../styles/bookmarks.css';
import '../styles/connectPeople.css';
import HomeNav from './HomeNav';
import HomeExtra from './HomeExtra';
import SingleBookmark from './SingleBookmark';
import { useEffect, useContext } from 'react';
import TokenContext from './TokenContext';
import UserContext from './UserContext';
import DisplayBookmarks from './DisplayBookmarks';

function Bookmarks() {
    const { randomUser } = useContext(UserContext);
    const { bookmarkedPosts, bookmarkedStates, handleBookmark, likedStates, handleLike } = DisplayBookmarks();    
    const { formattedUsername } = useContext(TokenContext);

    useEffect(() => {
        document.title = 'Bookmarks / X';
    });

    return (
        <div className='flex-row profile-page'>
            <HomeNav />
            <div className='connect-center-container flex-column'>
                <div className='profile-header-name bookmarks-header flex-column'>
                    <h2>Bookmarks</h2>
                    <span>@{formattedUsername}</span>
                </div>
                <div className='bookmarks-search flex-row'>
                    <div className='bookmarks-input flex-row' contentEditable="true">
                        <div className='bookmarks-search-svg-container'>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <g>
                                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-"></path>
                                </g>
                            </svg>
                        </div>
                        <input placeholder='Search Bookmarks' className='bookmarks-search-text'></input>
                    </div>
                </div>
                <SingleBookmark 
                    bookmarkedPosts={bookmarkedPosts} 
                    bookmarkedStates={bookmarkedStates} 
                    handleBookmark={handleBookmark} 
                    likedStates={likedStates}
                    handleLike={handleLike}
                />
            </div>
            <HomeExtra randomUser={randomUser} />
        </div>
    );
}

export default Bookmarks;