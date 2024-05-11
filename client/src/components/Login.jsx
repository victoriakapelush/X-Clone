import { Link } from 'react-router-dom';

function Login() {
    return (
      <div className="flex-row register-container">
        <div className="flex-column create-account-container">
            <h1>Sign in</h1>
            <p>Enter your username and password</p>
        </div>
        <div className="form-container flex-column">
            <h3>Account</h3>
            <form className="flex-column form">
                <input placeholder="username or email" className='email-input'></input>
                <input placeholder="password" className='password-input'></input>
                <button className='back-btn'>Sign in</button>
            </form>
            <Link to="/" className='back-btn login'>Back</Link>
        </div>
      </div>
    )
  }
  
  export default Login