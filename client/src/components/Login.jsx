import { Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    return (
      <div className='login-center'>
        <div className="form-login-container flex-column">
          <div>
            <h1>Sign in to X</h1>
          </div>
          <GoogleOAuthProvider clientId="<your_client_id>">
            <div className='login-google-button'>
              <div className="google-login-container">
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                  }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                />
                </div>
                <div className='or-border-container flex-row'>
                  <div className='or-border-line'></div>
                  <p>or</p>
                  <div className='or-border-line'></div>
                </div>
              </div>
            </GoogleOAuthProvider>
            <div className="flex-column form-login">
              <form className='actual-form-login flex-row'>
                  <input placeholder="Username or Email" className='email-input email-input-login'></input>
                  <input placeholder="Password" className='password-input email-input-login'></input>
                  <button className='old-acc-link signup-button login-signing-button'>Sign in</button>
              </form>
            </div>
            <div className='old-acc-link back-button'>
              <Link to='/'>Back</Link>
            </div>          
          </div>
        </div>
    )
  }
  
  export default Login