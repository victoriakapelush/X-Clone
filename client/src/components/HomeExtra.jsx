/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import TokenContext from './TokenContext';
import { fetchTrendingTags } from './TrendingTags';
import SingleTrendingTag from './SingleTrendingTag';
import SingleUser from './SingleUser';

function HomeExtra({ randomUser }) {
    const { formattedUsername, token } = useContext(TokenContext);
    const [trendingTags, setTrendingTags] = useState([]);
    console.log(trendingTags)

    useEffect(() => {
        const loadTrendingTags = async () => {
            try {
                const tags = await fetchTrendingTags(formattedUsername, token);
                console.log('Fetched Tags:', tags);
                setTrendingTags(tags);
            } catch (err) {
                console.log(err.message);
            }
        };

        loadTrendingTags();
    }, [formattedUsername]);

    return (
        <div className='profile-right flex-column profile-right-no-display'>
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>Subscribe to Premium</h3>
            </div>
            <div className='premium-paragraph'>
                <p>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
            </div>
            <button className='new-post-btn radius smaller-size'>Subscribe</button>
        </div>
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>What's happening</h3>
            </div>
            <div className='whatshappenning-container flex-column'>
                    {trendingTags.slice(0, 5).map((tag, index) => (
                        <SingleTrendingTag key={index} tag={tag} />
                    ))}
                </div>
        </div>
        <div className='flex-column premium-subscribe-container'>
            <div className='premium-header'>
                <h3>Who to follow</h3>
            </div>
            {randomUser && randomUser.slice(0, 3).map(user => (
                <SingleUser key={user.id} user={user} randomUser={randomUser}/>
            ))}
        </div>
    </div>
    )
}

export default HomeExtra