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
                <input placeholder='Username'></input>
                <input placeholder='Email'></input>
                <input placeholder='Password'></input>
                <p>By creating an account you agree to the <a className="policy opacity" href="">Terms of Service</a> and <a className="policy opacity" href="">Privacy Policy</a>.</p>
                <button className='old-acc-link signup-button'>Sign up</button>
            </form>
            <div className='old-acc-link back-button'>
              <Link to='/'>Back</Link>
            </div>   
            <p className='contact-support'>Having trouble? <a href="" className="policy opacity">Contact support</a>.</p>
        </div>
      </div>
    )
  }
  
  export default Signup