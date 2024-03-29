import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
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
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
