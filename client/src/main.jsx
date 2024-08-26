import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import PopupWindow from "./components/PopupWindow.jsx";
import EditProfilePopup from "./components/EditProfilePopup.jsx";
import ToPost from "./components/ToPost.jsx";
import Grok from "./components/Grok.jsx";
import Premium from "./components/Premium.jsx";
import Replies from "./components/Replies.jsx";
import Bookmarks from "./components/Bookmarks.jsx";
import Explore from "./components/Explore.jsx";
import Feeds from "./components/Feeds.jsx";
import Followers from "./components/Followers.jsx";
import ConnectPeople from "./components/ConnectPeople.jsx";
import PostPage from "./components/PostPage.jsx";
import CommentPage from "./components/CommentPage.jsx";
import Messages from "./components/message/Messages.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/index.css";
import { TokenProvider } from "./components/TokenContext.jsx";
import { UserProvider } from "./components/UserContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile/:username",
    element: <Profile />,
  },
  {
    path: "/profile/:username/replies",
    element: <Replies />,
  },
  {
    path: "/profile/:username",
    element: <EditProfilePopup />,
  },
  {
    path: "/home",
    element: <PopupWindow />,
  },
  {
    path: "/home/connect_people",
    element: <ConnectPeople />,
  },
  {
    path: "/",
    element: <ToPost />,
  },
  {
    path: "/grok",
    element: <Grok />,
  },
  {
    path: "/premium",
    element: <Premium />,
  },
  {
    path: "/bookmarks",
    element: <Bookmarks />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/feeds",
    element: <Feeds />,
  },
  {
    path: "/feeds/connect_people",
    element: <ConnectPeople />,
  },
  {
    path: "/:username/followers",
    element: <Followers />,
  },
  {
    path: "/:username/status/:postId",
    element: <PostPage />,
  },
  {
    path: "/post/:username/status/:replyId",
    element: <CommentPage />,
  },
  {
    path: "/messages",
    element: <Messages />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="345678472636-guk838eoghf55jeq1m0ul3iljtkrmocc.apps.googleusercontent.com">
    <React.StrictMode>
      <TokenProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </TokenProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
