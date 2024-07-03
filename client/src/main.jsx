import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import PopupWindow from './components/PopupWindow.jsx'
import EditProfilePopup from './components/EditProfilePopup.jsx'
import ToPost from './components/ToPost.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import './styles/index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/profile",
    element: <EditProfilePopup />
  },
  {
    path: "/home",
    element: <PopupWindow />
  },
  {
    path: "/",
    element: <ToPost />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="345678472636-guk838eoghf55jeq1m0ul3iljtkrmocc.apps.googleusercontent.com">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
