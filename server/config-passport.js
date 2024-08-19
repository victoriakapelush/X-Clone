require("dotenv").config({ path: "./config.env" });
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/User");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const formattedUsername = username.toLowerCase().replace(/\s+/g, "");
      const user = await User.findOne({
        $or: [
          { originalUsername: username },
          { formattedUsername: formattedUsername },
        ],
      });
      if (!user) return done(null, false, { message: "Incorrect username" });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const originalUsername = profile.displayName;
        const formattedUsername = originalUsername
          .toLowerCase()
          .replace(/\s+/g, "");
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            originalUsername: originalUsername,
            formattedUsername: formattedUsername,
            email: profile.emails[0].value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
