import { Link } from "react-router-dom";
import image1 from "../assets/images/x-icon-white.png";
import useGoogleOAuth from "./GoogleAuth";

function App() {
  const responseMessage = useGoogleOAuth();

  return (
    <div className="sign-up-container flex-column">
      <div className="flex-row inner-container">
        <div className="main-images-container">
          <img src={image1} className="main-page-main-image"></img>
        </div>
        <div className="icon-header-container flex-column">
          <h1 className="header">Happening now</h1>
          <p className="join-today">Join today.</p>
          <div className="auth-container">
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
            <div data-text="sign_in_with"></div>
            <div className="flex-row or-border">
              <div className="or-divider"></div>
              <h3>or</h3>
              <div className="or-divider"></div>
            </div>
            <div className="new-acc-link no-top-margin">
              <Link to="/signup">Create account</Link>
            </div>
            <p className="terms-of-service">
              By signing up, you agree to the{" "}
              <span className="small-letters">Terms of Service</span>
              <br />
              and <span className="small-letters">Privacy Policy</span>,
              including <span className="small-letters">Cookie Use.</span>
            </p>
            <h4 className="have-acc-question">Already have an account?</h4>
            <div className="old-acc-link no-top-margin">
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-row footer">
        <nav className="links-footer-container flex-row">
          <a className="link-footer">
            <span className="link-footer-text">About</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Download the X app</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Help Center</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Terms of Service</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Privacy Policy</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Cookie Policy</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Accessibility</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Ads info</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Blog</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Careers</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Brand Resources</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Advertising</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Marketing</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">X for Business</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Developers</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Directory</span>
          </a>
          <a className="link-footer">
            <span className="link-footer-text">Settings</span>
          </a>
          <a
            className="link-footer"
            href="https://victoriakapelush.com"
            target="_blank"
          >
            ©2024 <span className="link-footer-text">Victoria Kapelush</span>
          </a>
        </nav>
      </div>
    </div>
  );
}

export default App;
