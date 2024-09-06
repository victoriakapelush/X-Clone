/* eslint-disable no-unused-vars */
import "../../styles/connectPeople.css";
import back from "../../assets/icons/back.png";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import HomeNav from "../HomeNav";
import SingleUserBriefProfile from "../SingleUserBriefProfile";
import TokenContext from "../TokenContext";

function Members() {
  const [singleUserData, setSingleUserData] = useState(null);
  const [listData, setListData] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(TokenContext);
  const { listId } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/api/lists/members/${listId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSingleUserData(response.data.members);
        setListData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
      getUserData();
  }, [listId, token]);

  useEffect(() => {
    document.title = `Members of ${listData.name} / X`;
  }, []);

  return (
    <div className="flex-row profile-page">
      <HomeNav />
      <div className="connect-center-container flex-column">
        <header className="flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex-row profile-icon-back"
          >
            <img src={back} />
          </button>
          <div className="connect-h2">
            <h2>Members of {listData.name}</h2>
          </div>
        </header>
        {singleUserData && singleUserData.length > 0 ? (
            singleUserData.map((user) => (
                <SingleUserBriefProfile key={user.id} singleUserData={user} />
            ))
            ) : (
            <div className="members-list-empty flex-row grey-color">Members of this List will show up here</div>
            )}
      </div>
      <div className="profile-right flex-column profile-right-no-display">
        <div className="flex-column premium-subscribe-container">
          <div className="premium-header">
            <h3>Subscribe to Premium</h3>
          </div>
          <div className="premium-paragraph">
            <p>
              Subscribe to unlock new features and if eligible, receive a share
              of ads revenue.
            </p>
          </div>
          <button className="new-post-btn radius smaller-size">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

export default Members;