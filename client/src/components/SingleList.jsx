/* eslint-disable react/prop-types */
import { Link, useNavigate, useParams } from "react-router-dom";
import back from "../assets/icons/back.png";
import HomeNav from "./HomeNav";
import HomeExtra from "./HomeExtra";
import UserContext from "./UserContext";
import { useContext, useEffect, useState } from "react";
import TokenContext from "./TokenContext";
import axios from "axios";

function SingleList() {
  const navigate = useNavigate();
  const { listId } = useParams();
  const { randomUser } = useContext(UserContext);
  const { token } = useContext(TokenContext);
  const [list, setList] = useState();

  console.log("list", list);

  // Fetch all data from a certain list
  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/lists/show/${listId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setList(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchListData();
  }, [listId, token]);

  return (
    <div className="flex-row profile-page">
      <HomeNav />
      <div className="profile-container list-profile-page flex-column">
        <header className="flex-row">
          <Link
            onClick={() => navigate(-1)}
            className="flex-row profile-icon-back"
          >
            <img src={back} />
          </Link>
          <div className="flex-column profile-header-name">
            <h2>{list?.name}</h2>
            <span>@{list?.owner.formattedUsername}</span>
          </div>
        </header>
        {list && list.image ? (
          <div className="background-image-holder">
            <img src={`http://localhost:3000/uploads/${list.image}`} />
          </div>
        ) : (
          <div className="defaul-profile-image-background"></div>
        )}
        <div className="flex-column list-descr-container">
          <h2>{list?.name}</h2>
          <span>{list?.description}</span>
          <Link className="flex-row">
            <img
              className="list-owner-img radius"
              src={`http://localhost:3000/uploads/${list?.owner?.profile.profilePicture}`}
            />
            <Link
              to={`/profile/${list?.owner?.formattedUsername}`}
              className="link-user-list"
            >
              {list?.owner?.profile.updatedName}
            </Link>
            <span className="grey-color">
              {" "}
              &nbsp; @{list?.owner?.formattedUsername}
            </span>
          </Link>
          <Link className="members-list-link">
            {list?.membersCount} <span className="grey-color">members</span>
          </Link>
          <button className="list-edit-profile-btn radius">Edit List</button>
        </div>
        <div className="list-posts-container flex-column">
          <h1>Waiting for posts</h1>
          <span className="grey-color">
            Posts from people in this List will show up here.
          </span>
        </div>
      </div>
      <HomeExtra randomUser={randomUser} />
    </div>
  );
}

export default SingleList;
