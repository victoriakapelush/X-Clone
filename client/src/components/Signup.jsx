/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState({
    originalUsername: "",
    formattedUsername: "",
    email: "",
    password: "",
  });

  const { originalUsername, formattedUsername, email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedUsername = originalUsername
      .toLowerCase()
      .replace(/\s+/g, "");
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/signup",
        inputValue,
        { withCredentials: true },
      );
      const { success, token, message } = data;
      if (success) {
        localStorage.setItem("token", token);
        console.log(token);
        navigate("/home");
      } else {
        setError(message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Internal server error");
    }

    setInputValue({
      originalUsername: "",
      formattedUsername: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex-row register-container">
      <div className="flex-column create-account-container">
        <h1>Create Account</h1>
        <p>We are so excited to have you join us!</p>
      </div>
      <div className="form-container flex-column">
        <h2>Your account</h2>
        <form
          className="flex-column form"
          onSubmit={handleSubmit}
          method="post"
        >
          <input
            placeholder="Username"
            type="text"
            name="originalUsername"
            value={originalUsername}
            onChange={handleOnChange}
          ></input>
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
          ></input>
          <input
            placeholder="Password"
            type="password"
            minLength="3"
            name="password"
            value={password}
            onChange={handleOnChange}
          ></input>
          <p>
            By creating an account you agree to the{" "}
            <a className="policy opacity" href="">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="policy opacity" href="">
              Privacy Policy
            </a>
            .
          </p>
          <button className="old-acc-link signup-button" type="submit">
            Sign up
          </button>
        </form>
        <div className="old-acc-link back-button">
          <Link to="/">Back</Link>
        </div>
        <p className="contact-support">
          Having trouble?{" "}
          <a href="" className="policy opacity">
            Contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default Signup;
