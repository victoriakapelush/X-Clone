import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const useGoogleOAuth = () => {
  const navigate = useNavigate();

  const responseMessage = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const token = tokenResponse.access_token;
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = userInfo.data;
        if (result) {
          navigate('/home');
        } else {
          console.log('Login failed.');
          navigate('/signup');
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        navigate('/signup');
      }
    },
    onError: () => {
      console.log('Login failed.');
      navigate('/');
    }
  });

  return responseMessage;
};

export default useGoogleOAuth;