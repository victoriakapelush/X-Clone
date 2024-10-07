/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "../styles/explore.css";
import "../styles/bookmarks.css";
import "../styles/connectPeople.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import TokenContext from "./TokenContext";
import { fetchTrendingTags } from "./TrendingTags";
import { randomUsers } from "./FetchRandomUsers";
import HomeNav from "./HomeNav";
import SingleTrendingTag from "./SingleTrendingTag";
import SingleUser from "./SingleUser";

function Explore({ user, tag }) {
  const { formattedUsername, token } = useContext(TokenContext);
  const [trendingTags, setTrendingTags] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    document.title = "Explore / X";
  }, []);

  useEffect(() => {
    const loadTrendingTags = async () => {
      try {
        const tags = await fetchTrendingTags(formattedUsername, token);
        console.log("Fetched Tags:", tags);
        setTrendingTags(tags);
      } catch (err) {
        console.log(err.message);
      }
    };

    loadTrendingTags();
  }, [formattedUsername, token]);

  useEffect(() => {
    const loadRandomUsers = async () => {
      try {
        const users = await randomUsers(formattedUsername, token);
        setUsers(users);
      } catch (err) {
        console.log(err.message);
      }
    };

    loadRandomUsers();
  }, [formattedUsername, token]);

  return (
    <div className="flex-row profile-page">
      <HomeNav />
      <div className="connect-center-container flex-column explore-page-middle full-height">
        <div className="bookmarks-search flex-row explore-search-bottom-line">
          <div className="bookmarks-input flex-row" contentEditable="true">
            <div className="bookmarks-search-svg-container">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                </g>
              </svg>
            </div>
            <input
              placeholder="Search"
              className="bookmarks-search-text"
            ></input>
          </div>
        </div>
        {trendingTags.map((tag, index) => (
          <Link
            key={index}
            to={`/${tag?.randomPost?.user?.formattedUsername}/status/${tag?.randomPost._id}`}
          >
            <SingleTrendingTag tag={tag} />
          </Link>
        ))}
      </div>
      <div className="profile-right flex-column">
        <div className="flex-column premium-subscribe-container explore-who-to-follow">
          <div className="premium-header">
            <h3>Who to follow</h3>
          </div>
          {users &&
            users
              .slice(0, 3)
              .map((user) => <SingleUser key={user.id} user={user} />)}
        </div>
      </div>
    </div>
  );
}

export default Explore;
