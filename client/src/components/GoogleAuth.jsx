/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const useGoogleOAuth = () => {
  const navigate = useNavigate();

  const responseMessage = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const token = credentialResponse.access_token; // Use access token for userinfo

      console.log("Google login successful, access token:", credentialResponse);

      try {
        // Fetch user info from Google API using the access token
        const userInfo = await axios.get(
          "https://openidconnect.googleapis.com/v1/userinfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const result = userInfo.data;

        // Extract and set the username from Google profile
        if (result) {
          // Delay the navigation slightly to ensure state updates
          setTimeout(() => {
            navigate("/home");
          }, 100);
        } else {
          console.log("Login failed.");
          navigate("/signup");
        }

        // Send user data to backend to create/update user in database
        const backendResponse = await axios.post(
          "http://localhost:3000/api/google/signup",
          {
            email: result.email,
            name: result.name,
            picture: result.picture,
            googleId: result.sub, // Use Google user ID as a unique identifier
          },
        );

        // Handle backend response
        console.log("User created/updated in database:", backendResponse.data);
        localStorage.setItem("token", backendResponse.data.token);
      } catch (error) {
        console.error(
          "Error during token verification or fetching user info:",
          error,
        );
        navigate("/signup");
      }
    },
    scope: "openid email profile", // Request additional scopes as needed
    onError: (error) => {
      console.log("Login failed:", error);
      navigate("/"); // Redirect to homepage or login page on failure
    },
  });

  return responseMessage;
};

export default useGoogleOAuth;
