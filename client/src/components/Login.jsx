import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useGoogleOAuth from './GoogleAuth';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const responseMessage = useGoogleOAuth();
  const navigate = useNavigate();
  const notifyError = () => toast.error("User doesn't exist. Please try again.");
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/home');
    } catch (error) {
      notifyError();
      console.error('Login error:', error);
    }
  };
  
    return (
      <div className='login-center'>
        <div className="form-login-container flex-column">
          <div>
            <h1>Sign in to X</h1>
          </div>
            <div className='login-google-button'>
              <div className="google-login-container">
              <GoogleLogin onSuccess={responseMessage} onError={() => { console.log('Login Failed'); }} locale='en' />
                </div>
                <div className='or-border-container flex-row'>
                  <div className='or-border-line'></div>
                  <p>or</p>
                  <div className='or-border-line'></div>
                </div>
              </div>
            <div className="flex-column form-login">
              <form className='actual-form-login flex-row' onSubmit={handleSubmit} method='post'>
                  <input placeholder="Username" className='email-input email-input-login' type="text" name="username" value={credentials.username} onChange={handleChange} required></input>
                  <input placeholder="Email" className='email-input email-input-login' type="email" name="email" value={credentials.email} onChange={handleChange} required></input>
                  <input placeholder="Password" className='password-input email-input-login' type="text" name="password" value={credentials.password} onChange={handleChange} required></input>
                  <button className='old-acc-link signup-button login-signing-button' type='submit'>Sign in</button>
              </form>
            </div>
            <div className='old-acc-link back-button'>
              <Link to='/'>Back</Link>
              <Toaster />
            </div>          
          </div>
        </div>
    )
  }
  
  export default Login