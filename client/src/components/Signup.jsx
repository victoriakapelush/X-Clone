import GoogleButton from 'react-google-button';
import { Link } from 'react-router-dom';

function Signup() {
    return (
      <div className="flex-row register-container">
        <div className="flex-column create-account-container">
            <h1>Create Account</h1>
            <p>We are so excited to have you join us!</p>
        </div>
        <div className="form-container flex-column">
            <h2>Your account</h2>
            <form className="flex-column form">
                <label>Username</label>
                <input></input>
                <label>Email</label>
                <input></input>
                <label>Password</label>
                <input></input>
                <p>By creating an account you agree to the <a className="policy opacity" href="">Terms of Service</a> and <a className="policy opacity" href="">Privacy Policy</a>.</p>
                <button className='back-btn'>Sign up</button>
            </form>
            <div className='flex-row or-border'>
              <div className='or-divider'></div>
              <h3>or</h3>
              <div className='or-divider signup-or-border'></div>
          </div>
            <form className='google-signup'>
              <GoogleButton
                type="light"
                label="Sign up with google"
                onClick={() => { console.log('Google button clicked') }}
              />            
            </form>
            <Link to="/" className='back-btn'>Back</Link>
            <p className='contact-support'>Having trouble? <a href="" className="policy opacity">Contact support</a>.</p>
        </div>
      </div>
    )
  }
  
  export default Signup