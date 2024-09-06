const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
require("./config-passport");

const indexRouter = require("./routes/index");
const authRoutes = require("./routes/auth");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const homePage = require("./routes/homePage");
const profilePage = require("./routes/profilePage");
const post = require("./routes/post");
const singleUser = require("./routes/singleUser");
const randomPosts = require("./routes/randomPosts");
const allUsers = require("./routes/allUsers");
const saveLike = require("./routes/saveLike");
const saveReplyLike = require("./routes/saveReplyLike");
const saveFollowing = require("./routes/saveFollowing");
const bookmarks = require("./routes/bookmarks");
const likes = require("./routes/likes");
const media = require("./routes/media");
const trendingTags = require("./routes/trendingTags");
const feeds = require("./routes/feeds");
const otherUser = require("./routes/otherUser");
const giphy = require("./routes/gifs");
const followers = require("./routes/followers");
const postComment = require("./routes/postComment");
const replyComment = require("./routes/replyComment");
const replies = require("./routes/replies");
const repost = require("./routes/repost");
const userSearch = require("./routes/message routes/searchUsers");
const conversations = require("./routes/message routes/allConvos");
const currentConvos = require("./routes/message routes/currentUserConvos");
const currentLists = require("./routes/list routes/getLists");
const createLists = require("./routes/list routes/getLists");
const listData = require("./routes/list routes/listData");
const deleteList = require("./routes/list routes/listData");
const updateList = require("./routes/list routes/listData");
const addUserToList = require("./routes/list routes/addUser");
const getListMembers = require("./routes/list routes/getMembers");
const sendPost = require("./routes/sendPost");

const app = express();
const mongoDB = process.env.mongoDB;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

mongoose.set("strictQuery", false);

// Connect to MongoDB
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`App is Listening on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "client/dist")));
app.use(express.static(path.join(__dirname, "public")));

// Add session middleware
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
  }),
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/signup", indexRouter, authRoutes);
app.use("/", authRoutes);
app.use("/api/login", loginRouter);
app.use("/home", logoutRouter);
app.use("/home", homePage);
app.use("/api/bookmarks", bookmarks);
app.use("/profile", profilePage);
app.use("/api/profile/post", post);
app.use("/api/profile", singleUser);
app.use("/api/home/posts", randomPosts);
app.use("/home/connect_people", allUsers);
app.use("/api/saveLikeCount", saveLike);
app.use("/api/replies", saveReplyLike);
app.use("/api/profile/likes", likes);
app.use("/api/profile/media", media);
app.use("/api/saveFollowing", saveFollowing);
app.use("/api/trendingTags", trendingTags);
app.use("/feeds", feeds);
app.use("/api/profile/otheruser", otherUser);
app.use("/api/gifs", giphy);
app.use("/api/followers", followers);
app.use("/api/post", postComment);
app.use("/api/reply", replyComment);
app.use("/api/profile/replies", replies);
app.use("/api/repost", repost);
app.use("/api/users/", userSearch);
app.use("/api/messages/conversation", conversations);
app.use("/api/messages/current_conversations", currentConvos);
app.use("/api/lists", currentLists);
app.use("/api/lists/post", createLists);
app.use("/api/lists/show", listData);
app.use("/api/lists/delete", deleteList);
app.use("/api/lists/update", updateList);
app.use("/api/lists/addUser", addUserToList);
app.use("/api/lists/members", getListMembers);
app.use("/api/sendPost", sendPost);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
