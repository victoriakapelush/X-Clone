import { Link } from 'react-router-dom';
import image1 from '../assets/images/main-image-1.jpg'
import image2 from '../assets/images/main-image-2.jpg'
import image3 from '../assets/images/main-image-3.jpg'
import image4 from '../assets/images/main-image-4.jpg'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  return (
    <div className='sign-up-container flex-column'>
      <div className='flex-row inner-container'>
        <div className='main-images-container'>
          <img src={image1} className='main-page-main-image'></img>
          <img src={image3} className='main-page-main-image'></img>
          <img src={image4} className='main-page-main-image'></img>
          <img src={image2} className='main-page-main-image forth-image'></img>
        </div>
        <div className='icon-header-container flex-column'>
          <h1 className='header'>BeSocial</h1>
          <p>Linking Lives, Sharing Stories.</p>
          <GoogleOAuthProvider clientId="<your_client_id>">
            <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
                onError={() => {
                  console.log('Login Failed');
                }}
            />
          </GoogleOAuthProvider>
          <Link className='new-acc-link' to='/login'>Sign in</Link>
          <div className='flex-row or-border'>
            <div className='or-divider'></div>
            <h3>or</h3>
            <div className='or-divider'></div>
          </div>
          <Link className='new-acc-link no-top-margin' to='/signup'>Create a new account</Link>
        </div>
      </div>
      <footer className='flex-row'>
        Designed and developed by <a href='https://victoriakapelush.com' target='_blank'>Victoria Kapelush</a>
      </footer>
    </div>
  )
}

export default App
