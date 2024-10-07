import { Link } from "react-router-dom";
import useGoogleOAuth from "./GoogleAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const responseMessage = useGoogleOAuth();
  const navigate = useNavigate();
  const notifyError = () =>
    toast.error("User doesn't exist. Please try again.");
  const [credentials, setCredentials] = useState({
    originalUsername: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedUsername = credentials.originalUsername
      .toLowerCase()
      .replace(/\s+/g, "");
    const updatedCredentials = { ...credentials, formattedUsername };
    try {
      const response = await axios.post(
        "https://xsocial.onrender.com/api/login",
        updatedCredentials,
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (error) {
      notifyError();
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-center">
      <div className="form-login-container flex-column">
        <div>
          <h1>Sign in to X</h1>
        </div>
        <div className="login-google-button">
          <div className="google-login-container">
            <div className="new-acc-link no-top-margin">
              <button className="google-btn" onClick={() => responseMessage()}>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Logo"
                  className="google-logo"
                />
                Continue with Google
              </button>
            </div>
          </div>
          <div className="or-border-container flex-row">
            <div className="or-border-line"></div>
            <p>or</p>
            <div className="or-border-line"></div>
          </div>
        </div>
        <div className="flex-column form-login">
          <form
            className="actual-form-login flex-column"
            onSubmit={handleSubmit}
            method="post"
          >
            <input
              placeholder="Username"
              className="email-input email-input-login no-margin-form"
              type="text"
              name="originalUsername"
              value={credentials.originalUsername}
              onChange={handleChange}
              required
            ></input>
            <input
              placeholder="Email"
              className="email-input email-input-login no-margin-form"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            ></input>
            <input
              placeholder="Password"
              className="password-input email-input-login no-margin-form"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            ></input>
            <button
              className="old-acc-link signup-button login-signing-button"
              type="submit"
            >
              Sign in
            </button>
          </form>
        </div>
        <div className="old-acc-link back-button">
          <Link to="/">Back</Link>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default Login;
