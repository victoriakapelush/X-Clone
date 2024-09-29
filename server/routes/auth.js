const express = require("express");
const passport = require("../config-passport");
const router = express.Router();
const { googleAuth } = require("../controllers/googleController");

router.post("/", googleAuth);

// Route to start Google OAuth flow
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
  }),
);

// Route to handle callback and exchange code for tokens
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.redirect("/home");
  },
);

module.exports = router;
