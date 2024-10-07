/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const TokenContext = createContext({
  formattedUsername: "",
  setFormattedUsername: () => {},
  token: "",
  loggedinUserId: "",
  loggedinUserData: {},
  setLoggedinUserData: () => {},
});

export const TokenProvider = ({ children }) => {
  const [formattedUsername, setFormattedUsername] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedinUserId, setLoggedinUserId] = useState("");
  const [loggedinUserData, setLoggedinUserData] = useState({});

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const decodedUsername = decoded.originalUsername
            .toLowerCase()
            .replace(/\s+/g, "");
          setFormattedUsername(decodedUsername);
          setLoggedinUserId(decoded.id);
          setLoggedinUserId(decoded.id || "");

          if (loggedinUserId) {
            // Fetch the user data from the backend
            const response = await axios.get(
              `https://xsocial.onrender.com/profile/${decodedUsername}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            setLoggedinUserData(response.data.userProfile);
          }
        }
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
      }
    };
    fetchTokenData();
  }, [formattedUsername, loggedinUserId, token]);

  return (
    <TokenContext.Provider
      value={{
        formattedUsername,
        setFormattedUsername,
        token,
        loggedinUserId,
        loggedinUserData,
        setLoggedinUserData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
